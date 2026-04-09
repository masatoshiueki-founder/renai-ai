import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `あなたは優しく寄り添う恋愛相談の専門家です。
ユーザーの悩みを丁寧に聞いて、以下の3つのセクションで回答してください。

【相手の心理】
相手がどんな気持ちや考えを持っている可能性があるか、心理的な観点から分析します。

【取るべき行動】
ユーザーが具体的にどのような行動を取るべきか、ステップごとにわかりやすく提案します。

【送るメッセージ案】
実際に相手に送れる具体的なメッセージ文案を1〜2つ提案します。自然で温かみのある言葉を使います。

回答は日本語で、温かく共感的なトーンで行ってください。ユーザーの気持ちに寄り添いながら、前向きで実践的なアドバイスをしてください。`;

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AIからの応答を取得できませんでした" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました。しばらくしてからもう一度お試しください。" },
      { status: 500 }
    );
  }
}

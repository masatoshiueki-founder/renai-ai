import { Message } from "@/app/page";

interface Props {
  message: Message;
}

function parseAssistantContent(content: string) {
  const sections: { title: string; emoji: string; body: string }[] = [];

  const sectionPatterns = [
    { key: "【相手の心理】", emoji: "🧠", title: "相手の心理" },
    { key: "【取るべき行動】", emoji: "✨", title: "取るべき行動" },
    { key: "【送るメッセージ案】", emoji: "💌", title: "送るメッセージ案" },
  ];

  let remaining = content;
  const indices: { key: string; emoji: string; title: string; index: number }[] = [];

  for (const pattern of sectionPatterns) {
    const idx = remaining.indexOf(pattern.key);
    if (idx !== -1) {
      indices.push({ ...pattern, index: idx });
    }
  }

  if (indices.length === 0) {
    return null;
  }

  indices.sort((a, b) => a.index - b.index);

  for (let i = 0; i < indices.length; i++) {
    const current = indices[i];
    const next = indices[i + 1];
    const start = current.index + current.key.length;
    const end = next ? next.index : remaining.length;
    const body = remaining.slice(start, end).trim();
    sections.push({ title: current.title, emoji: current.emoji, body });
  }

  return sections;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-pink-400 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  const sections = parseAssistantContent(message.content);

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
        💗
      </div>
      <div className="max-w-[85%] space-y-3">
        {sections ? (
          sections.map((section) => (
            <div
              key={section.title}
              className="bg-white border border-pink-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-base">{section.emoji}</span>
                <span className="text-sm font-semibold text-pink-500">
                  {section.title}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {section.body}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white border border-pink-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

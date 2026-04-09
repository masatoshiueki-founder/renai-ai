import { Message, KoiLogo } from "@/app/page";

interface Props {
  message: Message;
  showAvatar: boolean;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function parseAssistantContent(content: string) {
  const sections: { title: string; emoji: string; body: string }[] = [];

  const sectionPatterns = [
    { key: "【相手の心理】", emoji: "🧠", title: "相手の心理" },
    { key: "【取るべき行動】", emoji: "✨", title: "取るべき行動" },
    { key: "【送るメッセージ案】", emoji: "💌", title: "送るメッセージ案" },
  ];

  const indices: { key: string; emoji: string; title: string; index: number }[] = [];

  for (const pattern of sectionPatterns) {
    const idx = content.indexOf(pattern.key);
    if (idx !== -1) {
      indices.push({ ...pattern, index: idx });
    }
  }

  if (indices.length === 0) return null;

  indices.sort((a, b) => a.index - b.index);

  for (let i = 0; i < indices.length; i++) {
    const current = indices[i];
    const next = indices[i + 1];
    const start = current.index + current.key.length;
    const end = next ? next.index : content.length;
    const body = content.slice(start, end).trim();
    sections.push({ title: current.title, emoji: current.emoji, body });
  }

  return sections;
}

export default function ChatMessage({ message, showAvatar }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-0.5 animate-fade-slide-in mb-1">
        <div className="flex items-end gap-1.5">
          {/* 既読・時刻 */}
          <div className="flex flex-col items-end gap-0.5 pb-0.5">
            <span
              className={`text-[10px] leading-none font-medium transition-colors duration-300 ${
                message.read ? "text-[#06C755]" : "text-gray-400"
              }`}
            >
              {message.read ? "既読" : "未読"}
            </span>
            <span className="text-[10px] text-gray-400 leading-none">
              {formatTime(message.timestamp)}
            </span>
          </div>
          {/* 吹き出し */}
          <div className="max-w-[72%] bg-[#06C755] text-white px-4 py-2.5 rounded-[18px] rounded-br-[4px] shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  // AI メッセージ
  const sections = parseAssistantContent(message.content);

  return (
    <div className="flex items-end gap-2 animate-fade-slide-in mb-1">
      {/* アバター（連続メッセージでは非表示） */}
      <div className="w-9 flex-shrink-0 self-end mb-0.5">
        {showAvatar ? (
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden">
            <KoiLogo size={28} />
          </div>
        ) : null}
      </div>

      <div className="flex items-end gap-1.5 max-w-[72%]">
        <div className="space-y-1.5 flex-1">
          {sections ? (
            sections.map((section) => (
              <div
                key={section.title}
                className="bg-white px-4 py-3 rounded-[18px] rounded-bl-[4px] shadow-sm"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">{section.emoji}</span>
                  <span className="text-xs font-bold text-[#06C755]">{section.title}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {section.body}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white px-4 py-2.5 rounded-[18px] rounded-bl-[4px] shadow-sm">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}
        </div>
        {/* 時刻 */}
        <span className="text-[10px] text-gray-400 pb-1 flex-shrink-0 self-end">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

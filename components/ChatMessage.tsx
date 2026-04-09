import { Message, KoiLogo } from "@/app/page";

interface Props {
  message: Message;
  showAvatar: boolean;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

const SECTION_STYLES = {
  "相手の心理":     { border: "#FF8FAB", label: "#E05580", emoji: "🧠" },
  "取るべき行動":   { border: "#FF9B72", label: "#CC5A30", emoji: "✨" },
  "送るメッセージ案": { border: "#FF8FAB", label: "#E05580", emoji: "💌" },
} as const;

function parseAssistantContent(content: string) {
  const patterns = [
    { key: "【相手の心理】",       title: "相手の心理" as const },
    { key: "【取るべき行動】",     title: "取るべき行動" as const },
    { key: "【送るメッセージ案】", title: "送るメッセージ案" as const },
  ];

  const indices = patterns
    .map((p) => ({ ...p, index: content.indexOf(p.key) }))
    .filter((p) => p.index !== -1)
    .sort((a, b) => a.index - b.index);

  if (indices.length === 0) return null;

  return indices.map((cur, i) => {
    const next = indices[i + 1];
    const body = content.slice(cur.index + cur.key.length, next?.index ?? content.length).trim();
    return { title: cur.title, body };
  });
}

export default function ChatMessage({ message, showAvatar }: Props) {
  const isUser = message.role === "user";

  /* ── ユーザー ── */
  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-0.5 animate-pop-in mb-1">
        <div className="flex items-end gap-1.5">
          {/* 既読 / 時刻 */}
          <div className="flex flex-col items-end gap-0.5 pb-0.5">
            <span
              className="text-[10px] font-medium leading-none transition-colors duration-500"
              style={{ color: message.read ? "#FF6B6B" : "#BBBBBB" }}
            >
              {message.read ? "既読" : "未読"}
            </span>
            <span className="text-[10px] text-gray-400 leading-none">
              {formatTime(message.timestamp)}
            </span>
          </div>
          {/* バブル */}
          <div
            className="max-w-[72%] text-white text-sm leading-relaxed px-4 py-2.5 rounded-[20px] rounded-br-[5px] shadow-sm whitespace-pre-wrap"
            style={{ background: "#FF6B6B" }}
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  /* ── AI ── */
  const sections = parseAssistantContent(message.content);

  return (
    <div className="flex items-end gap-2 animate-pop-in mb-1">
      {/* アバター */}
      <div className="w-8 flex-shrink-0 self-end mb-0.5">
        {showAvatar && (
          <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <KoiLogo size={22} />
          </div>
        )}
      </div>

      <div className="flex items-end gap-1.5 max-w-[78%]">
        <div className="space-y-1.5 flex-1">
          {sections ? (
            sections.map((section) => {
              const s = SECTION_STYLES[section.title] ?? {
                border: "#D1D5DB", label: "#6B7280", emoji: "💬",
              };
              return (
                <div
                  key={section.title}
                  className="bg-white rounded-[20px] rounded-bl-[5px] shadow-sm overflow-hidden"
                  style={{ border: "1px solid #F0F0F0", borderLeft: `3px solid ${s.border}` }}
                >
                  <div className="px-4 pt-3 pb-0.5 flex items-center gap-1.5">
                    <span className="text-sm">{s.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: s.label }}>
                      {section.title}
                    </span>
                  </div>
                  <p className="px-4 pt-1.5 pb-3 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {section.body}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-gray-100 rounded-[20px] rounded-bl-[5px] shadow-sm px-4 py-2.5">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}
        </div>

        <span className="text-[10px] text-gray-400 pb-1 flex-shrink-0 self-end whitespace-nowrap">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

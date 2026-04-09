import { Message, KoiLogo } from "@/app/page";

interface Props {
  message: Message;
  showAvatar: boolean;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

const SECTION_STYLES = {
  "相手の心理": {
    gradient: "linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)",
    border: "2px solid rgba(192,132,252,0.4)",
    labelColor: "#a855f7",
    emoji: "🧠",
  },
  "取るべき行動": {
    gradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    border: "2px solid rgba(244,114,182,0.4)",
    labelColor: "#ec4899",
    emoji: "✨",
  },
  "送るメッセージ案": {
    gradient: "linear-gradient(135deg, #eff6ff 0%, #ede9fe 100%)",
    border: "2px solid rgba(129,140,248,0.4)",
    labelColor: "#6366f1",
    emoji: "💌",
  },
} as const;

function parseAssistantContent(content: string) {
  const patterns = [
    { key: "【相手の心理】",      title: "相手の心理" as const },
    { key: "【取るべき行動】",    title: "取るべき行動" as const },
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

  /* ── ユーザーメッセージ ── */
  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-0.5 animate-pop-in mb-2">
        <div className="flex items-end gap-2">
          {/* 既読 / 時刻 */}
          <div className="flex flex-col items-end gap-0.5 pb-1">
            <span
              className="text-[10px] font-semibold leading-none transition-all duration-500"
              style={{ color: message.read ? "#86efac" : "rgba(255,255,255,0.5)" }}
            >
              {message.read ? "既読" : "未読"}
            </span>
            <span className="text-[10px] leading-none text-white/45">
              {formatTime(message.timestamp)}
            </span>
          </div>
          {/* 吹き出し */}
          <div
            className="bubble-user max-w-[72%] text-white px-4 py-2.5 rounded-[20px] rounded-br-[5px] font-medium"
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── AI メッセージ ── */
  const sections = parseAssistantContent(message.content);

  return (
    <div className="flex items-end gap-2 animate-pop-in mb-2">
      {/* アバター */}
      <div className="w-9 flex-shrink-0 self-end mb-1">
        {showAvatar && (
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "rgba(255,255,255,0.22)",
              border: "1.5px solid rgba(255,255,255,0.45)",
              backdropFilter: "blur(12px)",
            }}
          >
            <KoiLogo size={26} />
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 max-w-[76%]">
        <div className="space-y-2 flex-1">
          {sections ? (
            sections.map((section) => {
              const s = SECTION_STYLES[section.title] ?? {
                gradient: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
                border: "2px solid rgba(156,163,175,0.3)",
                labelColor: "#6b7280",
                emoji: "💬",
              };
              return (
                <div
                  key={section.title}
                  className="px-4 py-3 rounded-[20px] rounded-bl-[5px] shadow-md"
                  style={{
                    background: s.gradient,
                    border: s.border,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">{s.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: s.labelColor }}>
                      {section.title}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {section.body}
                  </p>
                </div>
              );
            })
          ) : (
            <div
              className="px-4 py-3 rounded-[20px] rounded-bl-[5px] shadow-md"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(16px)",
              }}
            >
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}
        </div>

        {/* 時刻 */}
        <span className="text-[10px] text-white/45 pb-1 flex-shrink-0 self-end whitespace-nowrap">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

import { Message, KoiLogo } from "@/app/page";

interface Props {
  message: Message;
  showAvatar: boolean;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

const SECTION_STYLES: Record<string, { bg: string; border: string; label: string; emoji: string }> = {
  "相手の心理": {
    bg: "from-violet-50 to-purple-50",
    border: "border-l-4 border-violet-300",
    label: "text-violet-600",
    emoji: "🧠",
  },
  "取るべき行動": {
    bg: "from-sky-50 to-blue-50",
    border: "border-l-4 border-sky-400",
    label: "text-sky-600",
    emoji: "✨",
  },
  "送るメッセージ案": {
    bg: "from-rose-50 to-pink-50",
    border: "border-l-4 border-rose-300",
    label: "text-rose-500",
    emoji: "💌",
  },
};

function parseAssistantContent(content: string) {
  const sectionPatterns = [
    { key: "【相手の心理】", title: "相手の心理" },
    { key: "【取るべき行動】", title: "取るべき行動" },
    { key: "【送るメッセージ案】", title: "送るメッセージ案" },
  ];

  const indices: { title: string; index: number; keyLen: number }[] = [];
  for (const p of sectionPatterns) {
    const idx = content.indexOf(p.key);
    if (idx !== -1) indices.push({ title: p.title, index: idx, keyLen: p.key.length });
  }
  if (indices.length === 0) return null;

  indices.sort((a, b) => a.index - b.index);

  return indices.map((cur, i) => {
    const next = indices[i + 1];
    const body = content.slice(cur.index + cur.keyLen, next?.index ?? content.length).trim();
    return { title: cur.title, body };
  });
}

export default function ChatMessage({ message, showAvatar }: Props) {
  const isUser = message.role === "user";

  /* ── ユーザーメッセージ ── */
  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-0.5 animate-fade-slide-in mb-1">
        <div className="flex items-end gap-1.5">
          {/* 既読 / 時刻 */}
          <div className="flex flex-col items-end gap-0.5 pb-0.5">
            <span
              className={`text-[10px] leading-none font-semibold transition-all duration-500 ${
                message.read ? "text-emerald-500" : "text-gray-400"
              }`}
            >
              {message.read ? "既読" : "未読"}
            </span>
            <span className="text-[10px] text-gray-400 leading-none">
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* 吹き出し */}
          <div
            className="max-w-[72%] text-white px-4 py-2.5 rounded-[18px] rounded-br-[4px] shadow-md"
            style={{
              background: "linear-gradient(135deg, #06C755 0%, #00c896 100%)",
              boxShadow: "0 2px 8px rgba(6,199,85,0.35)",
            }}
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
    <div className="flex items-end gap-2 animate-fade-slide-in mb-1">
      {/* アバター */}
      <div className="w-9 flex-shrink-0 self-end mb-0.5">
        {showAvatar && (
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <KoiLogo size={28} />
          </div>
        )}
      </div>

      <div className="flex items-end gap-1.5 max-w-[76%]">
        <div className="space-y-2 flex-1">
          {sections ? (
            sections.map((section) => {
              const style = SECTION_STYLES[section.title] ?? {
                bg: "from-gray-50 to-white",
                border: "border-l-4 border-gray-300",
                label: "text-gray-600",
                emoji: "💬",
              };
              return (
                <div
                  key={section.title}
                  className={`bg-gradient-to-br ${style.bg} ${style.border} rounded-[18px] rounded-bl-[4px] px-4 py-3 shadow-sm`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">{style.emoji}</span>
                    <span className={`text-xs font-bold ${style.label}`}>{section.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {section.body}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="bg-white px-4 py-2.5 rounded-[18px] rounded-bl-[4px] shadow-sm">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}
        </div>

        {/* 時刻 */}
        <span className="text-[10px] text-gray-400 pb-1 flex-shrink-0 self-end whitespace-nowrap">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

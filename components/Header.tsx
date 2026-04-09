import { KoiLogo } from "@/app/page";

interface Props {
  isTyping: boolean;
}

export default function Header({ isTyping }: Props) {
  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "0 4px 32px rgba(168,85,247,0.15)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* ロゴアイコン */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.25)",
            border: "1.5px solid rgba(255,255,255,0.5)",
            boxShadow: "0 2px 12px rgba(168,85,247,0.25), inset 0 1px 1px rgba(255,255,255,0.6)",
          }}
        >
          <KoiLogo size={32} />
        </div>

        {/* テキスト */}
        <div className="flex-1 min-w-0">
          <h1
            className="font-extrabold text-base leading-tight tracking-wide text-white drop-shadow-sm"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            KoiAI
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isTyping ? (
              <>
                <span className="text-white/80 text-xs font-medium">入力中</span>
                <span className="flex gap-0.5 items-center">
                  <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce" />
                </span>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-300" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <span className="text-white/75 text-xs font-medium">オンライン</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

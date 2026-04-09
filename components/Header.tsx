import { KoiLogo } from "@/app/page";

interface Props {
  isTyping: boolean;
}

export default function Header({ isTyping }: Props) {
  return (
    <header
      className="sticky top-0 z-10 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #06C755 0%, #00b894 50%, #00cec9 100%)",
      }}
    >
      {/* 光沢オーバーレイ */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
        {/* ロゴ */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
          style={{
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8)",
          }}
        >
          <KoiLogo size={34} />
        </div>

        {/* テキスト */}
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-extrabold text-base leading-tight tracking-wide drop-shadow-sm">
            KoiAI
          </h1>
          <div className="flex items-center gap-1.5 h-4 mt-0.5">
            {isTyping ? (
              <>
                <span className="text-white/90 text-xs font-medium">入力中</span>
                <span className="flex gap-0.5 items-center">
                  <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" />
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span className="text-white/85 text-xs">オンライン</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

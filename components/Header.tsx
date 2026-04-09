import { KoiLogo } from "@/app/page";

interface Props {
  isTyping: boolean;
}

export default function Header({ isTyping }: Props) {
  return (
    <header className="bg-[#06C755] sticky top-0 z-10 shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
        {/* ロゴアイコン */}
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <KoiLogo size={34} />
        </div>

        {/* テキスト */}
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base leading-tight tracking-wide">
            KoiAI
          </h1>
          <div className="flex items-center gap-1.5 h-4">
            {isTyping ? (
              <>
                <span className="text-white/90 text-xs">入力中</span>
                <span className="flex gap-0.5 items-center">
                  <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" />
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                <span className="text-white/80 text-xs">オンライン</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

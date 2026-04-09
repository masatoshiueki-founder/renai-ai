import { KoiLogo } from "@/app/page";

interface Props {
  isTyping: boolean;
}

export default function Header({ isTyping }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* ロゴ */}
        <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0">
          <KoiLogo size={30} />
        </div>

        {/* テキスト */}
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-[15px] text-gray-900 leading-tight">KoiAI</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isTyping ? (
              <span className="text-[11px] text-[#FF6B6B] font-medium">入力中…</span>
            ) : (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
                <span className="text-[11px] text-gray-400">オンライン</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white text-lg shadow-sm">
          💗
        </div>
        <div>
          <h1 className="text-lg font-bold text-pink-500">KoiAI</h1>
          <p className="text-xs text-gray-400">Love advice, powered by AI</p>
        </div>
      </div>
    </header>
  );
}

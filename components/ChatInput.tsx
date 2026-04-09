"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSend(text);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const canSend = text.trim() && !isLoading;

  return (
    <div className="bg-[#F0F0F0] border-t border-gray-200 px-3 py-2 flex items-end gap-2">
      <div className="flex-1 bg-white rounded-full border border-gray-300 px-4 py-2 flex items-end">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="メッセージを入力"
          disabled={isLoading}
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed max-h-32 scrollbar-thin"
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150
          ${canSend
            ? "bg-[#06C755] hover:bg-[#05b34c] active:scale-95 shadow-sm"
            : "bg-gray-300 cursor-not-allowed"
          }
        `}
        aria-label="送信"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-white"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
}

export function SMSInputBar() {
  return (
    <div className="bg-[#d1d5db] border-t-[3px] border-deep-black shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      <div className="max-w-md mx-auto p-4 pb-8 flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          {/* Add button */}
          <button className="size-10 flex items-center justify-center bg-gray-200 border-2 border-deep-black rounded shadow-[2px_2px_0px_#131315]">
            <PlusIcon className="w-5 h-5 text-deep-black" />
          </button>

          {/* Input field */}
          <div className="flex-1 h-12 bg-white border-2 border-deep-black shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] rounded flex items-center px-3">
            <span className="font-pixel text-xl text-gray-400 animate-pulse">Type a reply...|</span>
          </div>

          {/* Send button */}
          <button className="h-12 px-4 flex items-center justify-center bg-lime border-2 border-deep-black rounded shadow-hard hover:-translate-y-1 hover:shadow-hard-lg transition-all">
            <SendIcon className="w-5 h-5 text-deep-black" />
          </button>
        </div>

        {/* Fake keyboard hint */}
        <div className="grid grid-cols-5 gap-1 opacity-60">
          <div className="h-8 bg-gray-300 border-b-2 border-gray-400 rounded-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
            123
          </div>
          <div className="col-span-3 h-8 bg-gray-300 border-b-2 border-gray-400 rounded-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
            SPACE
          </div>
          <div className="h-8 bg-gray-300 border-b-2 border-gray-400 rounded-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
            RETURN
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

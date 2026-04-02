type Props = {
  wordsCount: number;
  target?: number;
  progress: number;
};

export default function ProgressBar({
  wordsCount,
  target = 2000,
  progress,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-white/5 p-6 rounded-2xl border border-white/10 mb-6 shadow-lg backdrop-blur-md">
      
      {/* subtle glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 blur-2xl" />

      <div className="relative">
        {/* TOP INFO */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-300 font-medium">
            📊 Learning Progress
          </span>

          <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300">
            {wordsCount} / {target}
          </span>
        </div>

        {/* PERCENT */}
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Start</span>
          <span className="text-purple-300 font-medium">
            {progress.toFixed(1)}%
          </span>
          <span>Goal</span>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden relative">
          
          {/* animated fill */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />

          {/* shine effect */}
          <div className="absolute inset-0 animate-pulse opacity-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* motivational text */}
        <p className="text-xs text-gray-400 mt-3">
          Keep going — consistency beats intensity 🚀
        </p>
      </div>
    </div>
  );
}
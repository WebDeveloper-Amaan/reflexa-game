import type { Difficulty, GameState } from '@/hooks/useSimonGame';

interface GameControlsProps {
  gameState: GameState;
  difficulty: Difficulty;
  onStart: () => void;
  onSetDifficulty: (d: Difficulty) => void;
  sequenceLength: number;
  playerProgress: number;
}

export function GameControls({
  gameState,
  difficulty,
  onStart,
  onSetDifficulty,
  sequenceLength,
  playerProgress,
}: GameControlsProps) {
  const canChangeDifficulty = gameState === 'idle' || gameState === 'failed';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Status Message */}
      <StatusMessage
        gameState={gameState}
        sequenceLength={sequenceLength}
        playerProgress={playerProgress}
      />

      {/* Difficulty Selector */}
      {canChangeDifficulty && (
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => onSetDifficulty(d)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
                ${difficulty === d
                  ? d === 'easy'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : d === 'medium'
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Start / Restart Button */}
      <button
        onClick={onStart}
        disabled={gameState === 'showing' || gameState === 'levelUp'}
        className={`
          relative px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest
          transition-all duration-300 overflow-hidden
          ${gameState === 'showing' || gameState === 'levelUp'
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : gameState === 'failed'
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95'
            : gameState === 'idle'
            ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95'
            : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 hover:scale-105 active:scale-95'
          }
        `}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        <span className="relative z-10">
          {gameState === 'idle' && '🎮 Start Game'}
          {gameState === 'showing' && '👀 Watch...'}
          {gameState === 'playing' && '🔄 Restart'}
          {gameState === 'failed' && '💀 Try Again'}
          {gameState === 'levelUp' && '🎉 Level Up!'}
          {gameState === 'success' && '✨ Next Level'}
        </span>
      </button>

      {/* Progress Dots */}
      {(gameState === 'playing' || gameState === 'showing') && sequenceLength > 0 && (
        <div className="flex items-center gap-1.5 mt-1">
          {Array.from({ length: sequenceLength }).map((_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${i < playerProgress
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 scale-110'
                  : i === playerProgress && gameState === 'playing'
                  ? 'bg-white/60 animate-pulse'
                  : 'bg-white/15'
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusMessage({
  gameState,
  sequenceLength,
  playerProgress,
}: {
  gameState: GameState;
  sequenceLength: number;
  playerProgress: number;
}) {
  const messages: Record<GameState, string> = {
    idle: 'Press Start to Begin!',
    showing: 'Watch the sequence carefully...',
    playing: `Your turn! ${playerProgress}/${sequenceLength}`,
    success: 'Perfect! Get ready...',
    failed: 'Game Over! Try again?',
    levelUp: '🎉 Amazing! Level Up!',
  };

  const colors: Record<GameState, string> = {
    idle: 'text-slate-400',
    showing: 'text-amber-400',
    playing: 'text-cyan-400',
    success: 'text-emerald-400',
    failed: 'text-rose-400',
    levelUp: 'text-yellow-400',
  };

  return (
    <p className={`text-sm font-medium ${colors[gameState]} transition-colors duration-300 min-h-[20px]`}>
      {messages[gameState]}
    </p>
  );
}

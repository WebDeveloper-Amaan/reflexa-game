import type { GameState } from '@/hooks/useSimonGame';

interface CenterDisplayProps {
  gameState: GameState;
  level: number;
  score: number;
}

export function CenterDisplay({ gameState, level, score }: CenterDisplayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className={`
        w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] md:w-[95px] md:h-[95px]
        rounded-full bg-slate-900/95 backdrop-blur-sm
        border-2 border-white/10
        flex flex-col items-center justify-center
        shadow-2xl shadow-black/50
        transition-all duration-500
        ${gameState === 'levelUp' ? 'scale-110 border-yellow-400/50' : ''}
        ${gameState === 'failed' ? 'border-red-400/50' : ''}
        ${gameState === 'showing' ? 'border-amber-400/30 animate-pulse' : ''}
      `}>
        {gameState === 'idle' ? (
          <div className="text-center">
            <div className="text-xl sm:text-2xl">🎵</div>
            <div className="text-[8px] text-slate-500 mt-0.5 font-medium">REFLEXA</div>
          </div>
        ) : gameState === 'failed' ? (
          <div className="text-center">
            <div className="text-xl sm:text-2xl">💀</div>
            <div className="text-[8px] text-slate-500 mt-0.5 font-medium">GAME OVER</div>
          </div>
        ) : gameState === 'levelUp' ? (
          <div className="text-center">
            <div className="text-lg sm:text-xl font-black text-yellow-400">{level}</div>
            <div className="text-[8px] text-yellow-400/60 font-bold">LEVEL UP!</div>
          </div>
        ) : gameState === 'showing' ? (
          <div className="text-center">
            <div className="text-xl sm:text-2xl animate-pulse">👀</div>
            <div className="text-[8px] text-amber-400 mt-0.5 font-bold">WATCH</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-lg sm:text-xl font-black text-white/90">{level}</div>
            <div className="text-[8px] text-slate-500 font-medium">LVL</div>
            <div className="text-[9px] text-violet-400 font-bold mt-0.5">{score}</div>
          </div>
        )}
      </div>
    </div>
  );
}

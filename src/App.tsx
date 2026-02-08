import { useSimonGame } from '@/hooks/useSimonGame';
import { SimonButton } from '@/components/SimonButton';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameControls } from '@/components/GameControls';
import { CenterDisplay } from '@/components/CenterDisplay';
import { useEffect, useState } from 'react';

export function App() {
  const game = useSimonGame();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  // Spawn particles on level up
  useEffect(() => {
    if (game.gameState === 'levelUp') {
      const colors = ['#34d399', '#f87171', '#fbbf24', '#60a5fa', '#a78bfa', '#f472b6'];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 40,
        y: 50 + (Math.random() - 0.5) * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1500);
    }
  }, [game.gameState]);

  // Check new high score
  useEffect(() => {
    if (game.gameState === 'failed' && game.score === game.highScore && game.score > 0) {
      game.celebrateHighScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.gameState, game.score, game.highScore]);

  const isPlaying = game.gameState === 'playing';
  const isShowingOrLevelUp = game.gameState === 'showing' || game.gameState === 'levelUp';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/3 rounded-full blur-[120px]" />
      </div>

      {/* Celebration particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-[particle_1.5s_ease-out_forwards] pointer-events-none z-50"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          aria-hidden="true"
        />
      ))}

      <main className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 w-full max-w-[635px]">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              REFLEXA
            </span>
          </h1>
          <p className="text-slate-600 text-[10px] lg:text-xs mt-0.5 lg:mt-1 tracking-widest uppercase font-medium">
            Memory & Reflex Challenge
          </p>
        </header>

        {/* Controls & Status - TOP */}
        <nav aria-label="Game controls">
          <GameControls
            gameState={game.gameState}
            difficulty={game.difficulty}
            onStart={game.startGame}
            onSetDifficulty={game.setDifficulty}
            sequenceLength={game.sequence.length}
            playerProgress={game.playerSequence.length}
          />
        </nav>

        {/* Status hint */}
        <div className="text-center" role="status" aria-live="polite">
          <p className="text-slate-700 text-[10px] tracking-wider">
            {isShowingOrLevelUp
              ? '🔊 LISTEN & WATCH CAREFULLY'
              : isPlaying
              ? '👆 REPEAT THE PATTERN'
              : '🎮 PRESS START TO PLAY'
            }
          </p>
        </div>

        {/* Game Board */}
        <section className="relative" aria-label="Game board">
          {/* Outer glow ring */}
          <div className={`
            absolute -inset-3 sm:-inset-4 rounded-full transition-all duration-700
            ${game.gameState === 'failed' ? 'bg-red-500/10 shadow-[0_0_60px_20px_rgba(239,68,68,0.1)]' : ''}
            ${game.gameState === 'levelUp' ? 'bg-yellow-500/10 shadow-[0_0_60px_20px_rgba(234,179,8,0.1)]' : ''}
            ${game.gameState === 'playing' ? 'bg-cyan-500/5 shadow-[0_0_40px_10px_rgba(34,211,238,0.05)]' : ''}
          `} aria-hidden="true" />

          {/* Game grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 relative" role="group" aria-label="Color buttons">
            <SimonButton
              colorIndex={0}
              isActive={game.activeButton === 0}
              isDisabled={!isPlaying}
              onClick={game.handlePlayerInput}
            />
            <SimonButton
              colorIndex={1}
              isActive={game.activeButton === 1}
              isDisabled={!isPlaying}
              onClick={game.handlePlayerInput}
            />
            <SimonButton
              colorIndex={2}
              isActive={game.activeButton === 2}
              isDisabled={!isPlaying}
              onClick={game.handlePlayerInput}
            />
            <SimonButton
              colorIndex={3}
              isActive={game.activeButton === 3}
              isDisabled={!isPlaying}
              onClick={game.handlePlayerInput}
            />

            {/* Center circle */}
            <CenterDisplay
              gameState={game.gameState}
              level={game.level}
              score={game.score}
            />
          </div>
        </section>

        {/* Scoreboard - BOTTOM */}
        <aside aria-label="Game statistics">
          <ScoreBoard
            score={game.score}
            highScore={game.highScore}
            level={game.level}
            streak={game.streak}
          />
        </aside>

        {/* New High Score Banner */}
        {game.gameState === 'failed' && game.score === game.highScore && game.score > 0 && (
          <div className="animate-bounce text-center" role="alert" aria-live="assertive">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
              <span className="text-lg" aria-hidden="true">🏆</span>
              <span className="text-yellow-400 font-bold text-sm">New High Score!</span>
              <span className="text-lg" aria-hidden="true">🏆</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useSimonGame } from '@/hooks/useSimonGame';
import { SimonButton } from '@/components/SimonButton';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameControls } from '@/components/GameControls';
import { CenterDisplay } from '@/components/CenterDisplay';
import { WelcomeModal } from '@/components/WelcomeModal';
import { useEffect, useState } from 'react';

const KEY_MAP: Record<string, number> = { a: 0, w: 1, s: 2, d: 3 };

export function App() {
  const game = useSimonGame();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  // Keyboard shortcut support: A=green, W=red, S=yellow, D=blue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const index = KEY_MAP[e.key.toLowerCase()];
      if (index !== undefined) {
        setPressedIndex(index);
        game.handlePlayerInput(index);
        setTimeout(() => setPressedIndex(null), 150);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.handlePlayerInput]);

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('reflexa-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('reflexa-visited', 'true');
    }
  }, []);

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
    <>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      
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
              ? '👆 CLICK OR PRESS A · W · S · D'
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
              isKeyPressed={pressedIndex === 0}
              onClick={game.handlePlayerInput}
            />
            <SimonButton
              colorIndex={1}
              isActive={game.activeButton === 1}
              isDisabled={!isPlaying}
              isKeyPressed={pressedIndex === 1}
              onClick={game.handlePlayerInput}
            />
            <SimonButton
              colorIndex={2}
              isActive={game.activeButton === 2}
              isDisabled={!isPlaying}
              isKeyPressed={pressedIndex === 2}
              onClick={game.handlePlayerInput}
            />
            <SimonButton
              colorIndex={3}
              isActive={game.activeButton === 3}
              isDisabled={!isPlaying}
              isKeyPressed={pressedIndex === 3}
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

        {/* Footer */}
        <footer className="text-center mt-6 pt-4 border-t border-white/5">
          <p className="text-slate-500 text-xs mb-2">
            Built & Designed by <span className="text-slate-400 font-semibold">Amaan Ahmed</span>
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/WebDeveloper-Amaan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/amaanahmedcoder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/coderamaan?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
    </>
  );
}

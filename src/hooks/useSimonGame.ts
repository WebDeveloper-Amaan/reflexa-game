import { useState, useCallback, useRef, useEffect } from 'react';
import { playTone, playFailSound, playLevelUpSound, playSuccessSound } from '@/utils/sounds';
import { saveGameRecord, getHighScore } from '@/utils/storage';

export type GameState = 'idle' | 'showing' | 'playing' | 'success' | 'failed' | 'levelUp';
export type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  easy: 600,
  medium: 400,
  hard: 250,
};

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

export interface SimonGameState {
  sequence: number[];
  playerSequence: number[];
  gameState: GameState;
  level: number;
  score: number;
  highScore: number;
  activeButton: number | null;
  difficulty: Difficulty;
  streak: number;
}

export function useSimonGame() {
  const [state, setState] = useState<SimonGameState>({
    sequence: [],
    playerSequence: [],
    gameState: 'idle',
    level: 1,
    score: 0,
    highScore: getHighScore(),
    activeButton: null,
    difficulty: 'medium',
    streak: 0,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const generateNext = useCallback((currentSequence: number[]): number[] => {
    const next = Math.floor(Math.random() * 4);
    return [...currentSequence, next];
  }, []);

  const showSequence = useCallback((sequence: number[], difficulty: Difficulty) => {
    setState(prev => ({ ...prev, gameState: 'showing', activeButton: null }));
    const speed = DIFFICULTY_SPEEDS[difficulty];

    sequence.forEach((colorIndex, i) => {
      const showTimeout = setTimeout(() => {
        setState(prev => ({ ...prev, activeButton: colorIndex }));
        playTone(colorIndex, speed * 0.8);
      }, (i + 1) * (speed + 200));

      const hideTimeout = setTimeout(() => {
        setState(prev => ({ ...prev, activeButton: null }));
      }, (i + 1) * (speed + 200) + speed);

      timeoutRef.current.push(showTimeout, hideTimeout);
    });

    const finishTimeout = setTimeout(() => {
      setState(prev => ({ ...prev, gameState: 'playing', activeButton: null }));
    }, (sequence.length + 1) * (speed + 200) + 100);

    timeoutRef.current.push(finishTimeout);
  }, []);

  const startGame = useCallback(() => {
    clearTimeouts();
    const newSequence = generateNext([]);
    setState(prev => ({
      ...prev,
      sequence: newSequence,
      playerSequence: [],
      gameState: 'showing',
      level: 1,
      score: 0,
      streak: 0,
      activeButton: null,
    }));

    setTimeout(() => {
      showSequence(newSequence, state.difficulty);
    }, 500);
  }, [clearTimeouts, generateNext, showSequence, state.difficulty]);

  const handlePlayerInput = useCallback((colorIndex: number) => {
    if (state.gameState !== 'playing') return;

    playTone(colorIndex, 200);

    const newPlayerSequence = [...state.playerSequence, colorIndex];
    const currentIndex = newPlayerSequence.length - 1;

    // Check if the input is correct
    if (state.sequence[currentIndex] !== colorIndex) {
      // Wrong input
      playFailSound();
      const finalScore = state.score;
      saveGameRecord({
        score: finalScore,
        level: state.level,
        date: new Date().toISOString(),
        streak: state.streak,
      });
      setState(prev => ({
        ...prev,
        gameState: 'failed',
        playerSequence: newPlayerSequence,
        highScore: Math.max(prev.highScore, finalScore),
      }));
      return;
    }

    // Correct input
    if (newPlayerSequence.length === state.sequence.length) {
      // Completed the sequence
      const pointsEarned = Math.round(
        state.level * 10 * DIFFICULTY_MULTIPLIER[state.difficulty]
      );
      const newScore = state.score + pointsEarned;
      const newLevel = state.level + 1;
      const newStreak = state.streak + 1;

      // Level up!
      playLevelUpSound();
      setState(prev => ({
        ...prev,
        gameState: 'levelUp',
        score: newScore,
        level: newLevel,
        streak: newStreak,
        playerSequence: [],
        highScore: Math.max(prev.highScore, newScore),
      }));

      const nextSequence = generateNext(state.sequence);

      const nextTimeout = setTimeout(() => {
        setState(prev => ({ ...prev, sequence: nextSequence }));
        showSequence(nextSequence, state.difficulty);
      }, 1200);

      timeoutRef.current.push(nextTimeout);
    } else {
      setState(prev => ({
        ...prev,
        playerSequence: newPlayerSequence,
      }));
    }
  }, [state, generateNext, showSequence]);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    if (state.gameState === 'idle' || state.gameState === 'failed') {
      setState(prev => ({ ...prev, difficulty }));
    }
  }, [state.gameState]);

  const celebrateHighScore = useCallback(() => {
    playSuccessSound();
  }, []);

  return {
    ...state,
    startGame,
    handlePlayerInput,
    setDifficulty,
    celebrateHighScore,
  };
}

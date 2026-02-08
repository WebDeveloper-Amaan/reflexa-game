// LocalStorage utilities for saving game records

export interface GameRecord {
  score: number;
  level: number;
  date: string;
  streak: number;
}

const STORAGE_KEY = 'simon-says-records';
const HIGH_SCORE_KEY = 'simon-says-highscore';

export function saveGameRecord(record: GameRecord): void {
  try {
    const records = getGameRecords();
    records.unshift(record);
    // Keep only last 20 records
    const trimmed = records.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    // Update high score
    const currentHigh = getHighScore();
    if (record.score > currentHigh) {
      localStorage.setItem(HIGH_SCORE_KEY, String(record.score));
    }
  } catch {
    // Storage not available
  }
}

export function getGameRecords(): GameRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getHighScore(): number {
  try {
    const score = localStorage.getItem(HIGH_SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
  } catch {
    return 0;
  }
}

export function clearRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HIGH_SCORE_KEY);
  } catch {
    // Storage not available
  }
}

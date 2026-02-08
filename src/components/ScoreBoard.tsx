import { getGameRecords } from '@/utils/storage';
import { useState } from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
  streak: number;
}

export function ScoreBoard({ score, highScore, level, streak }: ScoreBoardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const records = getGameRecords();

  return (
    <>
      {/* Main Score Display */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4">
        <ScoreCard label="Score" value={score} icon="🎯" color="from-violet-500 to-purple-600" />
        <ScoreCard label="Level" value={level} icon="⚡" color="from-amber-500 to-orange-600" />
        <ScoreCard label="Best" value={highScore} icon="🏆" color="from-emerald-500 to-green-600" />
        {streak > 0 && (
          <ScoreCard label="Streak" value={streak} icon="🔥" color="from-rose-500 to-pink-600" />
        )}
      </div>

      {/* History Toggle */}
      {records.length > 0 && (
        <div className="text-center mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-2"
          >
            {showHistory ? 'Hide History' : `View History (${records.length} games)`}
          </button>
        </div>
      )}

      {/* History Panel */}
      {showHistory && records.length > 0 && (
        <div className="mb-4 max-h-40 overflow-y-auto bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="text-slate-500 border-b border-white/10">
                <th className="pb-1 text-left font-medium">#</th>
                <th className="pb-1 text-center font-medium">Score</th>
                <th className="pb-1 text-center font-medium">Level</th>
                <th className="pb-1 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 10).map((record, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-1 text-left text-slate-500">{i + 1}</td>
                  <td className="py-1 text-center font-mono font-semibold">{record.score}</td>
                  <td className="py-1 text-center">{record.level}</td>
                  <td className="py-1 text-right text-slate-500">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ScoreCard({ label, value, icon, color }: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
      <span className="text-lg">{icon}</span>
      <div className="text-left">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</div>
        <div className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
        </div>
      </div>
    </div>
  );
}

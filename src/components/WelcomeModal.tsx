import { useState, useEffect } from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const steps = [
  {
    emoji: '👋',
    title: 'Welcome to Reflexa!',
    message: 'Test your memory skills! Watch carefully and repeat the pattern correctly.',
  },
  {
    emoji: '👀',
    title: 'Watch Carefully',
    message: 'The buttons will flash one by one. Remember the exact order.',
  },
  {
    emoji: '👆',
    title: 'Your Turn',
    message: 'Tap the buttons in the same order. One mistake ends the game!',
  },
  {
    emoji: '🚀',
    title: 'Level Up',
    message: 'Each level adds one more step to the sequence. It gets harder every time!',
  },
  {
    emoji: '🏆',
    title: 'Beat the High Score',
    message: 'Score as high as you can and climb the leaderboard!',
  },
  {
  emoji: '👉',
  title: 'Let’s Start!',
  message: 'Press Start and show your skills!'
  },
];


export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Step Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">{step.emoji}</div>
          <h2 className="text-2xl font-black mb-3">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {step.title}
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            {step.message}
          </p>
        </div>

        {/* Difficulty Info - Only on last step */}
        {isLastStep && (
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <h3 className="text-white font-semibold mb-3 text-sm">Choose Your Difficulty:</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-semibold">EASY</span>
                <span className="text-slate-400">Slower • 1x points</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded font-semibold">MEDIUM</span>
                <span className="text-slate-400">Balanced • 1.5x points</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded font-semibold">HARD</span>
                <span className="text-slate-400">Fast • 2x points</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-violet-500'
                  : index < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-violet-500/30"
          >
            {isLastStep ? "Let's Play! 🚀" : 'Next'}
          </button>
        </div>

        {/* Skip text */}
        <button
          onClick={handleClose}
          className="w-full text-center text-slate-500 text-xs mt-4 hover:text-slate-400 transition-colors"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}

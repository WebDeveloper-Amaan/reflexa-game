import { useState, useCallback, useRef } from 'react';

interface SimonButtonProps {
  colorIndex: number;
  isActive: boolean;
  isDisabled: boolean;
  isKeyPressed?: boolean;
  onClick: (colorIndex: number) => void;
}

const BUTTON_CONFIGS = [
  {
    base: 'from-green-500 to-green-600',
    active: 'from-green-300 to-green-400',
    glowColor: 'rgba(74, 222, 128, 0.6)',
    border: 'border-green-700',
    position: 'rounded-tl-[120px] sm:rounded-tl-[180px] rounded-tr-lg rounded-br-lg rounded-bl-lg',
    key: 'A',
  },
  {
    base: 'from-red-500 to-red-600',
    active: 'from-red-300 to-red-400',
    glowColor: 'rgba(248, 113, 113, 0.6)',
    border: 'border-red-700',
    position: 'rounded-tl-lg rounded-tr-[120px] sm:rounded-tr-[180px] rounded-br-lg rounded-bl-lg',
    key: 'W',
  },
  {
    base: 'from-yellow-400 to-yellow-500',
    active: 'from-yellow-200 to-yellow-300',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    border: 'border-yellow-600',
    position: 'rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-[120px] sm:rounded-bl-[180px]',
    key: 'S',
  },
  {
    base: 'from-blue-500 to-blue-600',
    active: 'from-blue-300 to-blue-400',
    glowColor: 'rgba(96, 165, 250, 0.6)',
    border: 'border-blue-700',
    position: 'rounded-tl-lg rounded-tr-lg rounded-br-[120px] sm:rounded-br-[180px] rounded-bl-lg',
    key: 'D',
  },
];

export function SimonButton({ colorIndex, isActive, isDisabled, isKeyPressed = false, onClick }: SimonButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const lastClickTime = useRef(0);
  const config = BUTTON_CONFIGS[colorIndex];
  const lit = isActive || isPressed || isKeyPressed;

  const handleClick = useCallback(() => {
    if (isDisabled) return;
    
    // Prevent double-tap (debounce 300ms)
    const now = Date.now();
    if (now - lastClickTime.current < 300) return;
    lastClickTime.current = now;
    
    setIsPressed(true);
    onClick(colorIndex);
    
    // Auto-release after 150ms
    setTimeout(() => setIsPressed(false), 150);
  }, [isDisabled, onClick, colorIndex]);

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      style={{
        boxShadow: lit ? `0 0 30px 8px ${config.glowColor}` : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        transform: lit ? 'scale(1.02)' : 'scale(1)',
        willChange: 'transform, box-shadow',
      }}
      className={`
        relative w-[130px] h-[130px] sm:w-[155px] sm:h-[155px] md:w-[165px] md:h-[165px]
        bg-gradient-to-br border-2
        ${config.position}
        ${config.border}
        ${lit ? config.active : config.base}
        transition-[transform,box-shadow,background] duration-75 ease-out
        ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:opacity-95 active:scale-95'}
        overflow-hidden
      `}
      aria-label={['Green', 'Red', 'Yellow', 'Blue'][colorIndex]}
    >
      <div className={`
        absolute inset-3 rounded-[inherit]
        bg-gradient-to-br from-white/40 to-transparent
        pointer-events-none transition-opacity duration-75
        ${lit ? 'opacity-50' : 'opacity-30'}
      `} />
      <span className="absolute inset-0 hidden sm:flex items-center justify-center text-sm font-black text-white/40 select-none pointer-events-none">
        {config.key}
      </span>
    </button>
  );
}

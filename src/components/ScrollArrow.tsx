import { ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScrollArrowProps {
  onClick?: () => void;
  className?: string;
}

export function ScrollArrow({ onClick, className }: ScrollArrowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-11 h-11 bg-coral rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 animate-bounce-arrow',
        className
      )}
      aria-label="Scroll down"
    >
      <ArrowDown className="w-5 h-5 text-white" />
    </button>
  );
}

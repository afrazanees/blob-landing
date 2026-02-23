import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  onClick?: () => void;
  visible?: boolean;
}

export function BackToTop({ onClick, visible = false }: BackToTopProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-12 h-12 bg-coral rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </button>
  );
}

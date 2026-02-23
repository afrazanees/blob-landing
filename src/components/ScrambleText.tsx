import { useEffect, useRef, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  isScript?: boolean;
  onComplete?: () => void;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function ScrambleText({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  isScript = false,
  onComplete,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(() => 
    text.split('').map(c => c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]).join('')
  );

  useEffect(() => {
    const finalText = text;
    const textLength = finalText.length;
    const scrambleDuration = duration;
    const charDuration = scrambleDuration / (textLength * 3);

    let currentIndex = 0;
    let scrambleCount = 0;
    const maxScramblesPerChar = 3;
    let interval: NodeJS.Timeout | null = null;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (currentIndex >= textLength) {
          if (interval) clearInterval(interval);
          setDisplayText(finalText);
          onComplete?.();
          return;
        }

        let result = '';
        
        // Add finalized characters
        for (let i = 0; i < currentIndex; i++) {
          result += finalText[i];
        }

        // Scramble current character
        if (finalText[currentIndex] === ' ') {
          result += ' ';
          currentIndex++;
          scrambleCount = 0;
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
          scrambleCount++;
          
          if (scrambleCount >= maxScramblesPerChar) {
            result = result.slice(0, -1) + finalText[currentIndex];
            currentIndex++;
            scrambleCount = 0;
          }
        }

        // Add remaining placeholders
        for (let i = currentIndex + 1; i < textLength; i++) {
          result += finalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
        }

        setDisplayText(result);
      }, charDuration * 1000);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, duration, onComplete]);

  return (
    <span
      className={`inline-block ${isScript ? 'font-script text-coral' : ''} ${className}`}
    >
      {displayText}
    </span>
  );
}

// Hook for triggering scramble on scroll/intersection
export function useScrambleOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shouldScramble, setShouldScramble] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldScramble(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, shouldScramble };
}

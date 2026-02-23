import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ScribbleSVGProps {
  type: 'ellipse' | 'underline';
  className?: string;
  delay?: number;
}

export function ScribbleSVG({ type, className = '', delay = 0 }: ScribbleSVGProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    
    // Set up for draw animation
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Animate the draw
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.8,
      delay,
      ease: 'power2.out',
    });
  }, [delay]);

  if (type === 'ellipse') {
    return (
      <svg
        viewBox="0 0 280 60"
        className={`absolute pointer-events-none ${className}`}
        style={{ overflow: 'visible' }}
      >
        <path
          ref={pathRef}
          d="M10 30C10 15 70 5 140 5C210 5 270 15 270 30C270 45 210 55 140 55C70 55 10 45 10 30Z"
          fill="none"
          stroke="#f53003"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'underline') {
    return (
      <svg
        viewBox="0 0 400 30"
        className={`absolute pointer-events-none ${className}`}
        style={{ overflow: 'visible' }}
      >
        <path
          ref={pathRef}
          d="M5 15Q50 5 100 12Q150 20 200 10Q250 5 300 15Q350 22 395 12M10 22Q60 12 110 20Q160 25 210 15Q260 8 310 18Q360 25 390 18"
          fill="none"
          stroke="#f53003"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FloatingEyes } from '../components/FloatingEyes';

interface LargeDisplayProps {
  visible?: boolean;
}

export function LargeDisplay({ visible = false }: LargeDisplayProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) {
      // Reset letters when not visible
      lettersRef.current.forEach((letter) => {
        if (letter) {
          gsap.set(letter, { y: '100%', opacity: 0, scale: 0.5 });
        }
      });
      if (bgRef.current) {
        gsap.set(bgRef.current, { opacity: 0 });
      }
      return;
    }

    // Fade in background
    gsap.to(bgRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });

    // Animate letters in with stagger
    const letters = lettersRef.current.filter(Boolean);
    
    gsap.fromTo(
      letters,
      { y: '100%', opacity: 0, scale: 0.5 },
      {
        y: '0%',
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2,
      }
    );
  }, [visible]);

  const letters = [
    { char: 'W', color: 'text-text-primary', offset: '-rotate-6', zIndex: 10 },
    { char: 'O', color: 'text-text-primary', offset: 'rotate-3', zIndex: 10 },
    { char: 'W', color: 'text-coral', offset: '-rotate-2 translate-y-4', zIndex: 10 },
    { char: '!', color: 'text-text-primary', offset: 'rotate-6', zIndex: 10 },
  ];

  return (
    <section
      ref={sectionRef}
      className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        visible ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
      }`}
    >
      {/* Background overlay */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cream"
        style={{ opacity: 0 }}
      />

      {/* Large Text Display */}
      <div className="relative flex items-center justify-center z-10">
        {letters.map((letter, index) => (
          <span
            key={index}
            ref={(el) => { lettersRef.current[index] = el; }}
            className={`text-[22vw] md:text-[28vw] lg:text-[32vw] font-black leading-none ${letter.color} ${letter.offset} inline-block`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              willChange: 'transform, opacity',
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>

      {/* Floating Eyes */}
      <FloatingEyes visible={visible} />
    </section>
  );
}

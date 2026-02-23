import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FloatingEyesProps {
  visible?: boolean;
}

export function FloatingEyes({ visible = false }: FloatingEyesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!visible) return;

    const eyes = eyesRef.current.filter(Boolean);
    if (eyes.length === 0) return;

    // Pop-in animation with bounce
    gsap.fromTo(
      eyes,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.5,
      }
    );

    // Floating animation for each eye
    eyes.forEach((eye, index) => {
      if (!eye) return;

      // Random floating movement
      gsap.to(eye, {
        x: `random(-30, 30)`,
        y: `random(-20, 20)`,
        duration: `random(2.5, 4)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.4,
      });

      // Occasional blink
      const blinkTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 + index * 0.5 });
      blinkTimeline
        .to(eye.querySelector('.eye-sclera'), {
          scaleY: 0.1,
          duration: 0.1,
          ease: 'power2.in',
        })
        .to(eye.querySelector('.eye-sclera'), {
          scaleY: 1,
          duration: 0.1,
          ease: 'power2.out',
        });
    });

    return () => {
      eyes.forEach((eye) => {
        if (eye) {
          gsap.killTweensOf(eye);
          gsap.killTweensOf(eye.querySelector('.eye-sclera'));
        }
      });
    };
  }, [visible]);

  useEffect(() => {
    if (visible) return;

    const eyes = eyesRef.current.filter(Boolean);
    eyes.forEach((eye) => {
      if (eye) {
        gsap.to(eye, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        });
      }
    });
  }, [visible]);

  const eyePositions = [
    { top: '22%', left: '32%' },
    { top: '18%', left: '48%' },
    { top: '25%', left: '58%' },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {eyePositions.map((pos, index) => (
        <div
          key={index}
          ref={(el) => { eyesRef.current[index] = el; }}
          className="absolute"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="eye-sclera w-12 h-16 bg-white rounded-full border-2 border-text-primary overflow-hidden relative shadow-lg">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-9 bg-text-primary rounded-full">
              <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

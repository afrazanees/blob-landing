import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function BlobCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Breathing animation for the blob body
    gsap.to(container.querySelector('.blob-body'), {
      scaleY: 1.02,
      y: -3,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Left hand waving animation
    gsap.to(leftHandRef.current, {
      rotation: 15,
      duration: 0.75,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      transformOrigin: '80% 20%',
    });

    // Right hand waving animation (peace sign)
    gsap.to(rightHandRef.current, {
      rotation: -15,
      duration: 0.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      transformOrigin: '20% 20%',
    });

    // Blinking animation for eyes
    const blinkAnimation = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    blinkAnimation
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 0.1,
        duration: 0.1,
        ease: 'power2.in',
      })
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 1,
        duration: 0.1,
        ease: 'power2.out',
      });

    return () => {
      gsap.killTweensOf(container.querySelector('.blob-body'));
      gsap.killTweensOf(leftHandRef.current);
      gsap.killTweensOf(rightHandRef.current);
      gsap.killTweensOf([leftEyeRef.current, rightEyeRef.current]);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-52 h-64">
      {/* Shadow/Hole */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-60 h-10 bg-text-primary rounded-[100%]" />
      
      {/* Blob Body - Teardrop/Cone shape */}
      <div className="blob-body absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-52">
        <svg
          viewBox="0 0 160 208"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
        >
          {/* Main teardrop shape */}
          <path
            d="M80 8C50 8 28 48 28 100C28 152 50 192 80 200C110 192 132 152 132 100C132 48 110 8 80 8Z"
            fill="#fe97aa"
          />
          {/* Highlight */}
          <ellipse cx="60" cy="60" rx="20" ry="15" fill="rgba(255,255,255,0.25)" />
        </svg>
      </div>

      {/* Eyes Container */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2">
        {/* Left Eye */}
        <div
          ref={leftEyeRef}
          className="w-7 h-9 bg-white rounded-full border-2 border-text-primary overflow-hidden relative"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-5 bg-text-primary rounded-full">
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
        </div>

        {/* Right Eye */}
        <div
          ref={rightEyeRef}
          className="w-7 h-9 bg-white rounded-full border-2 border-text-primary overflow-hidden relative"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-5 bg-text-primary rounded-full">
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Left Hand (resting) */}
      <div
        ref={leftHandRef}
        className="absolute bottom-20 -left-2 w-12 h-16"
        style={{ transformOrigin: '80% 20%' }}
      >
        <svg viewBox="0 0 48 64" className="w-full h-full">
          {/* Arm */}
          <path
            d="M36 10Q12 24 10 48"
            stroke="#1A1A1A"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Hand */}
          <g transform="translate(2, 44)">
            <ellipse cx="10" cy="12" rx="9" ry="11" fill="white" stroke="#1A1A1A" strokeWidth="2" />
            {/* Fingers */}
            <ellipse cx="5" cy="6" rx="3" ry="5" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
            <ellipse cx="10" cy="4" rx="3" ry="5" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
            <ellipse cx="15" cy="6" rx="3" ry="5" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Right Hand (peace sign) */}
      <div
        ref={rightHandRef}
        className="absolute bottom-24 -right-4 w-14 h-18"
        style={{ transformOrigin: '20% 20%' }}
      >
        <svg viewBox="0 0 56 72" className="w-full h-full">
          {/* Arm */}
          <path
            d="M10 10Q40 24 44 44"
            stroke="#1A1A1A"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Hand */}
          <g transform="translate(34, 40)">
            <ellipse cx="12" cy="16" rx="10" ry="12" fill="white" stroke="#1A1A1A" strokeWidth="2" />
            {/* Peace sign fingers (up) */}
            <ellipse cx="7" cy="5" rx="3.5" ry="8" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
            <ellipse cx="17" cy="5" rx="3.5" ry="8" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
            {/* Folded fingers */}
            <ellipse cx="7" cy="22" rx="3" ry="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
            <ellipse cx="12" cy="24" rx="3" ry="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
            <ellipse cx="17" cy="22" rx="3" ry="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

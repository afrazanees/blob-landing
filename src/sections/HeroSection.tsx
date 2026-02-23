import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { BlobCharacter } from '../components/BlobCharacter';
import { ScrambleText } from '../components/ScrambleText';
import { ScribbleSVG } from '../components/ScribbleSVG';
import { ScrollArrow } from '../components/ScrollArrow';

interface HeroSectionProps {
  onScrollDown?: () => void;
  isRevealing?: boolean;
  showScrollArrow?: boolean;
}

export function HeroSection({ onScrollDown, isRevealing = true, showScrollArrow = true }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showScribbles, setShowScribbles] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    if (!isRevealing) return;

    // Reset and animate in
    const content = contentRef.current;
    if (!content) return;

    // Fade in content
    gsap.fromTo(
      content,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    // Show scribbles after text animation
    const scribbleTimer = setTimeout(() => {
      setShowScribbles(true);
    }, 1500);

    // Show subtext after headline
    const subtextTimer = setTimeout(() => {
      setShowSubtext(true);
    }, 2000);

    return () => {
      clearTimeout(scribbleTimer);
      clearTimeout(subtextTimer);
    };
  }, [isRevealing]);

  // Handle scroll down click
  const handleScrollDown = () => {
    onScrollDown?.();
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-cream overflow-hidden"
    >
      {/* Main Content */}
      <div
        ref={contentRef}
        className="hero-content relative z-10 flex flex-col items-center justify-center h-full px-4 pt-24 md:pt-32"
      >
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Line 1: CREATIVE SOLUTIONS FOR */}
          <div className="relative inline-block">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
              {isRevealing ? (
                <>
                  <ScrambleText text="CREATIVE SOLUTIONS" delay={0.2} duration={0.6} />
                  {' '}
                  <ScrambleText
                    text="FOR"
                    delay={0.8}
                    duration={0.5}
                    isScript
                    className="text-2xl md:text-3xl lg:text-4xl"
                  />
                </>
              ) : (
                <>
                  CREATIVE SOLUTIONS <span className="font-script text-coral text-2xl md:text-3xl lg:text-4xl">FOR</span>
                </>
              )}
            </h1>
            {/* Ellipse around DEVELOP */}
            {showScribbles && (
              <ScribbleSVG
                type="ellipse"
                className="w-64 md:w-80 h-16 -top-2 left-8"
                delay={0}
              />
            )}
          </div>

          {/* Line 2: YOUR DIGITAL */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
              {isRevealing ? (
                <ScrambleText text="YOUR DIGITAL" delay={1.3} duration={0.6} />
              ) : (
                'YOUR DIGITAL'
              )}
            </h1>
          </div>

          {/* Line 3: MODERN WORLD */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
              {isRevealing ? (
                <>
                  <ScrambleText text="MODERN" delay={1.9} duration={0.4} />
                  {' '}
                  <ScrambleText
                    text="WORLD"
                    delay={2.2}
                    duration={0.5}
                    isScript
                    className="text-2xl md:text-3xl lg:text-4xl"
                  />
                </>
              ) : (
                <>
                  MODERN <span className="font-script text-coral text-2xl md:text-3xl lg:text-4xl">WORLD</span>
                </>
              )}
            </h1>
          </div>

          {/* Line 4: TODAY */}
          <div className="relative inline-block">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
              {isRevealing ? (
                <ScrambleText text="TODAY" delay={2.6} duration={0.5} />
              ) : (
                'TODAY'
              )}
            </h1>
            {/* Scribble underline */}
            {showScribbles && (
              <ScribbleSVG
                type="underline"
                className="w-72 md:w-96 h-8 -bottom-2 left-1/2 -translate-x-1/2"
                delay={0.2}
              />
            )}
          </div>
        </div>

        {/* Subtext */}
        <div
          className={`mt-4 text-center transition-all duration-500 ${
            showSubtext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto">
            Innovative designs and cutting-edge technology,
            <br />
            crafted to bring your vision to life.
          </p>
        </div>

        {/* Blob Character */}
        <div className="mt-4 md:mt-6">
          <BlobCharacter />
        </div>
      </div>

      {/* Scroll Arrow */}
      <div
        className={`absolute right-6 bottom-[5.5rem] z-20 transition-opacity duration-300 ${
          showScrollArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ScrollArrow onClick={handleScrollDown} />
      </div>

      {/* orange bar removed - visual bar moved to App and hidden there to preserve animations */}
    </section>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from './components/Navigation';
import { HeroSection } from './sections/HeroSection';
import { LargeDisplay } from './sections/LargeDisplay';
import { BackToTop } from './components/BackToTop';
import { ScrambleText } from './components/ScrambleText';
import { ScribbleSVG } from './components/ScribbleSVG';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const orangeBarRef = useRef<HTMLDivElement>(null);
  const largeDisplayRef = useRef<HTMLDivElement>(null);
  
  const [showLargeDisplay, setShowLargeDisplay] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isRevealingHero, setIsRevealingHero] = useState(true);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Handle scroll down from hero
  const handleScrollDown = useCallback(() => {
    const hero = heroRef.current;
    const orangeBar = orangeBarRef.current;
    const largeDisplay = largeDisplayRef.current;
    
    if (!hero || !orangeBar || !largeDisplay) return;

    // Create timeline for scroll down animation
    const tl = gsap.timeline({
      onComplete: () => {
        setShowBackToTop(true);
      }
    });

    // Animate orange bar expanding
    tl.to(orangeBar, {
      scaleY: 15,
      transformOrigin: 'bottom center',
      duration: 0.8,
      ease: 'power2.inOut',
    });

    // Fade out hero content
    tl.to(hero.querySelector('.hero-content'), {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: 'power2.in',
    }, '-=0.6');

    // Show large display
    tl.add(() => {
      setShowLargeDisplay(true);
      setIsRevealingHero(false);
    });

    // Fade in large display
    tl.fromTo(largeDisplay, 
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      '+=0.1'
    );

  }, []);

  // Handle back to top
  const handleBackToTop = useCallback(() => {
    const hero = heroRef.current;
    const orangeBar = orangeBarRef.current;
    const largeDisplay = largeDisplayRef.current;
    
    if (!hero || !orangeBar || !largeDisplay) return;

    setShowBackToTop(false);

    // Create timeline for scroll up animation
    const tl = gsap.timeline({
      onComplete: () => {
        setShowLargeDisplay(false);
        setIsRevealingHero(true);
      }
    });

    // Fade out large display
    tl.to(largeDisplay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });

    // Contract orange bar
    tl.to(orangeBar, {
      scaleY: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.1');

    // Fade in hero content with scramble effect
    tl.to(hero.querySelector('.hero-content'), {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.4');

  }, []);

  // Set up scroll-based animation
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    // Create scroll-based timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: main,
        start: 'top top',
        end: '+=150%',
        scrub: 0.5,
        pin: true,
        snap: {
          snapTo: (progress) => {
            if (progress < 0.3) return 0;
            if (progress > 0.7) return 1;
            return 0.5;
          },
          duration: { min: 0.2, max: 0.4 },
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Update states based on scroll progress
          if (progress > 0.4 && !showLargeDisplay) {
            setShowLargeDisplay(true);
            setIsRevealingHero(false);
          } else if (progress <= 0.4 && showLargeDisplay) {
            setShowLargeDisplay(false);
            setIsRevealingHero(true);
          }
          
          if (progress > 0.05 && showScrollArrow) {
            setShowScrollArrow(false);
          } else if (progress <= 0.05 && !showScrollArrow) {
            setShowScrollArrow(true);
          }
        },
      },
    });

    // Store reference for cleanup
    scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger;

    // Animate orange bar based on scroll
    tl.fromTo(
      orangeBarRef.current,
      { scaleY: 0 },
      { scaleY: 15, transformOrigin: 'bottom center', ease: 'none' },
      0
    );

    // Fade hero content
    const heroContent = heroRef.current?.querySelector('.hero-content');
    if (heroContent) {
      tl.fromTo(
        heroContent,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -50, ease: 'none' },
        0
      );
    }

    // Show large display
    tl.fromTo(
      largeDisplayRef.current,
      { opacity: 0 },
      { opacity: 1, ease: 'none' },
      0.3
    );

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [showLargeDisplay, showScrollArrow]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = docHeight - (scrollTop + windowHeight);

      setShowBackToTop(distanceFromBottom <= 220);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      {/* Navigation */}
      <Navigation />

      {/* Main Scroll Container */}
      <div ref={mainRef} className="relative h-screen overflow-hidden">
        {/* Hero Section */}
        <div ref={heroRef} className="relative h-full">
          <HeroSection 
            onScrollDown={handleScrollDown} 
            isRevealing={isRevealingHero}
            showScrollArrow={showScrollArrow}
          />
        </div>

        {/* Orange Bar (expands on scroll) */}
        <div
          ref={orangeBarRef}
          className="absolute bottom-0 left-0 right-0 h-20 bg-coral z-10"
          style={{ transformOrigin: 'bottom center' }}
        />

        {/* Large Display Section */}
        <div ref={largeDisplayRef} className="absolute inset-0 z-20">
          <LargeDisplay visible={showLargeDisplay} />
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop onClick={handleBackToTop} visible={showBackToTop} />

      {/* Extended Content Section */}
      <section className="min-h-screen bg-cream py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading with Handwritten Style */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              <ScrambleText text="DISCOVER THE" delay={0.2} duration={0.6} />
              {' '}
              <span className="font-script text-coral text-4xl md:text-5xl lg:text-6xl">
                FUTURE
              </span>
            </h2>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary relative inline-block">
              <ScrambleText text="OF DESIGN" delay={0.8} duration={0.7} />
              <ScribbleSVG
                type="underline"
                className="w-full h-8 -bottom-2 left-0"
                delay={1.5}
              />
            </h2>
          </div>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 duration-300">
              <div className="relative mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                  <span className="font-script text-coral">Bold</span> Ideas
                </h3>
                <ScribbleSVG
                  type="ellipse"
                  className="w-32 h-12 -top-1 -left-2"
                  delay={2}
                />
              </div>
              <p className="text-text-secondary text-lg leading-relaxed">
                Innovative concepts that push boundaries and create memorable experiences for your audience.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 duration-300">
              <div className="relative mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                  <span className="font-script text-coral">Smart</span> Solutions
                </h3>
                <ScribbleSVG
                  type="ellipse"
                  className="w-36 h-12 -top-1 -left-2"
                  delay={2.2}
                />
              </div>
              <p className="text-text-secondary text-lg leading-relaxed">
                Thoughtful approaches that blend creativity with functionality to achieve your goals.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 duration-300">
              <div className="relative mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                  <span className="font-script text-coral">Real</span> Results
                </h3>
                <ScribbleSVG
                  type="ellipse"
                  className="w-36 h-12 -top-1 -left-2"
                  delay={2.4}
                />
              </div>
              <p className="text-text-secondary text-lg leading-relaxed">
                Measurable impact and tangible outcomes that drive success and exceed expectations.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-12">
            <p className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
              LET'S <span className="font-script text-coral text-2xl md:text-3xl">START</span> YOUR PROJECT
            </p>
            <button className="px-12 py-4 bg-coral text-white rounded-full text-lg font-semibold hover:bg-coral/90 transition-all hover:scale-105 shadow-lg">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

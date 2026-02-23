import { useEffect, useState } from 'react';

export function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide nav when scrolling down in the large display section
      if (currentScrollY > window.innerHeight * 0.5 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Logo */}
      <div className="text-2xl font-bold text-text-primary tracking-tight">
        Mockup
      </div>

      {/* Center Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {['about', 'work', 'services', 'contact'].map((link) => (
          <a
            key={link}
            href={`#${link}`}
            className="text-sm text-text-primary hover:text-coral transition-colors duration-200 capitalize"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button className="text-sm text-text-primary hover:text-coral transition-colors duration-200">
          menu
        </button>
        <button className="bg-text-primary text-white text-sm px-5 py-2.5 rounded-full hover:bg-coral transition-colors duration-200">
          let's talk
        </button>
      </div>
    </nav>
  );
}

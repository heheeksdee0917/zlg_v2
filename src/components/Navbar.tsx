import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [carouselSlide, setCarouselSlide] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { title: 'home', link: '/' },
    { title: 'philosophy', link: '/philosophy' },
    { title: 'projects', link: '/projects' },
    { title: 'people', link: '/people' },
    { title: 'partners', link: '/partner' },
  ];

  const carouselImages = [
    '/images/Image6.avif',
    '/images/Image1.avif',
    '/images/Image2.avif',
    '/images/Image3.avif',
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const timer = setInterval(() => {
      setCarouselSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) { setIsVisible(true); setLastScrollY(currentScrollY); return; }
      if (currentScrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };

    const handleInnerScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollHeight > target.clientHeight) {
        setIsVisible(target.scrollTop <= 50);
      }
    };

    let timeoutId: NodeJS.Timeout | null = null;
    const throttled = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => { handleScroll(); timeoutId = null; }, 100);
    };

    window.addEventListener('scroll', throttled, { passive: true });
    document.addEventListener('scroll', handleInnerScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', throttled);
      document.removeEventListener('scroll', handleInnerScroll, { capture: true });
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Navbar Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        style={{ background: 'linear-gradient(to right, #336138 0%, #5a9d63 100%)' }}
      >
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img src="/logo(white).png" alt="ZLG Design" className="h-6" />
            </Link>
            <span className="text-sm text-white lowercase leading-none">zlgdesign</span>
          </div>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-200 transition-colors flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between">
              <span className={`block w-full h-[2px] bg-white transform transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-full h-[2px] bg-white transform transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-full h-[2px] bg-white transform transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ── DESKTOP OVERLAY — full green bg + floating image ── */}
      <div
        className="hidden md:flex fixed inset-0 z-[499] transition-opacity duration-500 ease-in-out"
        style={{
          background: 'linear-gradient(to right, #336138 0%, #5a9d63 100%)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* Navigation links — full width, but content offset left */}
        <div className="flex flex-col justify-center px-20 w-full">
          <div className="flex flex-col space-y-2 max-w-[55%]">
            {navItems.map((item, index) => (
              <Link
                key={item.title}
                to={item.link}
                onClick={closeMenu}
                className="group flex items-center gap-6 py-4 border-b border-white/10 last:border-none"
                onMouseEnter={() => setHoveredColumn(index)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <span className="text-white/30 text-xs font-light w-6">
                  0{index + 1}
                </span>
                <span
                  className="text-4xl md:text-5xl font-extralight lowercase text-white transition-all duration-300"
                  style={{ opacity: hoveredColumn === null || hoveredColumn === index ? 1 : 0.3 }}
                >
                  {item.title}
                </span>
                {isActive(item.link) && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-white opacity-70" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Floating image — absolute, right side, inset with margin so it floats */}
        {/* Floating image — full bleed, right side */}
        <div className="absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
              style={{
                backgroundImage: `url(${img})`,
                opacity: carouselSlide === index ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/10" />

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselSlide(i)}
                className={`h-px transition-all duration-500 ${i === carouselSlide ? 'w-8' : 'w-4'}`}
                style={{ backgroundColor: i === carouselSlide ? '#ffffff' : '#ffffff66' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE OVERLAY — text only ── */}
      <div
        className="md:hidden fixed inset-0 z-[499] transition-opacity duration-500 ease-in-out"
        style={{
          background: 'linear-gradient(to right, #336138 0%, #5a9d63 100%)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col items-start justify-center h-full space-y-6 px-10">
          {navItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.link}
              onClick={closeMenu}
              className="group flex items-center gap-4"
            >
              <span className="text-white/30 text-xs font-light">
                0{index + 1}
              </span>
              <span
                className={`text-3xl font-extralight lowercase transition-opacity duration-300 ${isActive(item.link) ? 'text-white' : 'text-white/80'
                  }`}
              >
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
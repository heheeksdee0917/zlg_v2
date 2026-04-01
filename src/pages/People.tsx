import React, { useState, useEffect, useRef } from 'react';
import { keyPartners, team } from '../data/partner';
import type { Team } from '../data/partner';
import LazyLoading from '../components/LazyLoading';

function HeroSection() {
  const [panel, setPanel] = useState(0);
  const isAnimating = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  // Touch support
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inView) return;

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 30) return;

      const direction = deltaY > 0 ? 1 : -1;
      const next = panel + direction;
      if (next < 0 || next > 1) return;
      if (isAnimating.current) return;

      setPanel(next);
      isAnimating.current = true;
      setTimeout(() => { isAnimating.current = false; }, 800);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inView) return;

      const deltaY = touchStartY.current - e.touches[0].clientY;
      const next = panel + (deltaY > 0 ? 1 : -1);
      if (next >= 0 && next <= 1) e.preventDefault();
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [panel]);

  // Wheel support
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inView) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = panel + direction;
      if (next < 0 || next > 1) return;

      e.preventDefault();
      if (isAnimating.current) return;

      setPanel(next);
      isAnimating.current = true;
      setTimeout(() => { isAnimating.current = false; }, 800);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [panel]);

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover transition-all duration-700"
          style={{
            backgroundImage: `url('/People/team_hero.avif')`,
            backgroundPosition: 'center 70%',
            filter: panel > 0 ? 'blur(8px)' : 'blur(0px)',
            transform: 'scale(1.05)',
          }}
        />

        {/* Overlay darkens on panel 1 */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-700"
          style={{ opacity: panel > 0 ? 0.55 : 0.3 }}
        />

        {/* Panel 0 — Title */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 transition-opacity duration-700"
          style={{ opacity: panel === 0 ? 1 : 0, pointerEvents: panel === 0 ? 'auto' : 'none' }}
        >
          <p className="text-xs tracking-[0.3em] lowercase font-light text-white/60 mb-4">
            zlgdesign
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight lowercase text-white">
            people
          </h1>
        </div>

        {/* Panel 1 — Content */}
        <div
          className="absolute inset-0 flex items-center transition-opacity duration-700"
          style={{ opacity: panel === 1 ? 1 : 0, pointerEvents: panel === 1 ? 'auto' : 'none' }}
        >
          <div className="w-full flex items-center justify-between px-8 md:px-16 max-w-screen-2xl mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-base font-normal mb-4 lowercase underline text-white">Our Team</h2>
              <p className="text-base text-white/90 leading-relaxed lowercase text-left">
                zlgdesign is a collective of architects, designers, and thinkers united by a shared passion for creating meaningful spaces. Our diverse backgrounds and expertise enable us to approach each project with fresh perspectives and rigorous craft.
              </p>
            </div>
            <div
              className="hidden md:block flex-shrink-0 overflow-hidden"
              style={{ height: '75vh', aspectRatio: '2/3', animation: 'floatPhoto 6s ease-in-out infinite' }}
            >
              <img src="/People/HuatandSusanne.jpeg" alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center 70%' }} loading="lazy" />
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setPanel(i)}
              className="h-px transition-all duration-500"
              style={{
                width: i === panel ? '2rem' : '1rem',
                backgroundColor: i === panel ? '#ffffff' : '#ffffff66',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatPhoto {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
}

export default function People() {
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    intro: true
  });
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>

      <HeroSection />

      <div className="bg-[#F5FAF7] w-full">
        <section
          ref={setRef('intro')}
          data-section="intro"
          className="max-w-screen-2xl mx-auto px-8 pb-16"
        >

          {/* Key Partners Section */}
          {keyPartners.map((partner, index) => (
            <React.Fragment key={partner.name}>
              <section
                ref={setRef(`partner-${index}`)}
                data-section={`partner-${index}`}
                className="flex items-center py-4 md:py-8"
              >
                <div className={`grid ${
                  index % 2 === 0
                    ? 'md:grid-cols-[30%_70%]'
                    : 'md:grid-cols-[70%_30%]'
                } gap-6 lg:gap-10 items-center w-full transition-all duration-1000 ease-out ${
                  visibleSections[`partner-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                  {index % 2 === 0 ? (
                    <>
                      <div className="w-full overflow-hidden">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-full aspect-[2/3] object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-base font-normal text-[#185B30] lowercase">{partner.name}</h3>
                        <p className="text-base text-[#185B30] mb-8 font-light lowercase">{partner.role}</p>
                        <div className="space-y-6 text-[#185B30] leading-relaxed font-light lowercase text-left">
                          {partner.bio.map((paragraph, i) => (
                            <p key={i} className="text-base">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col justify-center order-2 md:order-1">
                        <h3 className="text-base font-normal text-[#185B30] lowercase">{partner.name}</h3>
                        <p className="text-base text-[#185B30] mb-8 font-light lowercase">{partner.role}</p>
                        <div className="space-y-6 text-[#185B30] leading-relaxed font-light lowercase text-left">
                          {partner.bio.map((paragraph, i) => (
                            <p key={i} className="text-base">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                      <div className="w-full overflow-hidden order-1 md:order-2">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-full aspect-[2/3] object-cover object-center"
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>
            </React.Fragment>
          ))}

          {/* Team Grid */}
          <LazyLoading
            items={team}
            initialCount={4}
            loadMoreCount={4}
            visibleSections={visibleSections}
          >
            {(displayedTeam) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {displayedTeam.map((member: Team, index: number) => (
                  <div
                    key={member.id}
                    ref={index === 0 ? setRef('team') : undefined}
                    data-section={index === 0 ? 'team' : undefined}
                    className={`group transition-all duration-1000 ease-out ${
                      visibleSections.team ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="overflow-hidden mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full aspect-[2/3] object-cover"
                        loading={index < 4 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                    <h3 className="text-base font-normal text-[#185B30] mb-1 lowercase">{member.name}</h3>
                    <p className="text-base text-[#185B30] mb-4">{member.role}</p>
                  </div>
                ))}
              </div>
            )}
          </LazyLoading>

        </section>

        {/* CTA */}
        <section
          ref={setRef('cta')}
          data-section="cta"
          className="bg-[#F5FAF7] py-16"
        >
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className={`text-left transition-all duration-1000 ease-out ${
              visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              <h2 className="text-base font-normal text-[#185B30] mb-4 lowercase underline">Join Our Team</h2>
              <p className="text-base text-[#185B30] leading-relaxed mb-8 lowercase text-left">
                We are always seeking talented architects and designers who share our commitment to excellence, sustainability, and thoughtful design. If you are passionate about creating spaces that matter, we would love to hear from you.
              </p>
              <a
                href="mailto:info@zlgdesign.com"
                className="inline-block text-base tracking-[0.08em] font-light lowercase text-[#185B30] px-8 py-3 border border-[#185B30]/60 transition-all duration-300"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'rgba(24, 91, 48, 0.05)',
                }}
              >
                join the team
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
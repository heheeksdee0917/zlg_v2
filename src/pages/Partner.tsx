import React, { useState, useEffect, useRef } from 'react';
import { keyPartners, journeyPartners, signatureProjects } from '../data/partner';
import SEO from '../components/seo'

function HeroSection() {
  const [panel, setPanel] = useState(0);
  const isAnimating = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Our Partners | ZLG Design – Collaborative Architecture in KL",
    "description": "ZLG Design collaborates with trusted engineering, construction, and specialist partners to deliver exceptional architectural projects with the highest standards of quality.",
    "url": "https://zlgdesign.com/partners"
  };
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

        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          style={{
            filter: panel > 0 ? 'blur(8px)' : 'blur(0px)',
            transform: 'scale(1.05)',
          }}
          poster="/v2_thumbnail.avif"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/general/zlg_v4_upscaled.mp4" type="video/mp4" />
        </video>

        {/* Overlay darkens on panel 1 */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-700"
          style={{ opacity: panel > 0 ? 0.55 : 0.4 }}
        />

        {/* Panel 0 — Title */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 transition-opacity duration-700"
          style={{ opacity: panel === 0 ? 1 : 0, pointerEvents: panel === 0 ? 'auto' : 'none' }}
        >
          <p className="text-xs tracking-[0.2em] lowercase font-light text-white/60 mb-1">
            our network
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight lowercase text-white">
            partners
          </h1>
        </div>

        {/* Panel 1 — Content */}
        <div
          className="absolute inset-0 flex items-center transition-opacity duration-700"
          style={{ opacity: panel === 1 ? 1 : 0, pointerEvents: panel === 1 ? 'auto' : 'none' }}
        >
          <div className="w-full flex items-center justify-between px-8 md:px-16 max-w-screen-2xl mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-base font-normal mb-4 lowercase underline text-white">Key Partners</h2>
              <p className="text-base text-white/90 leading-relaxed lowercase text-left">
                Our partners are built on decades of collaboration with exceptional architects and designers who have shaped the built environment across continents. Together, we bring world-class expertise and a shared vision of design excellence.
              </p>
            </div>
            <div
              className="hidden md:block flex-shrink-0 overflow-hidden"
              style={{ height: '75vh', aspectRatio: '2/3', animation: 'floatPhoto 6s ease-in-out infinite' }}
            >
              <img src="/general/zlg_founding.avif" alt="" className="w-full h-full object-cover" loading="lazy" />
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

export default function Partners() {
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const partnersWithImages = journeyPartners.filter(p => p.image);
  const partnersTextOnly = journeyPartners.filter(p => !p.image);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.05,
      rootMargin: '0px 0px 0px 0px'
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
    <>
      <SEO
        title="Our Partners | ZLG Design – Collaborative Architecture in KL"
        description="ZLG Design works with trusted engineering, construction, and specialist partners across Malaysia to deliver exceptional architectural projects with the highest standards of quality and craftsmanship."
        canonical="https://zlgdesign.com/partners"
        schema={schema}
      />
      <main>
        <h1>About Us</h1>
        <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>

          <HeroSection />

          {/* Introduction Section */}
          <section
            ref={setRef('intro')}
            data-section="intro"
            className="bg-white flex flex-col items-start py-8 md:py-16 relative min-h-[100vh]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(/images/langkawi.avif)',
                opacity: 0.6
              }}
            />
            <div className={`relative z-10 w-full px-8 pb-8 transition-all duration-1000 ease-out ${visibleSections.intro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
              <div className="max-w-screen-2xl mx-auto">
                <div className="max-w-3xl">

                  {/* Glassmorphism wrapper */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '24px',
                      padding: '2rem',
                    }}
                  >
                    <h2 className="text-3xl font-light mb-8 lowercase text-[#185B30]">Our Partnership Philosophy</h2>
                    <div className="space-y-6">
                      <p className="text-base text-[#185B30] leading-relaxed font-light lowercase text-left">
                        zlg partners with a number of universities and design colleges among them the one academy and taylor's university. we believe in continuous research and lairing all practical work sharpened through a deep understanding of ongoing issues such as carbon storage and climate change, and global conservation efforts.
                      </p>
                      <p className="text-base text-[#185B30] leading-relaxed font-light lowercase text-left">
                        our partners include individuals who share similar interests, often clients. among them are artists and artisans alike, and furniture makers and retailers such as atmos, bnr, TMOG and GTA interior designers.
                      </p>
                      <p className="text-base text-[#185B30] leading-relaxed font-light lowercase text-left">
                        zlg also works closely with researchers and specialists often working together on life long relationships on projects. among them are scientists such as dr daniel cicuzza, dr brandon chee and dr nike baetzner.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* Partners Along the Journey & Signature Projects */}
          <section
            ref={setRef('projects')}
            data-section="projects"
            className="bg-[#F5FAF7] py-16"
          >
            <div className="max-w-screen-2xl mx-auto px-8 w-full">
              <div className={`transition-all duration-1000 ease-out ${visibleSections.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>

                <div className="mb-16">
                  <h4 className="text-[#185B30] font-normal mb-8 lowercase">partners along the journey</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {partnersWithImages.map((partner, index) => (
                      <div
                        key={partner.name}
                        className="transition-all duration-1000 ease-out"
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden mb-4">
                          <img
                            src={partner.image}
                            alt={partner.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h5 className="text-[#185B30] font-normal mb-1 lowercase">{partner.name}</h5>
                        {partner.title && (
                          <p className="text-sm text-[#185B30] font-light lowercase">{partner.title}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                    {partnersTextOnly.map((partner) => (
                      <div
                        key={partner.name}
                        className="flex items-start text-[#185B30] font-light lowercase"
                      >
                        <span className="mr-3 text-[#185B30]">•</span>
                        <span>{partner.name}{partner.title && `: ${partner.title}`}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[#185B30] leading-relaxed font-light lowercase text-left mt-12">
                  With over 22 years of experience working on very large and complex buildings across Europe and Asia, our partners bring unparalleled expertise in architectural design, interior design, and project delivery.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
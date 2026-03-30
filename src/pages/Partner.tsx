import React, { useState, useEffect, useRef } from 'react';
import { keyPartners, journeyPartners, signatureProjects } from '../data/partner';

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 200);
  const imageBlur = Math.min(10, (scrollY - 100) / 30);
  const overlayOpacity = Math.min(1, (scrollY - 100) / 300);
  const overlayTranslateY = Math.max(0, 40 - (scrollY - 100) / 10);

  return (
    <section className="relative h-[150vh] md:h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: `blur(${Math.max(0, imageBlur)}px)`,
            transform: 'scale(1.1)',
          }}
          poster="/v2_thumbnail.avif"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/general/zlg_v4_upscaled.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40" />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          style={{ opacity: heroOpacity, transition: 'none' }}
        >
          <p className="text-xs tracking-[0.3em] lowercase font-light text-white/60 mb-4">
            our network
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight lowercase text-white">
            partners
          </h1>
        </div>

        <div
          className="absolute inset-0 flex items-center px-8 max-w-screen-2xl mx-auto"
          style={{
            opacity: overlayOpacity,
            transform: `translateY(${overlayTranslateY}px)`,
            transition: 'none',
          }}
        >
          <div className="max-w-xl">
            <h2 className="text-base font-normal mb-4 lowercase underline text-white">Key Partners</h2>
            <p className="text-base text-white/90 leading-relaxed lowercase text-left">
              Our partners are built on decades of collaboration with exceptional architects and designers who have shaped the built environment across continents. Together, we bring world-class expertise and a shared vision of design excellence.
            </p>
          </div>
        </div>

      </div>
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
        <div className={`relative z-10 w-full px-8 pb-8 transition-all duration-1000 ease-out ${
          visibleSections.intro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="max-w-screen-2xl mx-auto">
            <div className="max-w-3xl">
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
      </section>

      {/* Partners Along the Journey & Signature Projects */}
      <section
        ref={setRef('projects')}
        data-section="projects"
        className="bg-[#F5FAF7] py-16"
      >
        <div className="max-w-screen-2xl mx-auto px-8 w-full">
          <div className={`transition-all duration-1000 ease-out ${
            visibleSections.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
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
  );
}
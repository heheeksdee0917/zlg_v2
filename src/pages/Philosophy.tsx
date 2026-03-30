import React, { useState, useEffect, useRef } from 'react';
import { philosophySections } from '../data/philosophy';
import LazyLoading from '../components/LazyLoading';

function HeroSection() {
  const [panel, setPanel] = useState(0);
  const isAnimating = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const inView = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inView) return; // only intercept when hero is in view

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = panel + direction;

      // If scrolling down past last panel or up before first, let page scroll
      if (next < 0 || next > 2) return;

      e.preventDefault();
      if (isAnimating.current) return;

      setPanel(next);
      isAnimating.current = true;
      setTimeout(() => { isAnimating.current = false; }, 800);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [panel]); // panel in deps so next calculation is always fresh

  const PanelContent = ({
    text, heading, imgSrc, imgPosition = 'center',
  }: { text: string; heading?: string; imgSrc: string; imgPosition?: string }) => (
    <div className="w-full flex items-center justify-between px-8 md:px-16 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl">
        {heading && (
          <h2 className="text-base font-normal mb-4 lowercase underline text-white">{heading}</h2>
        )}
        <p className="text-base text-white leading-relaxed lowercase text-left">{text}</p>
      </div>
      <div
        className="hidden md:block flex-shrink-0 overflow-hidden"
        style={{ height: '75vh', aspectRatio: '2/3', animation: 'floatPhoto 6s ease-in-out infinite' }}
      >
        <img src={imgSrc} alt="" className="w-full h-full object-cover" style={{ objectPosition: imgPosition }} loading="lazy" />
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
      <style>{`
        @keyframes floatPhoto {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <img src="/general/Philosophy.avif" alt="" className="hidden" />

      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('/general/Philosophy.avif')`,
            filter: panel > 0 ? 'blur(8px)' : 'blur(0px)',
            transform: 'scale(1.05)',
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-700"
          style={{ opacity: panel > 0 ? 0.55 : 0 }}
        />

        {/* Panel 1 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 transition-opacity duration-700"
          style={{ opacity: panel === 0 ? 1 : 0, pointerEvents: panel === 0 ? 'auto' : 'none' }}
        >
          <p className="text-xs tracking-[0.3em] lowercase font-light text-white/90 mb-1">our thinking</p>
          <h1 className="text-4xl md:text-5xl font-extralight lowercase text-white">philosophy</h1>
        </div>

        {/* Panel 2 */}
        <div
          className="absolute inset-0 flex items-center transition-opacity duration-700"
          style={{ opacity: panel === 1 ? 1 : 0, pointerEvents: panel === 1 ? 'auto' : 'none' }}
        >
          <PanelContent
            heading="Our Philosophy"
            text="In 1992 when susanne and me started thinking of doing competitions our focus was only design and ever since our work revolved around ideas and concepts that go beyond what was then always a pre-defined architectural pursuit or entity."
            imgSrc="/general/zlg_livingroom1.avif"
          />
        </div>

        {/* Panel 3 */}
        <div
          className="absolute inset-0 flex items-center transition-opacity duration-700"
          style={{ opacity: panel === 2 ? 1 : 0, pointerEvents: panel === 2 ? 'auto' : 'none' }}
        >
          <PanelContent
            text="I think architecture is taking much longer to becoming like what good art is, it is not so generative and it is not always assuming an emotive role, like a good work of art does."
            imgSrc="/general/huatlim.avif"
            imgPosition="35% center"
          />
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {[0, 1, 2].map((i) => (
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
    </section>
  );
}

export default function Philosophy() {
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.05, rootMargin: '0px 0px 0px 0px' };
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  });

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  const renderSection = (section: typeof philosophySections[0], index: number) => {
    const isVisible = visibleSections[section.id];

    switch (section.type) {
      case 'text-image':
        return (
          <section key={section.id} ref={setRef(section.id)} data-section={section.id} className="bg-[#F5FAF7] py-12">
            <div className="max-w-screen-2xl mx-auto px-8 w-full">
              <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16">
                <div className={`flex flex-col justify-start transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <h2 className="text-4xl font-normal text-[#185B30]">{section.title}</h2>
                </div>
                <div className={`flex flex-col justify-start transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
                  {section.content.text?.map((p, i) => (
                    <p key={i} className="text-base text-[#185B30] leading-relaxed mb-6 last:mb-0">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'quote-only':
        return (
          <section key={section.id} ref={setRef(section.id)} data-section={section.id} className="bg-[#F5FAF7] py-4">
            <div className="max-w-screen-2xl mx-auto px-8">
              <blockquote className={`text-base font-light text-[#185B30] text-left italic py-8 border-t border-b border-gray-300 transition-all duration-1000 ease-out lowercase ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {section.content.quote}
                {section.content.quoteAuthor && (
                  <span className="block text-base text-[#185B30] not-italic mt-4">{section.content.quoteAuthor}</span>
                )}
              </blockquote>
            </div>
          </section>
        );

      case 'columns-only':
        return (
          <section key={section.id} ref={setRef(section.id)} data-section={section.id} className="bg-[#F5FAF7] py-12">
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="grid md:grid-cols-2 gap-16">
                {section.content.columns?.map((col, i) => (
                  <div key={i} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                    <h3 className="text-base font-normal text-[#185B30] mb-4">{col.title}</h3>
                    <p className="text-base text-[#185B30] leading-relaxed text-left">{col.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'text-only':
        return (
          <section key={section.id} ref={setRef(section.id)} data-section={section.id} className="bg-[#F5FAF7] py-4 relative min-h-[100vh] flex items-start" style={{ justifyContent: section.content.layout === 'center' ? 'center' : 'flex-start' }}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${section.content.image})`, opacity: 0.5 }} />
            <div className={`relative z-10 transition-all duration-1000 ease-out px-8 ${section.content.layout === 'center' ? 'max-w-2xl mx-auto text-left' : 'w-full md:pl-28 md:pr-16'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '32px', padding: '2.5rem' }}>
                <h3 className="text-2xl font-light text-[#185B30] mb-6 lowercase">{section.title}</h3>
                {section.content.text?.map((p, i) => (
                  <p key={i} className="text-base text-[#185B30] leading-relaxed mb-4 last:mb-0 lowercase">{p}</p>
                ))}
              </div>
            </div>
          </section>
        );

      case 'publications':
        return (
          <section key={section.id} ref={setRef(section.id)} data-section={section.id} className={`relative bg-[#F5FAF7] py-6 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="max-w-screen-2xl mx-auto px-8">
              <h2 className="text-base font-normal mb-8 text-[#185B30]">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.content.publications?.map((pub, i) => (
                  <div key={i} className={`border border-gray-200 transition-all duration-1000 ease-out flex flex-col overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${(i + 2) * 100}ms` }}>
                    <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden">
                      <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-sm font-normal mb-2 lowercase text-[#185B30]">{pub.title}</h3>
                      <p className="text-sm text-[#185B30] font-light leading-relaxed text-left">{pub.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <HeroSection />
      <LazyLoading
        items={philosophySections}
        initialCount={2}
        loadMoreCount={2}
        visibleSections={visibleSections}
      >
        {(displayedSections) => (
          <div className="flex flex-col">
            {displayedSections.map((section, index) => (
              <React.Fragment key={section.id}>
                {renderSection(section, index)}
              </React.Fragment>
            ))}
          </div>
        )}
      </LazyLoading>
    </div>
  );
}
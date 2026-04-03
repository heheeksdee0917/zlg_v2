import { SEO } from '../components/seo';
import React, { useState, useEffect, useRef } from 'react';

export default function ContactUs() {
    const [fadeIn, setFadeIn] = useState(false);
    const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    const schema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact ZLG Design | Best Architect in Kuala Lumpur",
        "description": "Get in touch with ZLG Design in Kuala Lumpur. Whether you're planning a residential home, commercial project, or architectural consultation, our team is ready to discuss your vision.",
        "url": "https://zlgdesign.com/contact"
      };


    useEffect(() => {
        setFadeIn(false);
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
        <>
            <SEO
                title="Contact Us | zlgdesign | Best Architect in Kuala Lumpur(KL), Malaysia"
                description=""
                canonical="https://zlgdesign.com/contact"
                schema={schema}
            />
            <main>
                <h1>Contact ZLG Design in Kuala Lumpur (KL), Malaysia</h1>
                <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Main Content */}
                    <section
                        ref={setRef('intro')}
                        data-section="intro"
                        className="relative bg-[#F5FAF7] z-10 max-w-screen-2xl mx-auto px-8 pt-28 pb-16"
                    >
                        <div className={`mb-16 transition-all duration-1000 ease-out ${visibleSections.intro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}>
                            <h1 className="text-base font-normal text-[#185B30] tracking-wider mb-2 lowercase ">contact zlgdesign</h1>
                            <p className="text-base text-[#185B30] leading-relaxed font-light lowercase text-left mb-2">
                                we believe every great project begins with dialogue. whether you're envisioning a new home, planning a commercial space, or exploring design possibilities, we're here to listen and collaborate.
                            </p>
                            <p className="text-base text-[#185B30] leading-relaxed font-light lowercase text-left">
                                reach out to discuss your vision, ask questions, or schedule a consultation. we look forward to creating something extraordinary together.
                            </p>
                        </div>

                        {/* Contact Information Grid */}
                        <div
                            ref={setRef('details')}
                            data-section="details"
                            className={`grid md:grid-cols-3 gap-12 mb-16 transition-all duration-1000 ease-out ${visibleSections.details ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                                }`}
                        >
                            <div>
                                <h2 className="text-base font-normal text-[#185B30] tracking-wide mb-2 lowercase ">studio</h2>
                                <a
                                    href="https://maps.app.goo.gl/XU8fK6RHEw2pYWqD6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="base text-[#185B30] font-light lowercase text-left leading-relaxed hover: hover:text-gray-900 transition-colors"
                                >
                                    1-8, Bangunan Perdagangan D7, 800<br />
                                    Jln Sentul, Sentul<br />
                                    51000 Kuala Lumpur
                                </a>
                            </div>
                            <div>
                                <h2 className="text-base font-normal text-[#185B30] tracking-wide mb-2 lowercase ">email</h2>
                                <a
                                    href="mailto:huatlim@zlgdesign.com"
                                    className="text-base text-[#185B30] font-light lowercase hover:text-black transition-colors relative inline-block"
                                >
                                    huatlim@zlgdesign.com
                                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-500 ease-out hover:w-full"></span>
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
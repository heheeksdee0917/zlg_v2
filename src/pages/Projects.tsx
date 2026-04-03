import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { SEO } from '../components/seo';

export default function Projects() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Projects | ZLG Design – Award-Winning Architecture in Kuala Lumpur",
    "description": "Explore our portfolio of architectural projects across Kuala Lumpur and Malaysia, including luxury residences, hotels, commercial buildings, and tourism destinations.",
    "url": "https://zlgdesign.com/projects"
  };

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO
        title="Projects | zlgdesign | Best Architect in Kuala Lumpur(KL), Malaysia"
        description="Explore our portfolio of architectural projects in Kuala Lumpur and Malaysia, including luxury residences, hotels, commercial buildings, and tourism destinations designed by ZLG Design."
        canonical="https://zlgdesign.com/projects"
        schema={schema}
      />
      <main>
        <h1>Explore ZLG Design's projects in Kuala Lumpur (KL), Malaysia</h1>

        <div className={`min-h-screen bg-[#F5FAF7] pt-14 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <section className="max-w-screen-2xl mx-auto px-8 py-8">
            <div className="mb-8 text-left">
              <h1 className="text-2xl text-[#185B30] font-normal mb-4 lowercase">projects</h1>
              <p className="text-base text-[#185B30] lowercase text-left">
                our portfolio represents a diverse range of architectural typologies, from intimate residences to large-scale urban interventions. each project is a unique response to site, program, and client aspirations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {projects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group block transition-all duration-500 ease-out"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    animationDelay: `${(index % 8) * 0.05}s`,
                    opacity: 0
                  }}
                >
                  {/* Image container — relative for overlay */}
                  <div className="overflow-hidden mb-6 relative">
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full aspect-[2/3] object-cover object-center"
                    />

                    {/* Desktop hover overlay */}
                    <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-start justify-end p-6">
                      <h2 className="text-base text-white font-normal lowercase mb-1">
                        {project.title}
                      </h2>
                      <p className="text-sm text-white/80 lowercase">{project.location}</p>
                    </div>
                  </div>

                  {/* Mobile text — always visible */}
                  <div className="md:hidden space-y-1 text-left">
                    <h2 className="text-base text-[#185B30] font-normal lowercase">
                      {project.title}
                    </h2>
                    <p className="text-base text-[#185B30] lowercase">{project.location}</p>
                  </div>

                </Link>
              ))}
            </div>
          </section>

          <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
      </main>
    </>
  );
}
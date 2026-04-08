import { AtSign, Instagram, Mail, MapPin } from 'lucide-react';
import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200" style={{ backgroundColor: '#F5FAF7' }}>
      <div className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-sm font-light tracking-wider mb-4" style={{ color: '#185B30' }}>zlgdesign</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#185B30' }}>
              crafting timeless spaces through innovative and sustainable architecture.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-wider mb-4 font-light" style={{ color: '#185B30' }}>contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2" style={{ color: '#185B30' }}>
                <Mail size={14} />
                <a href="mailto:huatlim@zlgdesign.com" className="transition-colors hover:opacity-70" style={{ color: '#185B30' }}>
                  huatlim@zlgdesign.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-wider mb-4 font-light" style={{ color: '#185B30' }}>follow us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.threads.com/@huatlim"
                className="transition-colors hover:opacity-70"
                style={{ color: '#185B30' }}
                aria-label="Threads"
              >
                <AtSign size={20} />
              </a>
              <a
                href="https://www.instagram.com/zlgdesign/?hl=en"
                className="transition-colors hover:opacity-70"
                style={{ color: '#185B30' }}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-wider mb-4 font-light" style={{ color: '#185B30' }}>locate us</h4>
            <div className="flex items-start space-x-2 text-xs lowercase mb-4">
              <a
                href="https://maps.app.goo.gl/XU8fK6RHEw2pYWqD6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-2 transition-colors hover:opacity-70"
                style={{ color: '#185B30' }}
              >
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <address className="not-italic leading-relaxed">
                  1-8, Bangunan Perdagangan D7, 800<br />
                  Jln Sentul, Sentul, 51000 Kuala Lumpur,<br />
                  Federal Territory of Kuala Lumpur
                </address>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: '#185B3033' }}>
          <p className="text-xs" style={{ color: '#185B30' }}>
            © {new Date().getFullYear()} zlgdesign. all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-dark text-white pt-32 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white text-stone-dark rounded-full flex items-center justify-center font-display italic text-xl">G</div>
              <span className="text-xl font-light tracking-widest uppercase">Shree Ganesh</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xs font-light">
              Architectural stone curators specializing in premium marble and exotic granite solutions since 1995.
            </p>
            <div className="flex space-x-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-white/20 hover:text-stone-accent transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-10 text-white/40">Collections</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/products" className="text-white/60 hover:text-white transition-colors">Italian Marble</Link></li>
              <li><Link to="/products" className="text-white/60 hover:text-white transition-colors">Exotic Granite</Link></li>
              <li><Link to="/products" className="text-white/60 hover:text-white transition-colors">Mirror Onyx</Link></li>
              <li><Link to="/products" className="text-white/60 hover:text-white transition-colors">Quartzite</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-10 text-white/40">Information</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors">Our Heritage</Link></li>
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors">Stone Care</Link></li>
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors">Site Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-10 text-white/40">Newsletter</h4>
            <p className="text-sm text-white/40 mb-6 font-light">Subscribe to receive stone arrival alerts.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white/5 border-b border-white/10 py-3 text-sm focus:outline-none focus:border-stone-accent transition-all pl-0"
              />
              <button className="absolute right-0 top-3 text-[10px] font-bold uppercase tracking-widest text-stone-accent">Join</button>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase font-bold text-white/20">
          <p>© 2026 Shree Ganesh Marble & Granite. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-10 gap-y-4 mt-6 md:mt-0">
             <span>Jaipur, India</span>
             <span className="flex items-center gap-1"><Phone size={10} /> +91 7028111062</span>
             <span>Universal Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

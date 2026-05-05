import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageSquare, Send, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-amber-100"
          >
            Get in touch
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Expert Stone <span className="italic text-amber-700">Consultation</span></h1>
          <p className="text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Whether you're an architect, builder, or homeowner, we're here to help you select the perfect stone for your unique vision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-12 translate-x-12 blur-3xl pointer-events-none" />
               
               <h3 className="text-2xl font-serif font-bold mb-8">Corporate Showroom</h3>
               
               <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Global HQ</p>
                      <p className="text-sm font-light leading-relaxed">123 Marble Market, Station Road, Jaipur, Rajasthan 302001, India</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Enquiries</p>
                      <p className="text-sm font-bold">+91 7028111062</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Official Support</p>
                      <p className="text-sm font-medium">sales@shreeganeshmarble.com</p>
                    </div>
                  </div>
               </div>

               <div className="mt-12 pt-8 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Availability</h4>
                  <div className="flex items-center space-x-3 text-xs">
                    <Clock size={14} className="text-amber-500" />
                    <span>Mon - Sat: 10AM - 8PM IST</span>
                  </div>
               </div>
            </div>

            <a 
              href="https://wa.me/917028111062" 
              target="_blank" 
              rel="noreferrer"
              className="block bg-emerald-500 text-white p-6 rounded-3xl shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all text-center group"
            >
              <div className="flex items-center justify-center space-x-3">
                <MessageSquare size={24} />
                <span className="text-lg font-bold">Chat on WhatsApp</span>
              </div>
              <p className="text-emerald-100 text-xs mt-1 font-medium group-hover:scale-105 transition-transform">Get instant pricing via chat</p>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-100 shadow-sm">
               <h3 className="text-2xl font-bold text-slate-900 mb-8 px-2 flex items-center space-x-3">
                 <Send className="text-amber-600" size={24} />
                 <span>Send us a message</span>
               </h3>

               <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Your Name</label>
                      <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 ring-amber-500/20 focus:border-amber-500 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 ring-amber-500/20 focus:border-amber-500 transition-all outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Project Interest</label>
                    <div className="flex flex-wrap gap-3">
                      {['Residential', 'Commercial', 'Exteriors', 'Showroom Fitout'].map(tag => (
                        <button key={tag} type="button" className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:border-amber-500 hover:text-amber-600 transition-all">{tag}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Detailed Enquiry</label>
                    <textarea rows={6} placeholder="Tell us about your requirements, square footage, and budget..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 ring-amber-500/20 focus:border-amber-500 transition-all outline-none resize-none"></textarea>
                  </div>

                  <button className="w-full premium-gradient py-5 rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 hover:shadow-slate-300 transition-all active:scale-95">
                    Launch Enquiry
                  </button>
               </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
         <div className="h-96 w-full rounded-3xl overflow-hidden grayscale bg-slate-200 relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold tracking-widest uppercase">
               Showroom Location Map
            </div>
            {/* Real iframe embed would go here */}
         </div>
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, Gem, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Home: React.FC = () => {
  const { addToCart } = useCart();

  const featuredStones = [
    { id: '1', name: 'Statuario White', category: 'marble', price: 950, stock: 200, image: 'https://images.unsplash.com/photo-1590059132213-f91590b146b2?q=80&w=800', origin: 'Italian Origin' },
    { id: '2', name: 'Black Galaxy', category: 'granite', price: 180, stock: 500, image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=800', origin: 'Indian Granite' }
  ];

  return (
    <div className="overflow-x-hidden pt-20 bg-bg-main">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row px-6 md:px-12 py-10 md:py-24 gap-12 max-w-7xl mx-auto items-center">
        <div className="w-full lg:w-5/12 flex flex-col justify-center">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
          >
            <span className="text-stone-accent font-display italic text-lg mb-4 block">Premium Natural Stone</span>
            <h1 className="text-6xl md:text-8xl text-editorial mb-8">
              Timeless <br/> <span className="italic">Elegance</span> <br/> In Every Vein.
            </h1>
            <p className="text-stone-dark/60 dark:text-stone-cream/60 text-sm leading-relaxed mb-10 pr-0 md:pr-12 max-w-md">
              Exquisite marble and granite sourced from the world's finest quarries. Elevating your architectural vision with superior quality and artisanal craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary">View Products</Link>
              <Link to="/contact" className="btn-outline">Free Consultation</Link>
            </div>
          </motion.div>
        </div>

        <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
           {/* Featured Stone 1 */}
           <motion.div 
             initial={{ opacity: 0, rotate: -5 }}
             animate={{ opacity: 1, rotate: -2 }}
             className="marble-card p-4 transform"
           >
             <Link to={`/products/${featuredStones[0].id}`}>
               <div className="aspect-square bg-slate-200 rounded-[1.5rem] overflow-hidden relative group">
                 <img src={featuredStones[0].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Marble" />
                 <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">New Arrival</div>
               </div>
             </Link>
             <div className="px-3 pt-4">
                <Link to={`/products/${featuredStones[0].id}`}>
                  <h3 className="font-display text-2xl hover:text-stone-accent transition-colors">{featuredStones[0].name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-1 mb-4">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{featuredStones[0].origin}</span>
                  <span className="font-medium text-stone-accent">₹{featuredStones[0].price} / sq.ft</span>
                </div>
                <button 
                  onClick={() => addToCart({ ...featuredStones[0], quantity: 1 })}
                  className="w-full bg-stone-dark text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-accent transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
             </div>
           </motion.div>

           {/* Featured Stone 2 */}
           <motion.div 
             initial={{ opacity: 0, rotate: 5, y: 20 }}
             animate={{ opacity: 1, rotate: 3, y: 40 }}
             className="marble-card p-4 transform hidden sm:block"
           >
             <Link to={`/products/${featuredStones[1].id}`}>
               <div className="aspect-square bg-slate-800 rounded-[1.5rem] overflow-hidden relative group">
                 <img src={featuredStones[1].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Granite" />
                 <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Best Seller</div>
               </div>
             </Link>
             <div className="px-3 pt-4">
                <Link to={`/products/${featuredStones[1].id}`}>
                  <h3 className="font-display text-2xl font-medium hover:text-stone-accent transition-colors">{featuredStones[1].name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-1 mb-4">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{featuredStones[1].origin}</span>
                  <span className="font-medium text-stone-accent">₹{featuredStones[1].price} / sq.ft</span>
                </div>
                <button 
                  onClick={() => addToCart({ ...featuredStones[1], quantity: 1 })}
                  className="w-full bg-stone-dark text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-accent transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
             </div>
           </motion.div>

           {/* Stats Widget */}
           <div className="absolute -bottom-10 -left-6 bg-stone-dark text-white w-56 p-6 rounded-[2rem] shadow-2xl z-10 hidden xl:block">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[8px] uppercase tracking-[0.2em] opacity-60">Architect Trust</span>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[8px] opacity-60 uppercase mb-1">Satisfied Projects</div>
                  <div className="text-3xl font-display">1.2K+</div>
                  <div className="h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-stone-accent"></motion.div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-stone-bg dark:bg-stone-dark/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
               <h2 className="text-5xl text-editorial mb-6 italic">Handpicked Collections</h2>
               <p className="text-stone-dark/60 dark:text-stone-cream/60 font-light leading-relaxed">Each slab in our collection is meticulously inspected for quality, pattern consistency, and architectural integrity.</p>
            </div>
            <Link to="/products" className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-stone-dark/20 dark:border-stone-cream/20 pb-2 hover:border-stone-accent transition-all">View All Selections</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Italian Classics", img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=800", count: "14 Varieties" },
              { title: "Exotic Granites", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800", count: "28 Varieties" },
              { title: "Mirror Onyx", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800", count: "08 Varieties" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-stone-dark/10 group-hover:bg-transparent transition-all" />
                </div>
                <h4 className="font-display text-3xl mb-1">{item.title}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>

  );
};

export default Home;

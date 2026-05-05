import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ShoppingCart, Eye, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductService } from '../services/dataService';
import { useCart } from '../hooks/useCart';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      // Mock data for initial demo if DB is empty
      const data = await ProductService.getAll();
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts([
          { id: '1', name: 'Statuario White', category: 'marble', price: 950, stock: 200, image: 'https://images.unsplash.com/photo-1590059132213-f91590b146b2?q=80&w=800' },
          { id: '2', name: 'Black Galaxy', category: 'granite', price: 180, stock: 500, image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=800' },
          { id: '3', name: 'Golden Onyx', category: 'onyx', price: 1500, stock: 50, image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=800' },
          { id: '4', name: 'Pure White Quartz', category: 'quartz', price: 450, stock: 300, image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800' },
          { id: '5', name: 'Calacatta Gold', category: 'marble', price: 1200, stock: 120, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800' },
          { id: '6', name: 'Steel Grey', category: 'granite', price: 120, stock: 1000, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800' },
        ]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-xl animate-pulse">Refining Stone Data...</div>;

  return (
    <div className="bg-bg-main min-h-screen pt-32 pb-20 px-6 md:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-stone-accent font-display italic text-lg mb-2 block">Our Collection</span>
            <h1 className="text-6xl text-editorial mb-6 flex items-center gap-4">
              The <span className="italic">Stone</span> Library
            </h1>
            <div className="h-px w-full bg-stone-dark/10 dark:bg-white/10" />
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 space-y-12">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-stone-dark/40 dark:text-stone-cream/40">Search</h3>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Find a stone..." 
                  className="w-full bg-white dark:bg-stone-dark/40 border border-stone-dark/5 dark:border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:border-stone-accent transition-all text-sm dark:text-stone-cream"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute right-4 top-3 text-stone-dark/20 dark:text-stone-cream/20 group-focus-within:text-stone-accent" size={16} />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-stone-dark/40 dark:text-stone-cream/40">Collections</h3>
              <div className="space-y-3">
                {['all', 'marble', 'granite', 'onyx', 'quartz'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`block w-full text-left text-sm transition-all pb-2 border-b uppercase tracking-widest text-[10px] font-bold ${
                      category === cat 
                      ? 'text-stone-accent border-stone-accent' 
                      : 'text-stone-dark/40 border-transparent hover:text-stone-dark dark:text-stone-cream/40 dark:hover:text-stone-cream'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="w-full lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1,2,4,5].map(i => (
                  <div key={i} className="aspect-[4/5] bg-stone-dark/5 rounded-[2.5rem] animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-stone-dark/10 rounded-[3rem]">
                <h3 className="text-editorial text-3xl mb-4 italic">No stones found</h3>
                <p className="text-gray-400 font-light mb-8">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => {setCategory('all'); setSearch('');}}
                  className="btn-outline"
                >
                  Reset Library
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="marble-card p-4 group cursor-pointer"
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-[4/5] overflow-hidden rounded-[1.8rem] mb-6 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-dark">
                          {product.category}
                        </div>
                      </div>
                    </Link>
                    <div className="px-2">
                      <div className="flex justify-between items-start mb-2 pt-2">
                        <Link to={`/products/${product.id}`} className="hover:text-stone-accent transition-colors">
                          <h3 className="text-2xl font-display text-stone-dark">{product.name}</h3>
                        </Link>
                        <span className="text-stone-accent font-medium">₹{product.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.1em] text-gray-400 mb-6">
                        <span>Origin: {product.origin || 'Exclusive Collection'}</span>
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          {product.stock > 0 ? 'In Stock' : 'Ordered Only'}
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({ ...product, quantity: 1 });
                        }}
                        className="w-full bg-stone-dark text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-accent transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Quick Purchase
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>

  );
};

export default Products;

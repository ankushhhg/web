import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Droplets, Ruler, Star } from 'lucide-react';
import { ProductService } from '../services/dataService';
import { useCart } from '../hooks/useCart';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      window.scrollTo(0, 0);
      if (id) {
        // Since we might not have the DB yet, we check the static list first
        const mockProducts = [
          { id: '1', name: 'Statuario White', category: 'marble', price: 950, stock: 200, image: 'https://images.unsplash.com/photo-1590059132213-f91590b146b2?q=80&w=1200', desc: 'Premium white marble from Carrara quarries. Known for its distinct grey veining and mirror finish capabilities.' },
          { id: '2', name: 'Black Galaxy', category: 'granite', price: 180, stock: 500, image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=1200', desc: 'A stunning black granite base with bronze/gold colored speckles. High durability for kitchen countertops.' },
          { id: '3', name: 'Golden Onyx', category: 'onyx', price: 1500, stock: 50, image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200', desc: 'Translucent onyx variety that glows when backlit. Ideal for bar counters and feature walls.' },
          { id: '4', name: 'Pure White Quartz', category: 'quartz', price: 450, stock: 300, image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200', desc: 'Engineered stone with 93% natural quartz. Zero porosity and highly resistant to stains.' },
          { id: '5', name: 'Calacatta Gold', category: 'marble', price: 1200, stock: 120, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200', desc: 'Ultra-luxury marble with bold gold and grey veins. The pinnacle of interior elegance.' },
          { id: '6', name: 'Steel Grey', category: 'granite', price: 120, stock: 1000, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200', desc: 'Classic steel grey granite. Perfect for heavy traffic outdoor areas and commercial flooring.' },
        ];
        
        // Try real service first
        const data = await ProductService.getById(id);
        if (data) {
          setProduct(data);
        } else {
          const mock = mockProducts.find(p => p.id === id);
          if (mock) setProduct(mock);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse">Processing Stone Profile...</div>;
  if (!product) return <div className="h-screen flex flex-col items-center justify-center">Stone not found. <button onClick={() => navigate('/products')} className="mt-4 text-amber-600 font-bold">Back to Gallery</button></div>;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-square">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-50 rounded-xl overflow-hidden hover:ring-2 ring-amber-500 cursor-pointer transition-all">
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover opacity-60 hover:opacity-100" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase rounded-full tracking-widest">{product.category}</div>
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <span className="text-slate-400 text-xs ml-2">(48 Reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">{product.name} Variety</h1>
              <p className="text-slate-600 font-light leading-relaxed mb-6">{product.desc || "Exquisite naturally occurring stone, meticulously polished to achieve a mirror finish. Ideal for high-end residential and commercial projects looking for eternal style."}</p>
              
              <div className="flex items-end space-x-4 mb-8">
                <span className="text-4xl font-serif font-bold text-amber-700">₹{product.price}</span>
                <span className="text-slate-400 text-lg mb-1 leading-none uppercase tracking-tighter">Per Sq. Ft.</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center space-x-4">
                  <Droplets className="text-amber-600" size={24} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Porosity</p>
                    <p className="text-sm font-bold text-slate-800">Ultra Low</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center space-x-4">
                  <Ruler className="text-amber-600" size={24} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Standard Size</p>
                    <p className="text-sm font-bold text-slate-800">10' x 6' Slabs</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-10">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors border-r border-slate-200">-</button>
                  <input 
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-12 text-center font-bold text-lg bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors border-l border-slate-200">+</button>
                </div>
                <div className="text-sm">
                  <p className="text-slate-400 font-medium">Total Area</p>
                  <p className="text-slate-900 font-bold tracking-tight">Approx. {quantity * 60} Sq Ft.</p>
                </div>
              </div>

              <div className="flex space-x-4 mb-12">
                <button 
                  onClick={() => addToCart({ ...product, quantity })}
                  className="flex-grow premium-gradient py-5 rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 hover:shadow-slate-300 transition-all flex items-center justify-center space-x-3 active:scale-95"
                >
                  <ShoppingCart size={24} />
                  <span>Add To Cart</span>
                </button>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100">
                <div className="flex items-center space-x-3 text-slate-600">
                  <Truck size={20} className="text-amber-600" />
                  <span className="text-sm font-medium">Safe delivery in 5-7 business days</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <ShieldCheck size={20} className="text-amber-600" />
                  <span className="text-sm font-medium">Genuine quality certificate provided</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

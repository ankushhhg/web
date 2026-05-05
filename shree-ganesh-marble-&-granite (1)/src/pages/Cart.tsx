import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Cart: React.FC = () => {
  const { items, total, updateQuantity, setQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">Your collection is empty</h2>
        <p className="text-slate-500 mb-10 max-w-sm text-center font-light">Looks like you haven't selected any premium stones yet for your project.</p>
        <Link 
          to="/products"
          className="premium-gradient px-10 py-4 rounded-xl font-bold shadow-lg shadow-slate-200"
        >
          Browse Varieties
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 flex items-center space-x-4">
          <ShoppingCart size={32} className="text-amber-700" />
          <span>Reserved Stock</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id}
                  className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center border border-slate-100 shadow-sm"
                >
                  <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden mb-4 sm:mb-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow sm:mx-8 w-full text-center sm:text-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Ref: SG-{item.id.slice(0,4)}</p>
                    <p className="text-amber-700 font-serif font-bold text-lg">₹{item.price} / sqft</p>
                  </div>

                  <div className="flex flex-col items-center sm:items-end justify-between h-full space-y-4">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 transition-colors border-r border-slate-200"
                      >
                        <Minus size={14} />
                      </button>
                      <input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 h-10 text-center font-bold bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 transition-colors border-l border-slate-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl sticky top-32">
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 pb-4 border-b border-slate-50">Project Estimate</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-bold">₹{(total * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Handling & Crating</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Investment</p>
                    <p className="text-3xl font-serif font-bold text-slate-900">₹{(total * 1.18).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full premium-gradient py-5 rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 hover:shadow-slate-300 transition-all flex items-center justify-center space-x-3 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>

              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                  <Star size={16} />
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Inventory is limited for these batches. Complete your order within 24 hours to guarantee availability of current stock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, Phone, Mail, User, Landmark, QrCode, Smartphone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { OrderService } from '../services/dataService';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    mobile: profile?.phone || '',
    address: '',
    city: '',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank_transfer'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const totalToPay = total * 1.18;
      const orderData = {
        items: items.map(i => ({ 
          id: i.id, 
          name: i.name, 
          price: i.price, 
          quantity: i.quantity,
          image: i.image
        })),
        totalAmount: totalToPay,
        shippingInfo: formData,
        paymentMethod: paymentMethod
      };
      
      // Create the order in our database first
      await OrderService.create(orderData);

      // If UPI is selected, trigger the deep link for payment apps
      if (paymentMethod === 'upi') {
        const upiId = "7028111062@ybl";
        const merchantName = "Shree Ganesh Marble";
        const amount = totalToPay.toFixed(2);
        const transactionNote = `Reservation for ${items.length} items`;
        
        // Construct standard UPI deep link
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        
        // Open the UPI URI
        window.location.href = upiUrl;
      }

      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/orders'), 4000);
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20 px-6">
        <h2 className="text-3xl font-display text-stone-dark mb-4">Authentication Required</h2>
        <p className="text-gray-400 mb-10 text-sm font-light">Please sign in to complete your project reservation.</p>
        <Link to="/login" className="btn-primary px-12 py-4">Sign In to Continue</Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-slate-100 max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Reservation Locked!</h2>
          <p className="text-slate-600 mb-8 font-light">
            Your {paymentMethod === 'upi' ? 'UPI' : 'Bank Transfer'} payment instruction has been received. 
            Verification will take 12-24 hours.
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4 }} className="bg-emerald-500 h-full" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 uppercase tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Shipping Info */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center space-x-3">
                <Truck className="text-amber-600" />
                <span>Site & Contact Details</span>
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Customer Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input disabled type="text" value={profile?.name || ''} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input disabled type="text" value={profile?.email || ''} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Contact Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      required 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-100 outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Site Delivery Address</label>
                  <textarea 
                    required
                    placeholder="Provide detailed site address for marble inspection and unloading."
                    rows={4}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-amber-100 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center space-x-3">
                <CreditCard className="text-amber-600" />
                <span>Payment Method</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'upi' ? 'border-amber-600 bg-amber-50/30' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <Smartphone className={paymentMethod === 'upi' ? 'text-amber-600' : 'text-slate-400'} size={24} />
                  <span className={`mt-2 font-bold text-[10px] uppercase tracking-widest ${paymentMethod === 'upi' ? 'text-slate-900' : 'text-slate-500'}`}>UPI Qr</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'bank_transfer' ? 'border-amber-600 bg-amber-50/30' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <Landmark className={paymentMethod === 'bank_transfer' ? 'text-amber-600' : 'text-slate-400'} size={24} />
                  <span className={`mt-2 font-bold text-[10px] uppercase tracking-widest ${paymentMethod === 'bank_transfer' ? 'text-slate-900' : 'text-slate-500'}`}>Bank</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === 'upi' ? (
                  <motion.div 
                    key="upi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <QrCode size={24} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pay via VPA</p>
                        <p className="font-mono text-sm font-bold text-slate-900">shreeganesh@upi</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      Scan the QR provided after submission or use the VPA above. Send a screenshot of the transaction to our support number for instant verification.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="bank"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Name</p>
                          <p className="text-sm font-bold text-slate-800">HDFC Bank Ltd</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Type</p>
                          <p className="text-sm font-bold text-slate-800">Current</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</p>
                        <p className="font-mono text-sm font-bold text-slate-800">50200012345678</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IFSC Code</p>
                        <p className="font-mono text-sm font-bold text-slate-800">HDFC0001234</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-stone-dark text-white py-5 rounded-2xl text-lg font-bold shadow-xl shadow-stone-dark/10 transition-all hover:translate-y-[-2px] active:scale-95 disabled:opacity-50 disabled:translate-y-0"
            >
              {isSubmitting ? "Locking Reservation..." : `Checkout & Pay - ₹${(total * 1.18).toLocaleString()}`}
            </button>
          </form>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4">Stone Selection Summary</h3>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 group-hover:border-amber-200 transition-colors">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800 text-sm group-hover:text-amber-700 transition-colors uppercase tracking-tight">{item.name}</p>
                      <p className="text-slate-400 text-xs font-medium">{item.quantity} units identified</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800 font-serif">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>GST (18%)</span>
                  <span className="font-bold text-slate-800 font-serif">₹{(total * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div className="flex flex-col">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Investment</span>
                    <span className="text-3xl font-serif font-bold text-amber-700">₹{(total * 1.18).toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600" title="Secure Payment">
                    <ShieldCheck size={20} />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="text-sm font-bold mb-2">Expert Consultation</h4>
                   <p className="text-xs text-slate-400 font-light leading-relaxed">
                     Once the payment is verified, our stone specialist will contact you to coordinate temple-standard inspection at the site.
                   </p>
                </div>
                <div className="absolute -right-4 -bottom-4 text-white/5 transform rotate-12 scale-150">
                  <Landmark size={80} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

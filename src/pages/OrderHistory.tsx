import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, FileText, ExternalLink, Clock, CheckCircle, XCircle, Truck, Trash2 } from 'lucide-react';
import { OrderService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { generateInvoicePDF } from '../utils/invoiceGenerator';

const OrderHistory: React.FC = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await OrderService.getUserOrders();
          setOrders(data);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  const toggleOrderExpand = (id: string) => {
    setExpandedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'approved': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      case 'delivered': return <Truck size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  const handleDownloadInvoice = (order: any) => {
    generateInvoicePDF({
      orderId: order.id,
      customerName: profile?.name || 'Customer',
      customerEmail: profile?.email || '',
      customerMobile: order.shippingInfo?.mobile || '',
      items: order.items,
      totalAmount: order.totalAmount,
      date: new Date(order.createdAt).toLocaleDateString(),
      paymentMethod: order.paymentMethod || 'upi',
      paymentStatus: order.paymentStatus || 'pending'
    });
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await OrderService.delete(orderId);
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20 animate-pulse">Retrieving your archives...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-serif font-bold text-slate-900 flex items-center space-x-4">
            <History size={32} className="text-amber-700" />
            <span>Order Archive</span>
          </h1>
          <p className="text-slate-500 font-medium">{orders.length} Total Requests</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <History size={32} className="text-slate-300" />
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">No past orders</h3>
             <p className="text-slate-500">Your future masterpieces start with your first stone selection.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {order.id.slice(-8)}</span>
                      <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        order.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                        order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
                      }`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                       <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Items</p>
                         <p className="text-slate-800 font-bold">{order.items.length} Varieties</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Investment</p>
                         <p className="text-amber-700 font-serif font-bold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                       </div>
                       <div className="hidden sm:block">
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Payment</p>
                         <p className="text-slate-800 font-medium uppercase text-xs">{order.paymentMethod} ({order.paymentStatus})</p>
                       </div>
                       <div className="hidden sm:block">
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Placed On</p>
                         <p className="text-slate-800 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </div>

                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => toggleOrderExpand(order.id)}
                        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                          expandedOrders.includes(order.id) 
                            ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-700 hover:text-amber-700'
                        }`}
                      >
                        <ExternalLink size={18} />
                        <span>{expandedOrders.includes(order.id) ? 'Hide details' : 'View Details'}</span>
                      </button>
                      <button 
                        onClick={() => handleDownloadInvoice(order)}
                        className="flex items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Download Invoice"
                      >
                        <FileText size={18} />
                      </button>
                      {profile?.role === 'admin' && (
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                          title="Delete Order (Admin Only)"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrders.includes(order.id) && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 pt-8 border-t border-slate-200 space-y-8 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Inspection Site Address</h4>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                                {order.shippingInfo?.address || 'Standard Pickup Address Mapping'}
                              </p>
                              <div className="mt-4 flex items-center space-x-2 text-slate-500">
                                <Truck size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Coordination: {order.shippingInfo?.mobile}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Intelligence</h4>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Method</span>
                                <span className="font-bold uppercase text-slate-800">{order.paymentMethod}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Transaction Status</span>
                                <span className={`font-bold uppercase ${order.paymentStatus === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {order.paymentStatus}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Approval Stage</span>
                                <span className="font-bold uppercase text-slate-800">{order.status}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Stone Allocation</h4>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                               <div className="space-y-3">
                                 {order.items.map((item: any, i: number) => (
                                   <div key={i} className="flex justify-between items-center text-[11px]">
                                     <div className="flex items-center space-x-2">
                                       <div className="w-6 h-6 bg-slate-200 rounded-md overflow-hidden shrink-0 border border-slate-100">
                                         <img src={item.image} className="w-full h-full object-cover" />
                                       </div>
                                       <span className="text-slate-700 font-bold uppercase tracking-tighter">{item.name}</span>
                                     </div>
                                     <span className="text-slate-400 font-medium">× {item.quantity} sqft</span>
                                   </div>
                                 ))}
                               </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50 flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-700 shadow-sm shrink-0">
                            <History size={18} />
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Your reservation is currently being processed by our stone experts. A specialist will contact you on <strong>{order.shippingInfo?.mobile}</strong> to finalize site inspection timings.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!expandedOrders.includes(order.id) && (
                    <div className="mt-6 pt-6 border-t border-slate-50">
                       <div className="flex flex-wrap gap-2">
                         {order.items.map((item: any, i: number) => (
                           <span key={i} className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-bold uppercase">
                             {item.name} × {item.quantity}
                           </span>
                         ))}
                       </div>
                    </div>
                  )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

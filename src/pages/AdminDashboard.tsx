import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Download, 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Upload,
  Image as ImageIcon,
  FileText,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { AdminService, ProductService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AdminDashboard: React.FC = () => {
  const { profile, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [reportFrequency, setReportFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const LOW_STOCK_THRESHOLD = 75;
  const lowStockProducts = products.filter(p => p.stock < LOW_STOCK_THRESHOLD);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'marble',
    stock: '',
    image: '',
    origin: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stats calculation
  const revenue = React.useMemo(() => 
    orders.reduce((sum, o) => o.status === 'approved' || o.status === 'delivered' ? sum + o.totalAmount : sum, 0)
  , [orders]);

  // Dynamic Chart Data Processing
  const processedChartData = React.useMemo(() => {
    if (!orders.length) return [];
    
    const now = new Date();
    const data: Record<string, { name: string, sales: number, orders: number, timestamp: number }> = {};
    
    // Group approved/delivered orders
    const validOrders = orders.filter(o => o.status === 'approved' || o.status === 'delivered');

    validOrders.forEach(order => {
      const date = new Date(order.createdAt);
      let key = '';
      let label = '';
      
      if (reportFrequency === 'daily') {
        // Last 7 days
        key = date.toISOString().split('T')[0];
        label = date.toLocaleDateString(undefined, { weekday: 'short' });
      } else if (reportFrequency === 'weekly') {
        // Simple week grouping (approximate)
        const weekNum = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
        key = `${date.getFullYear()}-W${weekNum}-${date.getMonth()}`;
        label = `W${weekNum} ${date.toLocaleDateString(undefined, { month: 'short' })}`;
      } else if (reportFrequency === 'monthly') {
        key = `${date.getFullYear()}-${date.getMonth()}`;
        label = date.toLocaleDateString(undefined, { month: 'short' });
      } else if (reportFrequency === 'yearly') {
        key = `${date.getFullYear()}`;
        label = key;
      }

      if (!data[key]) {
        data[key] = { name: label, sales: 0, orders: 0, timestamp: date.getTime() };
      }
      data[key].sales += order.totalAmount;
      data[key].orders += 1;
    });

    const result = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
    
    // Limit range based on frequency for better visualization
    if (reportFrequency === 'daily') return result.slice(-7);
    if (reportFrequency === 'weekly') return result.slice(-8);
    if (reportFrequency === 'monthly') return result.slice(-12);
    return result;
  }, [orders, reportFrequency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData, usersData] = await Promise.all([
          AdminService.getOrders(),
          ProductService.getAll(),
          AdminService.getUsers()
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setUsers(usersData);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (authLoading) return null;
  if (!profile || profile.role !== 'admin') return <Navigate to="/" />;

  const pieData = [
    { name: 'Marble', value: products.filter(p => p.category === 'marble').length || 1 },
    { name: 'Granite', value: products.filter(p => p.category === 'granite').length || 1 },
    { name: 'Onyx', value: products.filter(p => p.category === 'onyx').length || 1 },
    { name: 'Quartz', value: products.filter(p => p.category === 'quartz').length || 1 },
  ];
  const COLORS = ['#b45309', '#b91c1c', '#0f172a', '#64748b'];

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await AdminService.updateOrderStatus(id, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Delete this stone variety from inventory?")) {
      try {
        await ProductService.delete(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (e) {
        alert("Failed to delete product");
      }
    }
  };

  const deleteOrder = async (orderId: string) => {
    console.log("Attempting to delete order:", orderId);
    if (window.confirm("Permanently remove this order from system?")) {
      try {
        await AdminService.deleteOrder(orderId);
        setOrders(prev => prev.filter(o => o.id !== orderId));
        console.log("Order deleted successfully");
      } catch (e: any) {
        console.error("Order delete error:", e);
        alert(`Failed to delete order: ${e.message || 'Unknown error'}`);
      }
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    if (userId === profile.id) {
      alert("You cannot change your own role.");
      return;
    }
    try {
      await AdminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !newProduct.image) {
      alert("Please select an image or provide a URL.");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = newProduct.image;

      if (selectedFile) {
        const uploadRes = await AdminService.uploadImage(selectedFile);
        imageUrl = uploadRes.imageUrl;
      }

      const productData = {
        ...newProduct,
        image: imageUrl,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      };
      
      const res = await ProductService.create(productData);
      setProducts(prev => [res, ...prev]);
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: 'marble',
        stock: '',
        image: '',
        origin: ''
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-stone-dark pt-20 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-white/5 hidden md:flex flex-col p-6 fixed h-full pt-10 transition-colors">
        <h2 className="text-xs font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-[0.2em] mb-10 px-2">Management</h2>
        <nav className="space-y-1">
          {[
            { id: 'overview', icon: <TrendingUp size={20} />, label: 'Overview' },
            { id: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
            { id: 'products', icon: (
              <div className="relative">
                <Package size={20} />
                {lowStockProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                )}
              </div>
            ), label: 'Inventory' },
            { id: 'customers', icon: <Users size={20} />, label: 'Customers' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-slate-900 text-white dark:bg-stone-cream dark:text-stone-dark shadow-lg shadow-slate-200 dark:shadow-black/20' 
                  : 'text-slate-500 dark:text-stone-cream/60 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow md:ml-64 p-4 md:p-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-stone-cream mb-2 uppercase tracking-tight">Admin Console</h1>
            <p className="text-slate-500 dark:text-stone-cream/40 text-sm font-medium">Database: <span className="text-emerald-500">MONGODB ATLAS</span></p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, change: '+8.2%', up: true, icon: <TrendingUp className="text-emerald-500" /> },
                { label: 'Orders', value: orders.length, change: '+12.5%', up: true, icon: <ShoppingCart className="text-amber-500" /> },
                { label: 'Customers', value: users.length, change: '+5.2%', up: true, icon: <Users className="text-blue-500" /> },
                { label: 'Active Stones', value: products.length, icon: <Package className="text-slate-400" /> }
              ].map((stat, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg">{stat.icon}</div>
                  </div>
                  <p className="text-xs font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold text-slate-900 dark:text-stone-cream">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-2">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-stone-cream flex items-center space-x-2">
                     <div className="w-1 h-4 bg-amber-500 rounded-full" />
                     <span>Revenue Performance</span>
                   </h3>
                   <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-xl">
                      {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setReportFrequency(freq)}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            reportFrequency === freq 
                              ? 'bg-white dark:bg-stone-cream text-slate-900 dark:text-stone-dark shadow-sm' 
                              : 'text-slate-400 dark:text-stone-cream/40 hover:text-slate-600 dark:hover:text-stone-cream/60'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                   </div>
                 </div>
                 <div className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={processedChartData}>
                       <defs>
                         <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#b45309" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#b45309" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#333' : '#f1f5f9'} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: theme === 'dark' ? '#666' : '#94a3b8' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: theme === 'dark' ? '#666' : '#94a3b8' }} tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} />
                       <Tooltip 
                         formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                         contentStyle={{ backgroundColor: theme === 'dark' ? '#111' : '#FFF', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: theme === 'dark' ? '#FAF9F6' : '#000' }} 
                       />
                       <Area type="monotone" dataKey="sales" stroke="#b45309" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
                <h3 className="text-lg font-bold text-slate-800 dark:text-stone-cream mb-4 px-2">Category Split</h3>
                <div className="h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#111' : '#FFF', borderColor: theme === 'dark' ? '#333' : '#f1f5f9', color: theme === 'dark' ? '#FAF9F6' : '#000' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 space-y-3">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex justify-between items-center px-2">
                       <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                         <span className="text-xs font-bold text-slate-600 dark:text-stone-cream/60">{item.name}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-stone-cream">Recent Transactions</h3>
                 <button onClick={() => setActiveTab('orders')} className="text-amber-600 dark:text-amber-500 text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-stone-cream/40 text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-4">Customer</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Payment</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {orders.slice(0, 5).map((order) => {
                      return (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="font-bold text-slate-800 dark:text-stone-cream text-sm">{order.userId?.name || 'Customer'}</div>
                             <p className="text-xs text-slate-400 dark:text-stone-cream/40">ID: {order.id.slice(-8)}</p>
                          </td>
                          <td className="px-8 py-6 font-serif font-bold text-amber-700 dark:text-amber-500">₹{order.totalAmount.toLocaleString()}</td>
                          <td className="px-8 py-6">
                             <div className="flex flex-col">
                               <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-stone-cream/40">{order.paymentMethod}</span>
                               <span className={`text-[9px] font-bold uppercase ${order.paymentStatus === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                 {order.paymentStatus}
                               </span>
                             </div>
                          </td>
                          <td className="px-8 py-6 italic text-xs font-medium text-slate-600 dark:text-stone-cream/60">{order.status}</td>
                          <td className="px-8 py-6 text-slate-400 dark:text-stone-cream/30 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm p-8 transition-colors">
              <h3 className="text-xl font-bold mb-8 dark:text-stone-cream">Order Management</h3>
              <div className="grid grid-cols-1 gap-6">
                {orders.map(order => {
                  return (
                    <div key={order.id} className="p-6 border border-slate-100 dark:border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                           <span className="text-[10px] font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">ID: {order.id.slice(-8)}</span>
                           <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">{order.userId?.name || 'Customer'}</span>
                        </div>
                        <p className="text-xl font-serif font-bold text-amber-700 dark:text-amber-500">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-slate-500 dark:text-stone-cream/60 mt-1">{order.items.length} Varieties | Method: <span className="uppercase font-bold text-slate-700 dark:text-stone-cream">{order.paymentMethod}</span></p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select 
                          value={order.paymentStatus} 
                          onChange={async (e) => {
                            try {
                              await AdminService.updateOrderStatus(order.id, { paymentStatus: e.target.value });
                              setOrders(prev => prev.map(o => o.id === order.id ? { ...o, paymentStatus: e.target.value } : o));
                            } catch(err) { alert("Failed to update payment"); }
                          }}
                          className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase focus:outline-none dark:text-stone-cream"
                        >
                          <option value="pending">Pay: Pending</option>
                          <option value="completed">Pay: Success</option>
                          <option value="failed">Pay: Failed</option>
                        </select>
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:text-stone-cream"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>
        )}

        {activeTab === 'customers' && (
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
             <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-stone-cream">Elite Client List</h3>
                <div className="text-[10px] font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-full">
                  Total: {users.length}
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-stone-cream/40 text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-4">User</th>
                      <th className="px-8 py-4">Email</th>
                      <th className="px-8 py-4">Role</th>
                      <th className="px-8 py-4">Joined</th>
                      <th className="px-8 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-stone-cream/60 font-bold text-xs uppercase">
                               {user.name?.[0] || 'U'}
                             </div>
                             <div className="font-bold text-slate-800 dark:text-stone-cream text-sm">{user.name}</div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-600 dark:text-stone-cream/60">{user.email}</td>
                        <td className="px-8 py-6">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                             user.role === 'admin' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-stone-cream/40'
                           }`}>
                             {user.role}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-slate-400 dark:text-stone-cream/30 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6">
                          <select 
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-xs px-3 py-1.5 rounded-lg dark:text-stone-cream"
                            disabled={user.id === profile?.id}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {activeTab === 'products' && (
           <div className="space-y-8">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex justify-between items-center shadow-sm transition-colors">
                <div className="relative w-64">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-stone-cream/40" />
                  <input type="text" placeholder="Search inventory..." className="w-full pl-12 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl text-sm dark:text-stone-cream" />
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-stone-dark dark:bg-stone-cream text-white dark:text-stone-dark px-6 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg hover:opacity-90 transition-all border border-transparent dark:border-stone-cream"
                >
                  <Plus size={18} />
                  <span>Add Stone Variety</span>
                </button>
              </div>

              {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-stone-dark w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
                  >
                    <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900">
                      <h3 className="text-2xl font-display text-slate-900 dark:text-stone-cream">Add New Collection</h3>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
                    </div>

                    <form onSubmit={handleAddProduct} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest block mb-2">Stone Variety Name</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm dark:text-stone-cream focus:border-stone-accent outline-none transition-colors"
                            value={newProduct.name}
                            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest block mb-2">Price (₹)</label>
                            <input 
                              required
                              type="number" 
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm dark:text-stone-cream focus:border-stone-accent outline-none transition-colors"
                              value={newProduct.price}
                              onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest block mb-2">Stock</label>
                            <input 
                              required
                              type="number" 
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm dark:text-stone-cream focus:border-stone-accent outline-none transition-colors"
                              value={newProduct.stock}
                              onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest block mb-2">Product Visualization</label>
                          <div className="relative group/upload">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {previewUrl ? (
                              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-amber-100 dark:border-amber-900/30">
                                <img src={previewUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="text-white flex flex-col items-center">
                                    <Upload size={24} className="mb-2" />
                                    <span className="text-xs font-bold uppercase">Change Image</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="aspect-video bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-100 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover/upload:border-amber-200 transition-all">
                                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover/upload:scale-110 transition-transform">
                                  <ImageIcon size={20} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DRAG & DROP OR CLICK</p>
                                <p className="text-[8px] text-slate-300 mt-1 uppercase font-medium">JPEG, PNG up to 5MB</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-bold text-slate-400 dark:text-stone-cream/40 uppercase tracking-widest block mb-2">Or Image URL (Fallback)</label>
                           <input 
                             type="url" 
                             className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2 text-xs dark:text-stone-cream"
                             value={newProduct.image}
                             onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                             placeholder="https://..."
                           />
                        </div>

                        <button 
                          type="submit" 
                          disabled={uploading}
                          className="w-full bg-stone-dark dark:bg-stone-cream text-white dark:text-stone-dark py-4 rounded-xl font-bold text-sm shadow-xl mt-2 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {uploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white dark:border-stone-dark border-t-transparent rounded-full animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <span>Push to Live Inventory</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col transition-colors">
                    <div className="h-40 bg-slate-100 dark:bg-black/20 relative">
                       <img src={product.image} className="w-full h-full object-cover" />
                       <div className="absolute top-3 right-3 flex space-x-2">
                          <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white/90 dark:bg-black/60 backdrop-blur rounded-lg text-red-500 hover:text-red-700 shadow-lg transition-colors"><Trash2 size={16}/></button>
                       </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-slate-800 dark:text-stone-cream mb-1">{product.name}</h4>
                      <p className="text-xl font-serif font-bold text-amber-700 dark:text-amber-500">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

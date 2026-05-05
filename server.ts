import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- Schemas ---

const transform = {
  toJSON: {
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
}, transform);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  origin: String,
  createdAt: { type: Date, default: Date.now }
}, transform);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['upi', 'bank_transfer'], default: 'upi' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'delivered'], default: 'pending' },
  shippingInfo: {
    mobile: String,
    address: String,
    city: String,
    pincode: String
  },
  createdAt: { type: Date, default: Date.now }
}, transform);

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// --- Middleware ---

const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

// Upload route
app.post('/api/upload', authenticate, adminOnly, upload.single('image'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- API Routes ---

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = email === 'anksh2307@gmail.com' ? 'admin' : 'user';
    
    const user = new User({ name, email, password: hashedPassword, phone, role: userRole });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticate, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/products', authenticate, adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Orders
app.post('/api/orders', authenticate, async (req: any, res) => {
  try {
    const order = new Order({ ...req.body, userId: req.user.id });
    await order.save();
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders/my', authenticate, async (req: any, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Routes
app.get('/api/admin/orders', authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/admin/orders/:id', authenticate, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    console.error('Order Update Error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/admin/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/orders/:id', authenticate, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Order Delete Error:', err);
    res.status(400).json({ error: err.message });
  }
});

// --- Vite for Dev / Static for Prod ---

async function startServer() {
  // MongoDB Connection fallback
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    try {
      console.log('No MONGODB_URI found, starting MongoMemoryServer...');
      const mongod = await MongoMemoryServer.create({
         instance: {
           dbName: 'shreeganesh'
         }
      });
      mongoUri = mongod.getUri();
      console.log('MongoMemoryServer started at:', mongoUri);
    } catch (err) {
      console.error('Failed to start MongoMemoryServer:', err);
      mongoUri = 'mongodb://127.0.0.1:27017/shreeganesh';
    }
  }

  await mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB established at', mongoUri))
    .catch(err => console.error('MongoDB connection error:', err));

  // Seed data
  try {
    const adminEmail = 'anksh2307@gmail.com';
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      console.log('Seeding primary admin user...');
      const hashedPassword = await bcrypt.hash('Tan@2003', 10);
      await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '7028111062'
      });
      console.log('Admin user seeded successfully.');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products into MongoDB...');
      const initialProducts = [
        { name: 'Statuario White', category: 'marble', price: 950, stock: 200, image: 'https://images.unsplash.com/photo-1590059132213-f91590b146b2?q=80&w=1200', description: 'Premium white marble from Carrara quarries.' },
        { name: 'Black Galaxy', category: 'granite', price: 180, stock: 500, image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=1200', description: 'Stunning black granite with gold speckles.' },
        { name: 'Golden Onyx', category: 'onyx', price: 1500, stock: 50, image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200', description: 'Translucent onyx variety.' },
        { name: 'Pure White Quartz', category: 'quartz', price: 450, stock: 300, image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200', description: 'Engineered stone with 93% natural quartz.' },
        { name: 'Calacatta Gold', category: 'marble', price: 1200, stock: 120, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200', description: 'Ultra-luxury marble with gold veins.' },
        { name: 'Steel Grey', category: 'granite', price: 120, stock: 1000, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200', description: 'Classic steel grey granite.' },
      ];
      await Product.insertMany(initialProducts);
      console.log('Seeding complete.');
    }
  } catch (seedErr) {
    console.error('Seeding error:', seedErr);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

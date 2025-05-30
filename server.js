const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');
const blockRoutes = require('./routes/blockRoutes');

// Load env variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ CORS config for Vercel
const corsOptions = {
  origin: 'https://municipality-frontend-rho.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(uploadPath));

// ✅ Debug log for route registration
console.log('✅ Mounting routes...');

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/block', blockRoutes);

// Image download
app.get('/download/:filename', (req, res) => {
  const file = path.join(uploadPath, req.params.filename);
  res.download(file, err => {
    if (err) res.status(404).json({ error: 'File not found.' });
  });
});

// Health check
app.get('/', (req, res) => {
  res.send('🌍 Municipality Complaint Box Backend is running');
});

// Catch-all 404 logger
app.use((req, res) => {
  console.warn(`❗ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

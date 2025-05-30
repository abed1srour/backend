const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');
const blockRoutes = require('./routes/blockRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ CORS Configuration for Vercel frontend
const corsOptions = {
  origin: 'https://municipality-frontend-rho.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded images
app.use('/uploads', express.static(uploadPath));

// Routes
console.log('✅ complaintRoutes mounted at /api/complaints');

app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/block', blockRoutes);

// File download route
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const file = path.join(uploadPath, filename);

  res.download(file, filename, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found.' });
    }
  });
});

// Health check route
app.get('/', (req, res) => {
  res.send('🌍 Municipality Complaint Box Backend is running');
});
app.use((req, res, next) => {
  console.log(`❗ Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not found' });
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

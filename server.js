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

// Middleware
app.use(cors({
  origin: 'https://municipality-frontend-rho.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data

// Serve uploaded images statically
app.use('/uploads', express.static(uploadPath));

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/block', blockRoutes);
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const file = path.join(__dirname, 'uploads', filename);

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

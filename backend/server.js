import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import ImageKit from 'imagekit';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webalbum')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ImageKit initialization
const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT
});

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    const actualToken = token.split(' ')[1];
    if (actualToken === (process.env.ADMIN_TOKEN || 'admin-secret-token')) {
      return next();
    }
  }
  res.status(401).json({ success: false, message: 'Unauthorized' });
};

// Database Models
const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  coverImage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});
const Folder = mongoose.model('Folder', FolderSchema);

const ImageSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  name: String,
  url: String,
  fileId: String,
  height: Number,
  width: Number,
  createdAt: { type: Date, default: Date.now }
});
const ImageModel = mongoose.model('Image', ImageSchema);

// Upload Middleware
const upload = multer();

// Routes
// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'password123';
  
  if (username === validUsername && password === validPassword) {
    res.json({ success: true, token: process.env.ADMIN_TOKEN || 'admin-secret-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Admin - Create Folder
app.post('/api/admin/folders', authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Folder name is required' });
    const folder = new Folder({ name });
    await folder.save();
    res.json({ success: true, folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin - Upload Multiple Images
app.post('/api/admin/images', authenticateAdmin, upload.array('images'), async (req, res) => {
  try {
    const { folderId } = req.body;
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).json({ success: false, message: 'No files provided' });
    if (!folderId) return res.status(400).json({ success: false, message: 'Folder ID is required' });
    
    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });

    const uploadedImages = [];

    for (const file of files) {
      // Upload to ImageKit
      const response = await imagekit.upload({
        file: file.buffer.toString('base64'),
        fileName: file.originalname,
        folder: `/webalbum/${folder.name.replace(/[^a-zA-Z0-9-_]/g, '_')}`
      });

      // Save to MongoDB
      const image = new ImageModel({
        folderId: folder._id,
        name: file.originalname,
        url: response.url,
        fileId: response.fileId,
        height: response.height,
        width: response.width
      });
      await image.save();
      uploadedImages.push(image);
    }

    res.json({ success: true, count: uploadedImages.length, images: uploadedImages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin - Delete Folder
app.delete('/api/admin/folders/:id', authenticateAdmin, async (req, res) => {
  try {
    const folderId = req.params.id;
    // Find all images in this folder to delete from ImageKit
    const images = await ImageModel.find({ folderId });
    for (const img of images) {
      if (img.fileId) await imagekit.deleteFile(img.fileId).catch(() => {});
    }
    await ImageModel.deleteMany({ folderId });
    await Folder.findByIdAndDelete(folderId);
    res.json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin - Delete Image
app.delete('/api/admin/images/:id', authenticateAdmin, async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    if (image.fileId) await imagekit.deleteFile(image.fileId).catch(() => {});
    await ImageModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin - Set Folder Cover
app.put('/api/admin/folders/:id/cover', authenticateAdmin, async (req, res) => {
  try {
    const { coverImage } = req.body;
    await Folder.findByIdAndUpdate(req.params.id, { coverImage });
    res.json({ success: true, message: 'Cover image updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin - Rename Folder
app.put('/api/admin/folders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Folder name is required' });
    const existing = await Folder.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
    if (existing) return res.status(409).json({ success: false, message: 'A folder with that name already exists' });
    await Folder.findByIdAndUpdate(req.params.id, { name: name.trim() });
    res.json({ success: true, message: 'Folder renamed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Public - Fetch Folders
app.get('/api/folders', async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - Fetch Images for a Folder
app.get('/api/folders/:folderId/images', async (req, res) => {
  try {
    const images = await ImageModel.find({ folderId: req.params.folderId }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public - Fetch All Images
app.get('/api/images', async (req, res) => {
  try {
    const images = await ImageModel.find().populate('folderId').sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

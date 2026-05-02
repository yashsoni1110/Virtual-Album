import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for dotenv to load the root .env file from inside backend dir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  coverImage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});
const Folder = mongoose.model('Folder', FolderSchema);

const ImageSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  name: String,
  url: String, // Full imagekit URL basically or relative path
  fileId: String,
  height: Number,
  width: Number,
  createdAt: { type: Date, default: Date.now }
});
const ImageModel = mongoose.model('Image', ImageSchema);

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    const ALBUMS = [
      {
        id: 'anniversary',
        title: 'Anniversary Collection',
        cover: 'Anniversary/DSC_0002.JPG',
        count: 150,
        prefix: 'Anniversary/DSC_',
        padLength: 4,
        extension: 'JPG'
      },
      {
        id: 'birthday',
        title: 'Birthday Celebration',
        cover: 'Birthday/1.jpg',
        count: 17,
        prefix: 'Birthday/',
        padLength: 0,
        extension: 'jpg'
      }
    ];

    for (const album of ALBUMS) {
      // Create folder
      let folder = await Folder.findOne({ name: album.title });
      if (!folder) {
         folder = new Folder({ name: album.title, coverImage: album.cover });
         await folder.save();
         console.log(`Created Folder: ${folder.name}`);

         // Generate images
         const imageDocs = [];
         for (let i = 1; i <= album.count; i++) {
            const num = album.padLength ? String(i).padStart(album.padLength, '0') : String(i);
            const path = `${album.prefix}${num}.${album.extension}`;
            imageDocs.push({
               folderId: folder._id,
               name: path,
               url: `https://ik.imagekit.io/gezkccajj/${path}`,
               fileId: `static-${album.id}-${i}`
            });
         }
         await ImageModel.insertMany(imageDocs);
         console.log(`Inserted ${album.count} images for ${album.title}`);
      } else {
         console.log(`Folder ${album.title} already exists!`);
      }
    }

    console.log('Seed Complete!');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

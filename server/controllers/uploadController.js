import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const buildSafeFilename = (originalName = 'image') => {
  const ext = path.extname(originalName) || '.jpg';
  const baseName = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  return `${baseName || 'image'}-${Date.now()}${ext}`;
};

export const uploadImage = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const hasCloudinaryConfig =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinaryConfig) {
    ensureUploadsDir();

    const filename = buildSafeFilename(req.file.originalname);
    const outputPath = path.join(uploadsDir, filename);
    fs.writeFileSync(outputPath, req.file.buffer);

    return res.status(201).json({
      url: `/uploads/${filename}`,
      filename,
      storage: 'local',
    });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'quickbite',
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
    (error, result) => {
      if (error) {
        res.status(500);
        return res.json({ message: error.message || 'Cloudinary upload failed' });
      }
      res.status(201).json({
        url: result.secure_url,
        public_id: result.public_id,
        storage: 'cloudinary',
      });
    }
  );

  uploadStream.end(req.file.buffer);
};

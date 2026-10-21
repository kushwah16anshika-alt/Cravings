import dotenv from 'dotenv';

dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME || "").trim();
const api_key = (process.env.CLOUDINARY_API_KEY || process.env.API_KEY || "").trim();
const api_secret = (process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET || "").trim();

if (cloud_name && api_key && api_secret) {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
} else if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL.trim(),
    secure: true,
  });
}

export default cloudinary;
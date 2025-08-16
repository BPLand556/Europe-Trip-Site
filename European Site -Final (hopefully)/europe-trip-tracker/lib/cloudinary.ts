import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function generateUploadSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET!,
  };
}

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
) {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  if (width || height) {
    url += `/w_${width || 'auto'},h_${height || 'auto'},c_fill`;
  }
  
  url += `/f_${format},q_${quality}/${publicId}`;
  
  return url;
}

export function getVideoUrl(publicId: string) {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}`;
}

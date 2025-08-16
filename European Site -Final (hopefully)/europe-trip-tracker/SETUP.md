# 🚀 Quick Setup Guide

## Immediate Setup (5 minutes)

### 1. Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
ADMIN_PASSCODE="your-secure-passcode"
DATABASE_URL="file:./dev.db"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="europe-trip"
```

### 2. Database Setup
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 3. Start Development
```bash
pnpm dev
```

### 4. Visit Your App
- **Public Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (use your passcode)

## 🌟 What You Get

✅ **Beautiful Home Page** - Masonry grid of posts with mini map
✅ **Timeline View** - Chronological and city-based organization  
✅ **Interactive Map** - Leaflet with marker clustering
✅ **Admin Panel** - Simple passcode protection
✅ **Post Creation** - Drag & drop media, location picker
✅ **Responsive Design** - Perfect on all devices
✅ **SEO Ready** - RSS, sitemap, OpenGraph

## 📱 First Post

1. Go to `/admin` and enter your passcode
2. Click "Create New Post"
3. Upload photos/videos from your phone
4. Add title, caption, and story
5. Set location (auto-detected from EXIF)
6. Publish!

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

## 🆘 Need Help?

- Check the full [README.md](README.md)
- Run `pnpm test:setup` to verify setup
- Check console for any errors

---

**Your Europe Trip Tracker is ready! ✈️🌍**

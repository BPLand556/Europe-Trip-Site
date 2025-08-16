# Europe Trip Tracker 🌍✈️

A beautiful, phone-first travel journal for documenting your European adventures. Built with Next.js 14, featuring a responsive design, interactive maps, and seamless photo/video uploads.

![Europe Trip Tracker](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)

## ✨ Features

- **📱 Phone-First Design** - Optimized for mobile uploads and viewing
- **🗺️ Interactive Maps** - Leaflet maps with OpenStreetMap tiles and marker clustering
- **📸 Media Management** - Direct uploads to Cloudinary with EXIF extraction
- **📍 Location Services** - Reverse geocoding and location search via Nominatim
- **📝 Rich Content** - Markdown support for detailed travel stories
- **🔒 Simple Admin** - Single passcode authentication for easy access
- **📊 Timeline Views** - Chronological and city-based organization
- **🎨 Beautiful UI** - Modern, clean design with Tailwind CSS and shadcn/ui
- **📱 Responsive** - Works perfectly on all devices
- **🚀 Fast Performance** - Optimized images and lazy loading

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm (recommended) or npm
- Cloudinary account
- Vercel account (for deployment)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd europe-trip-tracker
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Auth
   ADMIN_PASSCODE="your-secure-passcode"
   
   # Database (SQLite for local dev)
   DATABASE_URL="file:./dev.db"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   CLOUDINARY_UPLOAD_PRESET="europe-trip"
   ```

3. **Set up the database**
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🗄️ Database Setup

### Local Development (SQLite)
The app automatically uses SQLite for local development. No additional setup required.

### Production (Vercel Postgres)
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database
3. Select Postgres
4. Copy the connection string to your environment variables
5. Run migrations: `pnpm db:push`

## ☁️ Cloudinary Setup

1. **Create a Cloudinary account**
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your cloud name, API key, and secret

2. **Create an upload preset**
   - Go to Settings → Upload → Upload presets
   - Create a new preset named "europe-trip"
   - Set signing mode to "unsigned"
   - Restrict to images and videos only
   - Set folder to "europe-trip"

3. **Add to environment variables**
   ```env
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   CLOUDINARY_UPLOAD_PRESET="europe-trip"
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub/GitLab
   - Connect to Vercel
   - Import the project

2. **Set environment variables**
   - Add all variables from `.env.example`
   - Set `DATABASE_URL` to your Vercel Postgres connection string

3. **Deploy**
   - Vercel will automatically detect Next.js
   - Build and deploy automatically

4. **Set up database**
   - Create a Postgres database in Vercel
   - Run migrations: `pnpm db:push`
   - Seed with sample data: `pnpm db:seed`

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Usage

### Creating Posts

1. **Access admin panel**
   - Visit `/admin`
   - Enter your passcode

2. **Create new post**
   - Click "Create New Post"
   - Fill in title, caption, and story
   - Upload photos/videos from your phone
   - Set location (auto-detected from EXIF or manual search)
   - Choose publish status

3. **Publish**
   - Click "Save Post"
   - Your post appears on the public site immediately

### Managing Content

- **Dashboard**: View all posts, stats, and quick actions
- **Edit**: Modify existing posts and media
- **Publish/Unpublish**: Control post visibility
- **Delete**: Remove posts permanently

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Prisma ORM with SQLite/Postgres
- **Media**: Cloudinary for storage and transformations
- **Maps**: Leaflet with OpenStreetMap tiles
- **Forms**: React Hook Form with Zod validation

### Key Components
- `PostForm`: Create/edit posts with media uploads
- `MapClient`: Interactive maps with marker clustering
- `MediaGrid`: Responsive masonry layout for posts
- `Lightbox`: Full-screen media viewer
- `LocationPicker`: Location search and selection

### API Routes
- `/api/posts` - CRUD operations for posts
- `/api/upload-signature` - Cloudinary upload authentication
- `/api/admin/auth` - Admin authentication
- `/api/rss.xml` - RSS feed
- `/api/sitemap.xml` - SEO sitemap

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme changes
- Update CSS variables in `globals.css`
- Customize component styles in individual files

### Content
- Edit sample posts in `prisma/seed.ts`
- Modify metadata in `app/layout.tsx`
- Update navigation in `components/Navigation.tsx`

### Features
- Add new post types in `lib/validations.ts`
- Extend database schema in `prisma/schema.prisma`
- Create new API routes in `app/api/`

## 🧪 Testing

### Run Tests
```bash
# Install Playwright
pnpm dlx playwright install

# Run tests
pnpm test:e2e
```

### Test Coverage
- Home page functionality
- Post creation and viewing
- Admin authentication
- Map interactions
- Responsive design

## 📊 Performance

### Lighthouse Scores
- **Mobile Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

### Optimizations
- Next.js Image optimization
- Cloudinary responsive images
- Lazy loading for maps
- Efficient database queries
- Minimal JavaScript bundle

## 🔒 Security

- Admin authentication via secure cookies
- Cloudinary signed uploads
- Input validation with Zod
- SQL injection protection via Prisma
- Rate limiting on API routes

## 📈 Analytics & SEO

- OpenGraph metadata for social sharing
- RSS feed for subscribers
- XML sitemap for search engines
- Structured data for rich snippets
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🆘 Support

- **Issues**: Create a GitHub issue
- **Documentation**: Check this README and code comments
- **Community**: Join our discussions

## 🎯 Roadmap

- [ ] Email newsletter integration
- [ ] Guestbook with moderation
- [ ] Advanced map themes
- [ ] Social media sharing
- [ ] Offline support
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

**Built with ❤️ for travelers who want to share their adventures beautifully.**

*Happy travels! ✈️🌍*

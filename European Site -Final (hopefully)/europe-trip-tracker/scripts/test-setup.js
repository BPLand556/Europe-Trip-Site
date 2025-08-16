#!/usr/bin/env node

console.log('🧪 Testing Europe Trip Tracker Setup...\n');

// Check if required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'prisma/schema.prisma',
  'app/page.tsx',
  'components/PostForm.tsx',
  'lib/db.ts',
  'lib/cloudinary.ts',
  '.env.example',
  'README.md'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('');

if (allFilesExist) {
  console.log('🎉 All required files are present!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy .env.example to .env.local and fill in your values');
  console.log('2. Run: pnpm install');
  console.log('3. Run: pnpm db:generate');
  console.log('4. Run: pnpm db:push');
  console.log('5. Run: pnpm db:seed');
  console.log('6. Run: pnpm dev');
  console.log('\n🌐 Then visit:');
  console.log('  - Public site: http://localhost:3000');
  console.log('  - Admin panel: http://localhost:3000/admin');
} else {
  console.log('❌ Some required files are missing. Please check the setup.');
  process.exit(1);
}

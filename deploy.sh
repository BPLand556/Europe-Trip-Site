#!/bin/bash

echo "🚀 Deploying Billy and Bobby's Travel Map to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Add all changes
    echo "📝 Adding changes to git..."
    git add .
    
    # Commit with timestamp
    echo "💾 Committing changes..."
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S') - Auto deployment"
    
    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    git push
    
    echo "✅ Deployment initiated!"
    echo "🌐 Your site will be available at: https://bpland556.github.io/Europe-Trip-Site/"
    echo "⏱️  Deployment usually takes 2-5 minutes to complete."
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi 
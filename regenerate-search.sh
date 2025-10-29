#!/bin/bash
# Script to regenerate search.json after adding new posts

echo "Building Jekyll site to regenerate search.json..."
cd /Users/davidhibbitts/Projects/dev-blog

# Build the site
bundle exec jekyll build

# Copy the generated search.json to assets
cp _site/assets/search.json assets/search.json

echo "Search.json regenerated successfully!"
echo "New posts should now appear in search results."
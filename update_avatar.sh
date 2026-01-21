#!/bin/bash
#
# This script automates updating the blog avatar image.
#
# Usage: ./update_avatar.sh /path/to/your/new_image.png
#

# --- Configuration ---
# The destination path for the blog avatar in your repository
DEST_IMAGE_PATH="assets/img/blog_image.png"
COMMIT_MESSAGE="Update blog avatar image"

# --- Script Logic ---

# Check if an image path was provided as an argument
if [ -z "$1" ]; then
  echo "❌ Error: No image path provided."
  echo "Usage: $0 /path/to/your/image.png"
  exit 1
fi

SOURCE_IMAGE_PATH=$1

# Check if the source image file exists
if [ ! -f "$SOURCE_IMAGE_PATH" ]; then
  echo "❌ Error: Source image not found at '$SOURCE_IMAGE_PATH'"
  exit 1
fi

echo "🚀 Starting avatar update process..."

# 1. Copy the new image to the assets folder
echo "1/5: Copying new image to '$DEST_IMAGE_PATH'..."
cp "$SOURCE_IMAGE_PATH" "$DEST_IMAGE_PATH"
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to copy image."
    exit 1
fi

# Verify that the new image is not empty
file_size=$(wc -c <"$DEST_IMAGE_PATH")
if [ "$file_size" -eq 0 ]; then
    echo "❌ Error: The new image is empty. Aborting."
    exit 1
fi
echo "✅ Image copied successfully."

# 2. Add the new image to Git staging
echo "2/5: Staging image with Git..."
git add "$DEST_IMAGE_PATH"
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to stage image with Git."
    exit 1
fi
echo "✅ Image staged."

# 3. Commit the change
echo "3/5: Committing changes..."
git commit -m "$COMMIT_MESSAGE"
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to commit changes."
    exit 1
fi
echo "✅ Changes committed."

# 4. Push to the remote repository
echo "4/5: Pushing to remote repository..."
git push
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to push to remote repository."
    exit 1
fi
echo "✅ Pushed to remote."

# 5. Regenerate the Jekyll site
echo "5/5: Regenerating Jekyll site..."
./regenerate-search.sh
if [ $? -ne 0 ]; then
    echo "❌ Error: Site regeneration failed."
    exit 1
fi

echo "🎉 Success! Your blog avatar has been updated and the site has been rebuilt."

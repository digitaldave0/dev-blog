#!/bin/bash

# Move to your repo directory
cd ~/path/to/digitaldave0/dev-blog || { echo "Repo not found"; exit 1; }

echo "🔍 Searching Git history for exposed Base64 Basic Auth credentials..."

# Search all commits for Authorization: Basic headers and decode possible credentials
git rev-list --all | while read commit; do
  git grep -I -n -a 'Authorization: Basic ' $commit | while read -r line; do
    # Extract the Base64 part
    base64str=$(echo "$line" | grep -o 'Authorization: Basic [A-Za-z0-9+/=]*' | awk '{print $3}')
    if [[ -n "$base64str" ]]; then
      decoded=$(echo "$base64str" | base64 --decode 2>/dev/null)
      if [[ "$decoded" == *:* ]]; then
        echo "⚠️  Commit: $commit"
        echo "    $line"
        echo "    Decoded: $decoded"
      fi
    fi
  done
done

echo "✅ Done. If results show up, note the file and commit."
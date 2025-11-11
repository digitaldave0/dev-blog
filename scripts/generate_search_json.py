import json
import os
from datetime import datetime

def generate_search_json():
    posts_dir = '_posts'
    search_data = []

    for filename in os.listdir(posts_dir):
        if filename.endswith('.md'):
            with open(os.path.join(posts_dir, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Basic front matter parsing
                try:
                    front_matter_str = content.split('---')[1]
                    lines = front_matter_str.strip().split('\n')
                    meta = {}
                    for line in lines:
                        if ':' in line:
                            key, value = line.split(':', 1)
                            meta[key.strip()] = value.strip().strip('"\'')

                    title = meta.get('title', 'No Title')
                    description = meta.get('description', '')
                    tags = meta.get('tags', '')
                    date_str = meta.get('date', filename[:10])
                    
                    # Format date
                    try:
                        date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                        formatted_date = date_obj.strftime('%B %d, %Y')
                    except ValueError:
                        formatted_date = date_str

                    # Generate URL from filename
                    url_slug = filename.replace('.md', '')
                    # Remove date from slug if present
                    parts = url_slug.split('-')
                    if len(parts) > 3:
                        try:
                            datetime.strptime('-'.join(parts[:3]), '%Y-%m-%d')
                            url_slug = '-'.join(parts[3:])
                        except ValueError:
                            pass # not a date
                    
                    post_url = f"/posts/{url_slug}/"

                    search_data.append({
                        'title': title,
                        'category': meta.get('category', ''),
                        'tags': tags,
                        'url': post_url,
                        'date': formatted_date,
                        'description': description
                    })
                except IndexError:
                    print(f"Skipping {filename}, could not parse front matter.")

    # Sort by date, most recent first
    search_data.sort(key=lambda x: datetime.strptime(x['date'], '%B %d, %Y'), reverse=True)

    os.makedirs('assets', exist_ok=True)
    with open('assets/search.json', 'w', encoding='utf-8') as f:
        json.dump(search_data, f, indent=2)

if __name__ == '__main__':
    generate_search_json()
    print("search.json generated successfully.")

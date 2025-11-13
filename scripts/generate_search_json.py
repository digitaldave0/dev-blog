#!/usr/bin/env python3
"""
Generate assets/search.json from posts in _posts/

This script reads markdown files in _posts, parses simple YAML front matter
(title, date, tags, description), and writes assets/search.json in the format
used by the site's search widget.

No external dependencies required.
"""
import json
import os
import re
from datetime import datetime


def parse_front_matter(text):
    # Extract content between the first pair of '---' markers
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.S)
    if not fm_match:
        return {}
    fm_text = fm_match.group(1)
    data = {}
    for line in fm_text.splitlines():
        if ':' not in line:
            continue
        key, val = line.split(':', 1)
        key = key.strip()
        val = val.strip().strip('"')
        data[key] = val
    return data


def slug_from_filename(filename):
    # filename like YYYY-MM-DD-slug.md -> slug
    name = os.path.splitext(filename)[0]
    parts = name.split('-')
    if len(parts) > 3 and re.match(r"^\d{4}$", parts[0]):
        return '-'.join(parts[3:])
    return name


def build_search_index(posts_dir="_posts", out_path="assets/search.json"):
    entries = []
    for fname in sorted(os.listdir(posts_dir)):
        if not fname.endswith('.md') and not fname.endswith('.markdown'):
            continue
        path = os.path.join(posts_dir, fname)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                text = f.read()
        except Exception:
            print(f"Skipping unreadable file: {path}")
            continue

        fm = parse_front_matter(text)
        title = fm.get('title') or fm.get('Title') or ''
        date = fm.get('date') or fm.get('Date') or ''
        tags = fm.get('tags') or fm.get('tag') or fm.get('tags') or ''
        description = fm.get('description') or fm.get('excerpt') or ''

        # If no description, grab first non-empty paragraph after front matter
        if not description:
            body = re.split(r"^---\s*\n.*?\n---\s*\n", text, flags=re.S)
            if len(body) > 1:
                # find first paragraph
                paragraphs = [p.strip() for p in body[1].split('\n\n') if p.strip()]
                if paragraphs:
                    description = paragraphs[0][:160]

        slug = slug_from_filename(fname)
        url = f"/posts/{slug}/"

        # Normalize date to readable form if possible
        formatted_date = date
        try:
            parsed = datetime.fromisoformat(date)
            formatted_date = parsed.strftime('%B %d, %Y')
        except Exception:
            # try YYYY-MM-DD
            try:
                parsed = datetime.strptime(date, '%Y-%m-%d')
                formatted_date = parsed.strftime('%B %d, %Y')
            except Exception:
                pass

        entries.append({
            'title': title,
            'category': fm.get('category', ''),
            'tags': tags,
            'url': url,
            'date': formatted_date,
            'description': description,
        })

    # sort by date (newest first) when date parseable, otherwise keep as-is
    def sort_key(e):
        try:
            return datetime.strptime(e['date'], '%B %d, %Y')
        except Exception:
            return datetime.min

    entries.sort(key=sort_key, reverse=True)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(entries)} entries to {out_path}")


if __name__ == '__main__':
    build_search_index()

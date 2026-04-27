---
pubDate: 2025-06-15T00:00:00.000Z
title: "\U0001F680 How I Use Obsidian Git to Automate My Blog Publishing"
description: >-
  A simple guide to setting up Git in Obsidian so you can publish Markdown posts
  directly to GitHub Pages — fast, clean, and code-free.
tags:
  - devops
heroImage: 'https://picsum.photos/seed/2025-06-15-using-obsidian-git/800/400'
---

Writing blog posts in Markdown is great. But what if you could **write, version, and publish** your posts to GitHub Pages — without switching apps or running Git commands?

That’s exactly what I’ve done using the **Obsidian Git plugin**.

Here’s how I set it up in less than 5 minutes.

---

## 🧱 Prerequisites

Before you begin, make sure you have:

- [ ] Git installed on your system
- [ ] A GitHub repository set up for your blog (I use [Jekyll + GitHub Pages](https://jekyllrb.com/))
- [ ] Your Obsidian vault pointing at your blog repo (e.g., `_posts/`, `_config.yml`, etc.)

---

## 📦 Step 1: Install the Git Plugin

1. Open Obsidian  
2. Go to **Settings → Community Plugins**  
3. Disable safe mode, then click **Browse**  
4. Search for **“Git”** (by Denis Olehov)  
5. Click **Install**, then **Enable**

---

## ⚙️ Step 2: Configure the Plugin

Once enabled, go to **Settings → Git** and tweak these options:

| Setting                        | Value                         |
|-------------------------------|-------------------------------|
| ✅ Auto pull on vault open    | **Enabled**                   |
| ⏱ Auto commit & push         | Leave **disabled** (optional) |
| 📝 Commit message template    | `Blog update on {date}`     |
| 🔄 Manual sync (preferred)    | Use `Cmd + P → Git: ...`      |

This gives you full control over what gets committed and when your blog goes live.

---

## ✍️ Step 3: Write and Publish

Now your flow is simple:

1. Create or edit a Markdown post in `_posts/`
2. Save changes
3. Open the command palette (`Cmd + P`)
4. Run:
   - `Git: Commit all changes`
   - `Git: Push`

Your Markdown is committed, pushed, and live on GitHub Pages within seconds.

---

## 🧪 Bonus Tips

- Add a `.gitignore` to avoid pushing workspace or plugin settings
- You can also **auto commit on save** if you're comfortable with frequent syncing
- Want to preview your site? Use `jekyll serve` locally or just trust the GitHub Pages rebuild

---

## Final Thoughts

Using Obsidian Git turns your vault into a **fully working static site editor** — no terminal needed. Perfect for developer blogs, tech journals, or any writing workflow you want to back with version control and instant publishing.

Let me know if you’d like my `.gitignore`, or a starter blog post template!

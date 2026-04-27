---
pubDate: 2025-06-15T00:00:00.000Z
title: How I Built This Blog with GitHub Pages & Jekyll
description: 'A quick guide to how I set up my blog using GitHub Pages, Jekyll, and is-a.dev'
tags:
  - devops
---

Setting up this blog was simpler than you’d think — and **completely free**. Here’s how I did it:

## 🍥 The Stack
- **GitHub Pages** for free static hosting  
- **Jekyll** (via [jekyll-now](https://github.com/barryclark/jekyll-now))  
- **Markdown** for writing posts  
- **Custom domain** via [is-a.dev](https://is-a.dev)

## 🗺️ Step-by-Step Setup
1. **Forked a Jekyll template repo**  
   Used [barryclark/jekyll-now](https://github.com/barryclark/jekyll-now)
2. **Renamed the repo** to `dev-blog`
3. **Enabled GitHub Pages** under Settings → Pages
4. **Edited `_config.yml`** for name, description, links
5. **Created this post** using Markdown in `_posts/`

3. **Wait for the PR to be approved and merged.**  
→ The subdomain will then point to your GitHub Pages site.

---

## 🔒 Enabling HTTPS/SSL

After your CNAME is active:

1. Go to **Settings > Pages** in your repo.
2. Scroll to **Custom domain** and make sure `davedevops.is-a.dev` is filled in.
3. Check the box for **"Enforce HTTPS"**.

GitHub will issue a free SSL certificate (via Let's Encrypt), and HTTPS should activate within minutes.

---

## ✅ Done!

Now you have:
- A personal blog
- Running on GitHub Pages
- With your own domain
- Fully secured with HTTPS
- And easily extensible with Markdown

🧠 Next up: Adding more posts and customizing styles!

---

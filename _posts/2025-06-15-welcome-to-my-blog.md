layout: post
title: "How I Built This Blog with GitHub Pages & Jekyll"
description: A quick guide to how I set up my blog using GitHub Pages, Jekyll, and is-a.dev
---

## ⚙️ How I Set Up This Blog Using GitHub Pages & Jekyll

Setting up this blog was simpler than you'd think — and **completely free**. Here's how I did it:

### 🧱 The Stack
- **GitHub Pages** for free static hosting
- **Jekyll** (via [`jekyll-now`](https://github.com/barryclark/jekyll-now)) for simple blog templating
- **Markdown** for writing posts
- **Custom domain** via [is-a.dev](https://github.com/is-a-dev/register)

---

### 🪜 Step-by-Step Setup

1. **Forked a Jekyll template repo**  
   I used [barryclark/jekyll-now](https://github.com/barryclark/jekyll-now) — it’s clean, simple, and requires no local Ruby setup.

2. **Renamed my fork to `dev-blog`**  
   This helped me distinguish it from my resume site.

3. **Edited `_config.yml`**  
   I updated:
   - Blog title and description
   - Footer links (email, GitHub, LinkedIn)
   - Theme (I chose `slate` for minimal, readable design)

4. **Published via GitHub Pages**  
   Under the GitHub repo settings → Pages, I selected:
   ```
   Source: main branch /root
   ```

5. **Linked it to a custom domain**  
   I added `davedevops.is-a.dev` via a simple pull request to [`is-a-dev/register`](https://github.com/is-a-dev/register). Their community is awesome.

6. **Created this post** in `_posts/{today}-github-blog-setup.md` using frontmatter and markdown.

---

### 🔧 Bonus: Live Preview with Just Markdown

No local dev setup needed. Once I committed the `.md` file, GitHub Pages rebuilt the site automatically.

---

Want to do this too? [Here’s a full guide you can follow](https://github.com/barryclark/jekyll-now). Or just fork my [blog repo](https://github.com/digitaldave0/dev-blog) and start writing!

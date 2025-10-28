---
layout: post
title: "🚀 Migrating from GitHub Pages to Netlify: A Step-by-Step Guide"
date: 2025-07-01
categories: [DevOps, Web Development, Tutorial]
description: "Learn how to migrate a Jekyll blog from GitHub Pages to Netlify, including DNS configuration and continuous deployment setup."
excerpt: "A complete guide to moving your Jekyll blog from GitHub Pages to Netlify, with tips for DNS configuration, deployment settings, and maintaining your blog's functionality."
---


# Migrating from GitHub Pages to Netlify: A Step-by-Step Guide

Moving a Jekyll blog from GitHub Pages to Netlify is surprisingly straightforward. Here's how to do it while maintaining all functionality and improving your deployment options.

## Why Netlify?

- **Better Build Options**: More control over build environment and dependencies
- **Deploy Previews**: Every PR gets a preview deployment
- **Branch Deploys**: Test changes in isolation
- **Better CDN**: Global edge network with instant cache invalidation
- **Form Handling**: Built-in form processing
- **Custom Functions**: Serverless functions support
- **Split Testing**: Easy A/B testing

## Migration Steps

### 1. Prepare Your Repository

No changes needed to the repository structure! Netlify understands Jekyll projects out of the box.

### 2. Sign Up for Netlify

1. Go to [Netlify](https://www.netlify.com)
2. Sign up with your GitHub account
3. Click "New site from Git"
4. Select your blog repository

### 3. Configure Build Settings

Use these build settings:

```toml
[build]
  command = "jekyll build"
  publish = "_site"

[build.environment]
  JEKYLL_ENV = "production"
  RUBY_VERSION = "3.0.0"
```

### 4. DNS Configuration

#### Option 1: Using Netlify DNS (Recommended)
1. Add your domain in Netlify settings
2. Update nameservers at your registrar
3. Netlify handles SSL automatically

#### Option 2: Using External DNS
1. Add domain in Netlify
2. Create CNAME record pointing to your Netlify site
3. Wait for SSL provisioning

### 5. Update Repository Settings

1. Remove GitHub Pages settings
2. Update any GitHub Actions workflows
3. Keep your repository public (or use Netlify Teams plan)

### 6. Content Migration Checklist

- [ ] Verify all posts render correctly
- [ ] Check all internal links
- [ ] Test code syntax highlighting
- [ ] Verify images and assets
- [ ] Test any custom plugins
- [ ] Check RSS feed
- [ ] Verify sitemap

### 7. Netlify-Specific Features to Add

#### Form Handling
```html
<form name="contact" netlify>
  <input type="text" name="name">
  <input type="email" name="email">
  <button type="submit">Send</button>
</form>
```

#### Redirects
```toml
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

#### Headers
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### 8. Performance Optimizations

Netlify offers several performance features:

1. **Asset Optimization**:
```toml
[build.processing]
  skip_processing = false
[build.processing.css]
  bundle = true
  minify = true
[build.processing.js]
  bundle = true
  minify = true
[build.processing.images]
  compress = true
```

2. **Cache Control**:
```toml
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

## Specific Changes for Our Blog

### 1. Update Config File
Current `_config.yml` changes needed:

```yaml
# Remove
remote_theme: pages-themes/slate@v0.2.0

# Add if needed
theme: slate
```

### 2. Dependencies
Create a `Gemfile` if you don't have one:

```ruby
source "https://rubygems.org"

gem "jekyll"
gem "jekyll-sitemap"
gem "jekyll-feed"
gem "jekyll-seo-tag"
```

### 3. Build Script
Create `netlify.sh`:

```bash
#!/bin/bash
bundle install
bundle exec jekyll build
```

### 4. Environment Variables
Set these in Netlify:
- `JEKYLL_ENV=production`
- `RUBY_VERSION=3.0.0`

## Post-Migration Tasks

1. **Test Everything**:
   ```bash
   bundle exec jekyll serve
   ```

2. **Update DNS**:
   - Point domain to Netlify
   - Wait for SSL certificate

3. **Set Up Redirects**:
   - Add 404 page handling
   - Redirect old URLs if needed

4. **Enable Features**:
   - Asset optimization
   - Form handling
   - Deploy previews

## Benefits You'll Get

1. **Better Deployment**:
   - Deploy previews for PRs
   - Branch deploys
   - Easy rollbacks

2. **Performance**:
   - Global CDN
   - Asset optimization
   - Better caching

3. **Additional Features**:
   - Form handling
   - Serverless functions
   - Split testing
   - Analytics

## Conclusion

Migrating to Netlify gives you more control and features while maintaining the simplicity of GitHub-based workflows. The process is straightforward, and the benefits are worth the small effort required.

Remember to:
- Test thoroughly before switching DNS
- Use Netlify's deploy previews
- Take advantage of the new features
- Monitor your site after migration

## Resources

- [Netlify Docs](https://docs.netlify.com)
- [Jekyll on Netlify](https://www.netlify.com/blog/2020/04/02/a-step-by-step-guide-jekyll-4.0-on-netlify/)
- [Netlify CLI](https://cli.netlify.com)
- [Netlify Forms](https://docs.netlify.com/forms/setup/)

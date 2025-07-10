---
layout: post
title: "🎮 Creating a Retro-Style Scrolling Header in Jekyll"
description: "Learn how to implement a classic 8-bit style scrolling header animation using CSS"
excerpt: "A step-by-step guide on creating a retro gaming-inspired scrolling header animation for your Jekyll blog using pure CSS and the Press Start 2P font."
---

<style>
pre, code {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
}
pre {
    padding: 15px !important;
    border-radius: 5px !important;
    border: 1px solid #444 !important;
}
code {
    padding: 2px 5px !important;
    border-radius: 3px !important;
}
</style>

Have you ever wanted to add that classic arcade game feel to your website? Today, I'll show you how I implemented the retro-style scrolling header on this blog using pure CSS animations.

## The Final Result

The header you see at the top of this blog features:
- Smooth scrolling animation
- Retro pixel font (Press Start 2P)
- Neon glow effect
- Responsive design

## Implementation Steps

### 1. Add the Pixel Font
First, we need to import the "Press Start 2P" font from Google Fonts:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap">
```

### 2. Create the HTML Structure
We need a container structure for our scrolling text:

```html
<div class="title-container">
  <div class="marquee">
    <div class="marquee-content">
      <span class="site-name">Dave's Dev Blog</span>
      <span class="site-description">🚀 DevOps, AI and notes worth documenting.</span>
    </div>
  </div>
</div>
```

### 3. Add the CSS Magic
Here's the CSS that makes it all work:

```css
.title-container {
  width: 100%;
  overflow: hidden;
  margin: 20px 0;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px 0;
}

.marquee {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: marquee 12s linear infinite;
  padding-left: 100%;
  width: max-content;
}

.site-name, .site-description {
  font-family: 'Press Start 2P', monospace;
  color: #fff;
  display: inline-block;
}

.site-name {
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(0, 170, 255, 0.7);
}

.site-description {
  font-size: 0.9rem;
  margin-left: 50px;
  text-shadow: 0 0 5px rgba(0, 170, 255, 0.5);
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
```

### 4. Making it Responsive
Add media queries to adjust the font size on smaller screens:

```css
@media (max-width: 768px) {
  .site-name {
    font-size: 1.4rem;
  }
  .site-description {
    font-size: 0.8rem;
  }
}
```

## How It Works

1. The `title-container` creates a wrapper with a slight background
2. The `marquee` class handles the overflow and positioning
3. The `marquee-content` contains our text and handles the animation
4. The animation moves the text from right to left using CSS transform
5. The text-shadow creates a neon glow effect
6. The Press Start 2P font gives us that perfect retro pixel look

## Key Features

- **Infinite Loop**: The animation repeats indefinitely
- **Smooth Scrolling**: 12-second duration for smooth movement
- **Responsive**: Adjusts font size for different screen sizes
- **Neon Effect**: Text shadow creates a subtle glow
- **No JavaScript**: Pure CSS implementation

## Browser Compatibility

This implementation works in all modern browsers that support CSS animations. The Press Start 2P font fallbacks to monospace if not available.

## Conclusion

With just a bit of CSS, we've created a nostalgic, retro-gaming inspired header that adds character to the blog while maintaining readability and responsiveness.

Want to see more posts like this? Let me know in the comments!

---
Thanks for reading! Dave🎮
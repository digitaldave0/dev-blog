/**
 * Custom logic for David Hibbitts' Dev Blog
 * Focused on core functionality: Home navigation and Code Copying.
 */

document.addEventListener('DOMContentLoaded', function() {
  const baseUrl = window.location.origin;

  // 1. Home Navigation Logic
  const navHome = document.querySelectorAll('.site-title, .avatar img, .nav-link[href="/"]');
  navHome.forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') {
        window.location.href = baseUrl;
      }
    });
  });

  // 2. Premium Code Copy Functionality
  initializeCodeCopy();
});

/**
 * Initializes copy buttons for all code blocks
 */
function initializeCodeCopy() {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach((block) => {
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn';
    copyButton.innerHTML = 'Copy';
    copyButton.setAttribute('aria-label', 'Copy code');

    // Simple position styling for the button
    Object.assign(copyButton.style, {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      borderRadius: '4px',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer',
      opacity: '0.6',
      transition: 'opacity 0.2s'
    });

    copyButton.addEventListener('mouseenter', () => copyButton.style.opacity = '1');
    copyButton.addEventListener('mouseleave', () => copyButton.style.opacity = '0.6');

    // Add click handler
    copyButton.addEventListener('click', async () => {
      const code = block.querySelector('code') || block;
      const text = code.innerText;

      try {
        await navigator.clipboard.writeText(text);
        copyButton.innerText = 'Copied!';
        setTimeout(() => copyButton.innerText = 'Copy', 2000);
      } catch (err) {
        copyButton.innerText = 'Error';
      }
    });

    // Ensure block is relative for positioning
    block.style.position = 'relative';
    block.appendChild(copyButton);
  });
}

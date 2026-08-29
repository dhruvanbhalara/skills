const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItFrontMatter = require('markdown-it-front-matter');
const yaml = require('yaml');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(markdownItAnchor)
  .use(markdownItFrontMatter, () => { });

const SKILLS_DIR = path.join(__dirname, '../skills');
const OUTPUT_DIR = path.join(__dirname, '../_site');
const SITE_URL = 'https://dhruvanbhalara.github.io/skills';

// Helper to capitalize IDs and strings cleanly
function toTitleCase(str) {
  if (!str) return '';
  return str
    .split('-')
    .map(word => {
      const lower = word.toLowerCase();
      if (lower === 'cli') return 'CLI';
      if (lower === 'api') return 'API';
      if (lower === 'ui') return 'UI';
      if (lower === 'json') return 'JSON';
      if (lower === 'spm') return 'SPM';
      if (lower === 'wasm') return 'WASM';
      if (lower === 'dio') return 'Dio';
      if (lower === 'isar') return 'Isar';
      if (lower === 'bloc') return 'BLoC';
      if (lower === 'pr') return 'PR';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function getBaseStyles() {
  return `
    :root {
      --color-void: #000000;
      --color-bone-white: #ffffff;
      --color-ash-gray: #9a9a9a;
      --color-silver-mist: #bdbdbd;
      --color-electric-iris: #8052ff;
      --color-electric-iris-glow: rgba(128, 82, 255, 0.25);
      --color-saffron-spark: #ffb829;
      --color-deep-verdant: #15846e;
      --color-surface-subtle: rgba(255, 255, 255, 0.03);
      --color-border-subtle: rgba(255, 255, 255, 0.08);
      --color-border-hover: rgba(128, 82, 255, 0.4);
      --color-code-bg: rgba(255, 255, 255, 0.02);
      --max-width: 1240px;

      --bg: var(--color-void);
      --text: var(--color-bone-white);
      --text-muted: var(--color-ash-gray);
      --text-secondary: var(--color-silver-mist);
      --primary: var(--color-electric-iris);
      --primary-glow: var(--color-electric-iris-glow);
      --card-bg: var(--color-surface-subtle);
      --border: var(--color-border-subtle);
      --border-hover: var(--color-border-hover);
      --nav-bg: rgba(0, 0, 0, 0.7);
      --code-bg: var(--color-code-bg);
      --badge-bg: rgba(255, 255, 255, 0.06);

      --radius-card: 24px;
      --radius-install: 20px;
      --radius-pill: 9999px;
      --radius-code: 16px;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    [data-theme="light"] {
      --color-void: #ffffff;
      --color-bone-white: #0a0a0c;
      --color-ash-gray: #666666;
      --color-silver-mist: #444444;
      --color-surface-subtle: rgba(0, 0, 0, 0.03);
      --color-border-subtle: rgba(0, 0, 0, 0.08);
      --color-code-bg: rgba(0, 0, 0, 0.03);

      --bg: var(--color-void);
      --text: var(--color-bone-white);
      --text-muted: var(--color-ash-gray);
      --text-secondary: var(--color-silver-mist);
      --card-bg: var(--color-surface-subtle);
      --border: var(--color-border-subtle);
      --nav-bg: rgba(255, 255, 255, 0.85);
      --code-bg: var(--color-code-bg);
      --badge-bg: rgba(0, 0, 0, 0.05);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.15s; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-weight: 200;
      line-height: 1.65;
      padding-top: 72px;
      -webkit-font-smoothing: antialiased;
    }

    nav {
      position: fixed; top: 0; left: 0; width: 100%; height: 72px;
      background: var(--nav-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 1000;
      border-bottom: 1px solid var(--border);
    }
    .nav-content {
      max-width: var(--max-width);
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text);
      text-decoration: none;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .logo-glyph {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 10px var(--primary-glow);
      display: inline-block;
    }
    .logo-text { color: var(--text); }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 0.9rem; }
    .nav-links a:hover { color: var(--text); }
    .theme-btn {
      background: transparent; border: none; color: var(--text);
      cursor: pointer; font-size: 1.1rem; padding: 0.4rem;
      border-radius: var(--radius-pill); display: flex; align-items: center; justify-content: center;
    }
    .theme-btn:hover { background: var(--badge-bg); }
    .theme-btn:active { transform: scale(0.96); }

    header {
      padding: 4rem 2rem 3rem;
      max-width: var(--max-width);
      margin: 0 auto;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3rem;
      align-items: center;
    }
    .hero-text {
      display: flex;
      flex-direction: column;
    }
    .hero-badge {
      display: inline-block;
      align-self: flex-start;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-saffron-spark);
      background: rgba(255, 184, 41, 0.1);
      border: 1px solid rgba(255, 184, 41, 0.25);
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-pill);
      margin-bottom: 1.25rem;
    }
    .hero-visual {
      position: relative;
      width: 100%;
      height: 280px;
      border-radius: var(--radius-card);
      overflow: hidden;
      background: var(--card-bg);
      border: 1px solid var(--border);
    }
    #constellation-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    h1 {
      font-size: 3rem;
      font-weight: 800;
      letter-spacing: -1.5px;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, var(--text) 0%, var(--text-muted) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 1.2rem;
      color: var(--text-muted);
      max-width: 600px;
      line-height: 1.6;
      font-weight: 300;
    }

    .install-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-install);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto 2.5rem;
      max-width: var(--max-width);
      min-height: 72px;
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--text);
    }
    .install-box span { opacity: 0.9; }
    .install-box button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.6rem 1.25rem;
      border-radius: var(--radius-pill);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      cursor: pointer;
      font-family: var(--font-body);
      transition: opacity 0.2s ease, transform 0.15s ease;
    }
    .install-box button:hover { opacity: 0.9; }
    .install-box button:active { transform: scale(0.96); }

    main { max-width: var(--max-width); margin: 0 auto; padding: 2rem 0; }

    .section-title {
      max-width: var(--max-width);
      margin: 0 auto 1.5rem;
      padding: 0 2rem;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--text-muted);
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      max-width: var(--max-width);
      margin: 0 auto 4rem;
      padding: 0 2rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      padding: 1.75rem;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
    }
    .card:hover {
      transform: translateY(-3px);
      border-color: var(--border-hover);
      box-shadow: 0 12px 30px rgba(128, 82, 255, 0.08);
    }
    .card:active {
      transform: scale(0.96);
    }
    .card h3 { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 1rem; color: var(--text); }
    .card p { font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem; flex-grow: 1; font-weight: 300; }
    .view-btn { font-size: 0.7rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }

    /* Badges */
    .badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .badge {
      font-size: 0.7rem;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-pill);
      background: var(--badge-bg);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid var(--border);
    }
    .badge.platform[data-platform="flutter"] { border-color: rgba(21, 132, 110, 0.4); color: var(--color-deep-verdant); }
    .badge.platform[data-platform="dart"] { border-color: rgba(128, 82, 255, 0.4); color: var(--color-electric-iris); }
    .badge.category { background: rgba(255, 184, 41, 0.1); color: var(--color-saffron-spark); border-color: rgba(255, 184, 41, 0.25); }

    /* Filters */
    .filter-container {
      max-width: var(--max-width);
      margin: 0 auto 1.5rem;
      padding: 0 2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .filter-btn {
      background: transparent;
      border: 1px solid var(--border);
      padding: 0.5rem 1.1rem;
      border-radius: var(--radius-pill);
      color: var(--text-muted);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      cursor: pointer;
      letter-spacing: 0.5px;
      transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease, transform 0.15s ease;
    }
    .filter-btn:hover { background: var(--badge-bg); color: var(--text); }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .filter-btn:active { transform: scale(0.96); }

    /* Search Bar */
    .search-container {
      max-width: var(--max-width);
      margin: 0 auto 2rem;
      padding: 0 2rem;
    }
    #search-input {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 1rem 1.5rem;
      border-radius: var(--radius-install);
      color: var(--text);
      font-family: inherit;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    #search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }

    /* Empty Search State */
    #empty-state {
      display: none;
      padding: 5rem 2rem;
      text-align: center;
      color: var(--text-secondary);
    }
    #empty-state h4 {
      font-size: 1.5rem;
      font-weight: 400;
      color: var(--text);
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    /* Markdown Styles */
    .markdown-body { max-width: var(--max-width); margin: 0 auto; padding-bottom: 6rem; }
    .markdown-body h1 { text-align: left; font-size: 2rem; color: var(--text); margin-top: 1.5rem; margin-bottom: 2rem; letter-spacing: -0.8px; text-transform: uppercase; line-height: 1.2; font-weight: 800; }
    .markdown-body h2 { font-size: 1.3rem; margin: 3.5rem 0 1.25rem; letter-spacing: -0.5px; text-transform: uppercase; font-weight: 800; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
    .markdown-body h3 { font-size: 1.05rem; margin: 2.5rem 0 1rem; text-transform: uppercase; font-weight: 700; color: var(--text-secondary); }
    .markdown-body h4 { font-size: 0.95rem; margin: 2rem 0 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); }
    .markdown-body p { margin-bottom: 1.5rem; font-size: 1rem; color: var(--text-secondary); line-height: 1.75; font-weight: 300; }
    .markdown-body ul, .markdown-body ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
    .markdown-body li { margin-bottom: 0.75rem; color: var(--text-secondary); font-size: 0.95rem; font-weight: 300; }

    .markdown-body pre {
      background: var(--code-bg) !important;
      padding: 1.75rem;
      border-radius: var(--radius-code);
      margin: 2rem 0;
      position: relative;
      overflow-x: auto;
      border: 1px solid var(--border);
    }
    .markdown-body code {
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }

    .article-section {
      margin-top: 5rem;
      padding-top: 4rem;
      border-top: 1px solid var(--border);
    }

    .copy-btn {
      position: absolute; top: 1rem; right: 1rem;
      background: var(--badge-bg);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.15s ease;
    }
    pre:hover .copy-btn { opacity: 1; }
    .copy-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }
    .copy-btn:active { transform: scale(0.96); }

    .breadcrumb {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 2rem;
      color: var(--text-muted);
    }
    .breadcrumb a { color: var(--text); text-decoration: none; }
    .breadcrumb a:hover { color: var(--primary); }

    @media (max-width: 960px) {
      .hero-grid { grid-template-columns: 1fr; gap: 2rem; }
      .hero-visual { height: 200px; }
      .card-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      h1 { font-size: 2.2rem; }
      header { padding-top: 3rem; }
      .card-grid { grid-template-columns: 1fr; }
      .install-box { flex-direction: column; gap: 1rem; text-align: center; padding: 1.5rem; height: auto; }
      .install-box button { margin-left: 0; width: 100%; }
    }
  `;
}

function getThemeScript() {
  return `
    (function() {
      function suppressTransitions() {
        const css = document.createElement('style');
        css.type = 'text/css';
        css.appendChild(document.createTextNode('* { transition: none !important; }'));
        document.head.appendChild(css);
        return () => {
          window.getComputedStyle(css).opacity;
          document.head.removeChild(css);
        };
      }

      function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.getElementById('theme-icon');
        if (icon) icon.innerText = theme === 'dark' ? '🌙' : '☀️';
      }

      const savedTheme = localStorage.getItem('theme') || 'dark';
      applyTheme(savedTheme);

      window.toggleTheme = function() {
        const restore = suppressTransitions();
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
        requestAnimationFrame(() => restore());
      };

      // Sync theme on back/forward navigation
      window.addEventListener('pageshow', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme);
      });

      window.addEventListener('DOMContentLoaded', () => {
        applyTheme(localStorage.getItem('theme') || 'dark');

        if (typeof hljs !== 'undefined') hljs.highlightAll();

        // Code block copy buttons
        document.querySelectorAll('pre').forEach(block => {
          const button = document.createElement('button');
          button.className = 'copy-btn';
          button.innerText = 'Copy';
          button.addEventListener('click', () => {
            const codeBlock = block.querySelector('code');
            if (!codeBlock) return;
            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
              button.innerText = 'Copied!';
              button.style.borderColor = 'var(--color-electric-iris)';
              setTimeout(() => {
                button.innerText = 'Copy';
                button.style.borderColor = '';
              }, 2000);
            });
          });
          block.appendChild(button);
        });

        // Search & Filter
        const searchInput = document.getElementById('search-input');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const emptyState = document.getElementById('empty-state');
        let activeCategory = 'all';

        function updateVisibility() {
          const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
          const cards = document.querySelectorAll('.card');
          let visibleCount = 0;

          cards.forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const desc = (card.getAttribute('data-desc') || '').toLowerCase();
            const platforms = (card.getAttribute('data-platforms') || '').toLowerCase();
            const category = (card.getAttribute('data-category') || '').toLowerCase();

            const matchesSearch = !query || title.includes(query) || desc.includes(query) || platforms.includes(query) || category.includes(query);
            const matchesCategory = activeCategory === 'all' ||
              platforms.includes(activeCategory) ||
              category.includes(activeCategory) ||
              (activeCategory === 'github' && (platforms.includes('git') || category.includes('git')));

            if (matchesSearch && matchesCategory) {
              card.style.display = 'flex';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          });

          if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
          }
        }

        if (searchInput) {
          searchInput.addEventListener('input', updateVisibility);
          // Global shortcut '/' to search
          window.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput) {
              const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
              if (activeTag !== 'input' && activeTag !== 'textarea' && !document.activeElement.isContentEditable) {
                e.preventDefault();
                searchInput.focus();
              }
            }
          });
        }

        filterBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category') || btn.getAttribute('data-platform') || 'all';
            updateVisibility();
          });
        });

        // Hero Constellation Particle Canvas
        const canvas = document.getElementById('constellation-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          let width = (canvas.width = canvas.offsetWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : 300));
          let height = (canvas.height = canvas.offsetHeight || (canvas.parentElement ? canvas.parentElement.clientHeight : 300));

          const colors = ['#8052ff', '#ffb829', '#15846e', '#60a5fa', '#f472b6'];
          const particleCount = 38;
          const particles = [];

          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4,
              size: Math.random() * 4 + 2,
              color: colors[Math.floor(Math.random() * colors.length)],
              angle: Math.random() * Math.PI * 2,
              va: (Math.random() - 0.5) * 0.02
            });
          }

          function drawTriangle(x, y, size, angle, color) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.86, size * 0.5);
            ctx.lineTo(-size * 0.86, size * 0.5);
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
          }

          let animId;
          function render() {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles with subtle lines
            for (let i = 0; i < particles.length; i++) {
              for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                  ctx.beginPath();
                  ctx.moveTo(particles[i].x, particles[i].y);
                  ctx.lineTo(particles[j].x, particles[j].y);
                  ctx.strokeStyle = 'rgba(128, 82, 255, ' + ((1 - dist / 90) * 0.25) + ')';
                  ctx.lineWidth = 0.8;
                  ctx.stroke();
                }
              }
            }

            // Draw and update particles
            for (const p of particles) {
              p.x += p.vx;
              p.y += p.vy;
              p.angle += p.va;
              if (p.x < 0) p.x = width;
              if (p.x > width) p.x = 0;
              if (p.y < 0) p.y = height;
              if (p.y > height) p.y = 0;

              drawTriangle(p.x, p.y, p.size, p.angle, p.color);
            }
            animId = requestAnimationFrame(render);
          }

          render();

          window.addEventListener('resize', () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : 300);
            height = canvas.height = canvas.offsetHeight || (canvas.parentElement ? canvas.parentElement.clientHeight : 300);
          });
        }
      });
    })();
  `;
}

function getMetaTags(title, description, path = '') {
  const url = `${SITE_URL}/${path}`;
  return `
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
  `;
}

function generateIndexPage(skills) {
  const title = "Agent Skills Library: The Directory for AI Agents";
  const description = "Documentation library for professional coding agent skills. Built for Antigravity, Copilot, and Cursor.";

  const flutterCount = skills.filter(s =>
    (s.platforms || []).some(p => p.toLowerCase() === 'flutter') ||
    (s.languages || []).some(l => l.toLowerCase() === 'flutter')
  ).length;

  const dartCount = skills.filter(s =>
    (s.platforms || []).some(p => p.toLowerCase() === 'dart') ||
    (s.languages || []).some(l => l.toLowerCase() === 'dart')
  ).length;

  const githubCount = skills.filter(s =>
    (s.platforms || []).some(p => p.toLowerCase() === 'github' || p.toLowerCase() === 'git') ||
    (s.category || '').toLowerCase().includes('github') ||
    s.id.startsWith('github') || s.id.startsWith('git')
  ).length;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    ${getMetaTags(title, description)}
    <style>${getBaseStyles()}</style>
    <script>${getThemeScript()}</script>
</head>
<body>
    <nav>
        <div class="nav-content">
            <a href="/" class="logo">
                <span class="logo-glyph"></span>
                <span class="logo-text">Agent Skills</span>
            </a>
            <div class="nav-links">
                <button class="theme-btn" onclick="toggleTheme()" id="theme-icon" aria-label="Toggle theme">🌙</button>
                <a href="https://github.com/dhruvanbhalara/skills" target="_blank" rel="noopener">GITHUB</a>
            </div>
        </div>
    </nav>

    <header>
        <div class="hero-grid">
            <div class="hero-text">
                <span class="hero-badge">${skills.length} Specialized Coding Agent Skills</span>
                <h1>Agent Skills</h1>
                <div class="subtitle">Curated engineering standards and workflows for AI agents.</div>
                <div class="install-box">
                    <span>npx skills add dhruvanbhalara/skills</span>
                    <button onclick="navigator.clipboard.writeText('npx skills add dhruvanbhalara/skills').then(() => { this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000); })">Copy</button>
                </div>
            </div>
            <div class="hero-visual">
                <canvas id="constellation-canvas"></canvas>
            </div>
        </div>
    </header>

    <div class="search-container">
        <input type="text" id="search-input" placeholder="Search ${skills.length} skills (e.g. 'bloc', 'testing', 'git')... [/ to focus]">
    </div>

    <div class="filter-container">
        <button class="filter-btn active" data-platform="all">All (${skills.length})</button>
        <button class="filter-btn" data-platform="flutter">Flutter (${flutterCount})</button>
        <button class="filter-btn" data-platform="dart">Dart (${dartCount})</button>
        <button class="filter-btn" data-platform="github">GitHub (${githubCount})</button>
    </div>

    <main>
        <div class="card-grid">
            ${skills.map(skill => `
                <a href="${skill.id}.html" class="card"
                   data-title="${skill.title}"
                   data-desc="${skill.description}"
                   data-platforms="${[...(skill.platforms || []), ...(skill.languages || [])].join(',')}"
                   data-category="${skill.category || ''}">
                    <div class="badges">
                        ${(skill.platforms || []).map(p => `<span class="badge platform" data-platform="${p.toLowerCase()}">${p}</span>`).join('')}
                        <span class="badge category">${skill.category || 'general'}</span>
                    </div>
                    <h3>${skill.title}</h3>
                    <p>${skill.description}</p>
                    <div class="view-btn">View Skill &rarr;</div>
                </a>
            `).join('')}
        </div>

        <div id="empty-state">
            <h4>No matching skills found</h4>
            <p>Try searching for a different keyword or platform.</p>
        </div>
    </main>

    <footer style="text-align: center; padding: 6rem 4rem; opacity: 0.2; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
        &copy; 2026 Agent Skills Library
    </footer>
</body>
</html>
  `;
  return html;
}

function generateSkillPage(skill, htmlContent) {
  const installCmd = `npx skills add dhruvanbhalara/skills --skill ${skill.id}`;
  const title = `${skill.title} | Agent Skills`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    ${getMetaTags(title, skill.description, `${skill.id}.html`)}
    <style>${getBaseStyles()}</style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dart.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/yaml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
    <script>${getThemeScript()}</script>
</head>
<body>
    <nav>
        <div class="nav-content">
            <a href="/" class="logo">
                <span class="logo-glyph"></span>
                <span class="logo-text">Agent Skills</span>
            </a>
            <div class="nav-links">
                <button class="theme-btn" onclick="toggleTheme()" id="theme-icon" aria-label="Toggle theme">🌙</button>
                <a href="https://github.com/dhruvanbhalara/skills" target="_blank" rel="noopener">GITHUB</a>
            </div>
        </div>
    </nav>

    <main>
        <div class="breadcrumb">
            <a href="/">Library</a> / <span style="text-transform: capitalize;">${skill.category || 'General'}</span> / ${skill.title}
        </div>

        <div style="margin-bottom: 2rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${(skill.platforms || []).map(p => `<span class="badge platform" data-platform="${p.toLowerCase()}">${p}</span>`).join('')}
            ${(skill.languages || []).map(l => `<span class="badge platform" data-platform="${l.toLowerCase()}">${l}</span>`).join('')}
            <span class="badge category">${skill.category || 'general'}</span>
        </div>

        <div class="install-box">
            <span>${installCmd}</span>
            <button onclick="navigator.clipboard.writeText('${installCmd}').then(() => { this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000); })">Copy</button>
        </div>

        <section class="article-section">
            <article class="markdown-body">
                ${htmlContent}
            </article>
        </section>
    </main>

    <footer style="text-align: center; padding: 6rem; opacity: 0.3; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
        <a href="/" style="color: inherit; text-decoration: none;">&larr; Back to Library</a>
    </footer>
</body>
</html>
  `;
  return html;
}

async function walkDir(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await walkDir(filePath, fileList);
    } else if (file.name === 'SKILL.md') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function build() {
  try {
    await fs.ensureDir(OUTPUT_DIR);
    await fs.emptyDir(OUTPUT_DIR);

    const skills = [];
    const skillFiles = await walkDir(SKILLS_DIR);

    for (const skillPath of skillFiles) {
      const folderName = path.basename(path.dirname(skillPath));

      let frontmatter = {};
      const fullContent = await fs.readFile(skillPath, 'utf8');
      const fmMatch = fullContent.match(/^---\n([\s\S]*?)\n---/);
      if (fmMatch) frontmatter = yaml.parse(fmMatch[1]);

      const cleanContent = fullContent.replace(/^---\n[\s\S]*?\n---/, '');
      const htmlContent = md.render(cleanContent);

      const metadata = frontmatter.metadata || {};
      let platforms = [];
      if (metadata.platforms) {
        platforms = metadata.platforms.split(',').map(p => p.trim());
      }

      let languages = [];
      if (metadata.languages) {
        languages = metadata.languages.split(',').map(l => l.trim());
      }

      const skillData = {
        id: folderName,
        name: frontmatter.name || folderName,
        title: toTitleCase(frontmatter.name || folderName),
        description: frontmatter.description || '',
        platforms: platforms.length > 0 ? platforms : ['flutter'],
        languages: languages.length > 0 ? languages : ['dart'],
        category: metadata.category || 'general',
        htmlContent
      };

      skills.push(skillData);
      await fs.writeFile(path.join(OUTPUT_DIR, `${folderName}.html`), generateSkillPage(skillData, htmlContent));
    }

    // Generate Index
    const sortedSkills = skills.sort((a, b) => a.title.localeCompare(b.title));
    await fs.writeFile(path.join(OUTPUT_DIR, 'index.html'), generateIndexPage(sortedSkills));

    // Generate Sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${SITE_URL}/</loc></url>
    ${skills.map(s => `<url><loc>${SITE_URL}/${s.id}.html</loc></url>`).join('\n    ')}
</urlset>`;
    await fs.writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);

    // Generate search.json
    await fs.writeJson(path.join(OUTPUT_DIR, 'search.json'), skills.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      platforms: s.platforms,
      category: s.category
    })));

    console.log(`✅ Build successful! Generated ${skills.length} skill pages.`);
  } catch (err) {
    console.error('❌ Build failed:', err);
  }
}

build();

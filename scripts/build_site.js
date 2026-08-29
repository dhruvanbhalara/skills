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
      if (lower === 'ci') return 'CI';
      if (lower === 'cd') return 'CD';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function getBaseStyles() {
  return `
    :root {
      --color-void: #000000;
      --color-bone-white: #ffffff;
      --color-ash-gray: #9ca3af;
      --color-silver-mist: #d1d5db;
      --color-electric-iris: #8052ff;
      --color-electric-iris-hover: #9266ff;
      --color-electric-iris-glow: rgba(128, 82, 255, 0.28);
      --color-saffron-spark: #ffb829;
      --color-deep-verdant: #10b981;
      --color-surface-card: rgba(255, 255, 255, 0.025);
      --color-surface-hover: rgba(255, 255, 255, 0.045);
      --color-border-subtle: rgba(255, 255, 255, 0.09);
      --color-border-hover: rgba(128, 82, 255, 0.45);
      --color-code-bg: #09090b;
      --max-width: 1240px;

      --bg: var(--color-void);
      --text: var(--color-bone-white);
      --text-muted: var(--color-ash-gray);
      --text-secondary: var(--color-silver-mist);
      --primary: var(--color-electric-iris);
      --primary-hover: var(--color-electric-iris-hover);
      --primary-glow: var(--color-electric-iris-glow);
      --card-bg: var(--color-surface-card);
      --card-hover-bg: var(--color-surface-hover);
      --border: var(--color-border-subtle);
      --border-hover: var(--color-border-hover);
      --nav-bg: rgba(0, 0, 0, 0.75);
      --code-bg: var(--color-code-bg);
      --badge-bg: rgba(255, 255, 255, 0.05);
      --inline-code-bg: rgba(128, 82, 255, 0.1);
      --inline-code-color: #a78bfa;

      --radius-card: 20px;
      --radius-install: 16px;
      --radius-pill: 9999px;
      --radius-code: 14px;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    [data-theme="light"] {
      --color-void: #f8fafc;
      --color-bone-white: #0f172a;
      --color-ash-gray: #64748b;
      --color-silver-mist: #334155;
      --color-surface-card: #ffffff;
      --color-surface-hover: #ffffff;
      --color-border-subtle: rgba(0, 0, 0, 0.08);
      --color-border-hover: rgba(128, 82, 255, 0.4);
      --color-code-bg: #f1f5f9;

      --bg: var(--color-void);
      --text: var(--color-bone-white);
      --text-muted: var(--color-ash-gray);
      --text-secondary: var(--color-silver-mist);
      --card-bg: var(--color-surface-card);
      --card-hover-bg: var(--color-surface-hover);
      --border: var(--color-border-subtle);
      --border-hover: var(--color-border-hover);
      --nav-bg: rgba(248, 250, 252, 0.85);
      --code-bg: var(--color-code-bg);
      --badge-bg: rgba(0, 0, 0, 0.04);
      --inline-code-bg: rgba(112, 56, 255, 0.08);
      --inline-code-color: #6d28d9;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-weight: 400;
      line-height: 1.6;
      padding-top: 72px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navigation */
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
      gap: 0.65rem;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text);
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    .logo-glyph {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 10px var(--primary-glow);
      display: inline-block;
    }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: color 0.15s ease;
    }
    .nav-links a:hover { color: var(--text); }
    .theme-btn {
      background: var(--badge-bg);
      border: 1px solid var(--border);
      color: var(--text);
      cursor: pointer;
      font-size: 1rem;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-pill);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
    }
    .theme-btn:hover { border-color: var(--primary); }
    .theme-btn:active { transform: scale(0.96); }

    /* Hero Section */
    header {
      padding: 5rem 2rem 3rem;
      max-width: var(--max-width);
      margin: 0 auto;
      width: 100%;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 3.5rem;
      align-items: center;
    }
    .hero-text {
      display: flex;
      flex-direction: column;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      align-self: flex-start;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-saffron-spark);
      background: rgba(255, 184, 41, 0.08);
      border: 1px solid rgba(255, 184, 41, 0.22);
      padding: 0.35rem 0.9rem;
      border-radius: var(--radius-pill);
      margin-bottom: 1.5rem;
    }
    .hero-badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-saffron-spark);
      box-shadow: 0 0 8px rgba(255, 184, 41, 0.5);
    }
    h1 {
      font-size: clamp(3.2rem, 6.5vw, 5.2rem);
      font-weight: 500;
      letter-spacing: -0.04em;
      line-height: 1.02;
      margin-bottom: 1.25rem;
      color: var(--text);
    }
    .subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      max-width: 540px;
      line-height: 1.6;
      font-weight: 300;
      margin-bottom: 2.25rem;
    }
    .hero-visual {
      position: relative;
      width: 100%;
      height: 320px;
      border-radius: var(--radius-card);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #constellation-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Terminal Install Box */
    .install-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: var(--radius-install);
      padding: 0.75rem 1rem 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      max-width: 580px;
      font-family: var(--font-mono);
      font-size: 0.86rem;
      color: var(--text);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
    [data-theme="light"] .install-box {
      background: #ffffff;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    }
    .install-box-code {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      overflow-x: auto;
      white-space: nowrap;
      flex: 1;
    }
    .install-box-prompt {
      color: var(--primary);
      font-weight: 700;
      user-select: none;
    }
    .install-box span.cmd-text {
      color: var(--text-secondary);
    }
    .install-box button {
      background: var(--primary);
      color: #ffffff;
      border: none;
      padding: 0.55rem 1.15rem;
      border-radius: var(--radius-pill);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      cursor: pointer;
      font-family: var(--font-body);
      box-shadow: 0 0 14px var(--primary-glow);
      transition: background 0.15s ease, transform 0.15s ease;
      flex-shrink: 0;
    }
    .install-box button:hover { background: var(--primary-hover); }
    .install-box button:active { transform: scale(0.96); }

    /* Search & Filter Controls */
    .controls-wrapper {
      max-width: var(--max-width);
      margin: 0 auto 2.5rem;
      padding: 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .search-container {
      position: relative;
      width: 100%;
    }
    .search-icon {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
      width: 18px;
      height: 18px;
    }
    .search-shortcut {
      position: absolute;
      right: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
      background: var(--badge-bg);
      border: 1px solid var(--border);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      pointer-events: none;
    }
    #search-input {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 1.1rem 3.5rem 1.1rem 3.25rem;
      border-radius: var(--radius-install);
      color: var(--text);
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }
    #search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }

    /* Filter Tabs */
    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    .filter-btn {
      background: transparent;
      border: 1px solid var(--border);
      padding: 0.45rem 1rem;
      border-radius: var(--radius-pill);
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease, transform 0.15s ease;
    }
    .filter-btn .filter-count {
      font-size: 0.7rem;
      font-weight: 600;
      opacity: 0.7;
    }
    .filter-btn:hover {
      background: var(--badge-bg);
      color: var(--text);
      border-color: rgba(255, 255, 255, 0.2);
    }
    [data-theme="light"] .filter-btn:hover {
      border-color: rgba(0, 0, 0, 0.2);
    }
    .filter-btn.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 0 12px var(--primary-glow);
    }
    .filter-btn.active .filter-count { opacity: 0.9; }
    .filter-btn:active { transform: scale(0.96); }

    /* Main & Card Grid */
    main {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 2rem 6rem;
      width: 100%;
      flex: 1;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      width: 100%;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      padding: 2rem;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    }
    [data-theme="light"] .card {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: var(--border-hover);
      background: var(--card-hover-bg);
      box-shadow: 0 14px 34px -10px rgba(128, 82, 255, 0.16);
    }
    .card:active { transform: scale(0.98); }
    .card-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .badges { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .badge {
      font-size: 0.68rem;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-pill);
      background: var(--badge-bg);
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border: 1px solid var(--border);
    }
    .badge.platform-flutter {
      border-color: rgba(16, 185, 129, 0.35);
      color: var(--color-deep-verdant);
      background: rgba(16, 185, 129, 0.08);
    }
    .badge.platform-dart {
      border-color: rgba(128, 82, 255, 0.35);
      color: var(--color-electric-iris);
      background: rgba(128, 82, 255, 0.08);
    }
    .badge.platform-github {
      border-color: rgba(255, 184, 41, 0.35);
      color: var(--color-saffron-spark);
      background: rgba(255, 184, 41, 0.08);
    }
    .badge.category {
      background: var(--badge-bg);
      color: var(--text-muted);
    }
    .card h3 {
      font-size: 1.15rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.35;
      color: var(--text);
    }
    .card p {
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 2rem;
      flex-grow: 1;
      font-weight: 400;
    }
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .view-btn {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: transform 0.2s ease;
    }
    .card:hover .view-btn { transform: translateX(3px); }

    /* Empty Search State */
    #empty-state {
      display: none;
      padding: 6rem 2rem;
      text-align: center;
      color: var(--text-muted);
    }
    #empty-state h4 {
      font-size: 1.4rem;
      font-weight: 500;
      color: var(--text);
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }
    #empty-state p { font-size: 0.95rem; font-weight: 300; }

    /* Skill Detail Page */
    .skill-page-header {
      margin-bottom: 3.5rem;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2rem;
      color: var(--text-muted);
    }
    .breadcrumb a { color: var(--text-muted); text-decoration: none; transition: color 0.15s ease; }
    .breadcrumb a:hover { color: var(--text); }
    .breadcrumb-sep { opacity: 0.4; }
    .skill-title-block {
      margin-bottom: 2rem;
    }
    .skill-title-block h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 600;
      letter-spacing: -0.035em;
      line-height: 1.08;
      color: var(--text);
      margin-bottom: 1.5rem;
    }

    /* Markdown Body */
    .article-section {
      margin-top: 3.5rem;
      padding-top: 3.5rem;
      border-top: 1px solid var(--border);
    }
    .markdown-body {
      max-width: var(--max-width);
      margin: 0 auto;
      line-height: 1.75;
      color: var(--text-secondary);
      font-size: 1.02rem;
    }
    .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
      color: var(--text);
      font-weight: 600;
      margin-top: 3rem;
      margin-bottom: 1.25rem;
      letter-spacing: -0.025em;
    }
    .markdown-body h1 { font-size: 2.2rem; line-height: 1.2; }
    .markdown-body h2 {
      font-size: 1.55rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.6rem;
      margin-top: 4rem;
    }
    .markdown-body h3 { font-size: 1.25rem; }
    .markdown-body p { margin-bottom: 1.6rem; }
    .markdown-body ul, .markdown-body ol { margin-bottom: 1.6rem; padding-left: 1.75rem; }
    .markdown-body li { margin-bottom: 0.6rem; }
    .markdown-body strong { color: var(--text); font-weight: 600; }
    .markdown-body code:not(pre code) {
      font-family: var(--font-mono);
      font-size: 0.88em;
      background: var(--inline-code-bg);
      padding: 0.15em 0.45em;
      border-radius: 6px;
      color: var(--inline-code-color);
      font-weight: 500;
    }
    .markdown-body pre {
      background: var(--code-bg) !important;
      padding: 1.75rem;
      border-radius: var(--radius-code);
      margin: 2rem 0;
      position: relative;
      overflow-x: auto;
      border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    .markdown-body pre code {
      font-family: var(--font-mono);
      font-size: 0.88rem;
      line-height: 1.6;
    }
    .markdown-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 2.5rem 0;
      font-size: 0.95rem;
    }
    .markdown-body th, .markdown-body td {
      padding: 0.85rem 1.25rem;
      border: 1px solid var(--border);
      text-align: left;
    }
    .markdown-body th {
      background: var(--badge-bg);
      color: var(--text);
      font-weight: 600;
    }
    .markdown-body blockquote {
      border-left: 3px solid var(--primary);
      padding: 0.75rem 1.5rem;
      margin: 2rem 0;
      background: var(--badge-bg);
      border-radius: 0 12px 12px 0;
      color: var(--text-muted);
    }

    .copy-btn {
      position: absolute; top: 1rem; right: 1rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-pill);
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.15s ease, background 0.15s ease;
    }
    [data-theme="light"] .copy-btn {
      background: rgba(0, 0, 0, 0.06);
    }
    pre:hover .copy-btn { opacity: 1; }
    .copy-btn:hover { background: var(--primary); color: #ffffff; border-color: var(--primary); }
    .copy-btn:active { transform: scale(0.96); }

    /* Footer */
    footer {
      text-align: center;
      padding: 5rem 2rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      margin-top: auto;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: color 0.15s ease, transform 0.15s ease;
    }
    .back-link:hover { color: var(--text); transform: translateX(-3px); }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .hero-visual { height: 240px; }
      .card-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      body { padding-top: 64px; }
      nav { height: 64px; }
      header { padding: 3rem 1.5rem 2rem; }
      h1 { font-size: 2.5rem; }
      .card-grid { grid-template-columns: 1fr; }
      .install-box { flex-direction: column; align-items: stretch; gap: 0.75rem; padding: 1.25rem; }
      .install-box button { width: 100%; }
      .controls-wrapper, main { padding-left: 1.5rem; padding-right: 1.5rem; }
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
            const matchesCategory = activeCategory === 'all' || platforms.includes(activeCategory) || category === activeCategory;

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
          let width, height;

          function resize() {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : 300);
            height = canvas.height = canvas.offsetHeight || (canvas.parentElement ? canvas.parentElement.clientHeight : 300);
          }
          resize();

          const colors = ['#8052ff', '#ffb829', '#10b981', '#60a5fa', '#f472b6', '#a78bfa'];
          const particleCount = 42;
          const particles = [];

          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * (width || 300),
              y: Math.random() * (height || 300),
              vx: (Math.random() - 0.5) * 0.35,
              vy: (Math.random() - 0.5) * 0.35,
              size: Math.random() * 4.5 + 2.5,
              color: colors[Math.floor(Math.random() * colors.length)],
              angle: Math.random() * Math.PI * 2,
              va: (Math.random() - 0.5) * 0.015
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
            ctx.lineWidth = 1.3;
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
                if (dist < 95) {
                  ctx.beginPath();
                  ctx.moveTo(particles[i].x, particles[i].y);
                  ctx.lineTo(particles[j].x, particles[j].y);
                  ctx.strokeStyle = 'rgba(128, 82, 255, ' + ((1 - dist / 95) * 0.22) + ')';
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
            resize();
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    ${getMetaTags(title, description)}
    <style>${getBaseStyles()}</style>
    <script>${getThemeScript()}</script>
</head>
<body>
    <nav>
        <div class="nav-content">
            <a href="/" class="logo">
                <span class="logo-glyph"></span>
                <span>Agent Skills</span>
            </a>
            <div class="nav-links">
                <button class="theme-btn" onclick="toggleTheme()" id="theme-icon" aria-label="Toggle color theme">🌙</button>
                <a href="https://github.com/dhruvanbhalara/skills" target="_blank" rel="noopener">GITHUB</a>
            </div>
        </div>
    </nav>

    <header>
        <div class="hero-grid">
            <div class="hero-text">
                <div class="hero-badge">
                    <span class="hero-badge-dot"></span>
                    <span>${skills.length} Specialized Agent Skills</span>
                </div>
                <h1>Agent Skills</h1>
                <div class="subtitle">Curated engineering workflows and architectural standards for professional AI coding assistants.</div>
                <div class="install-box">
                    <div class="install-box-code">
                        <span class="install-box-prompt">$</span>
                        <span class="cmd-text">npx skills add dhruvanbhalara/skills</span>
                    </div>
                    <button onclick="navigator.clipboard.writeText('npx skills add dhruvanbhalara/skills').then(() => { this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000); })">Copy</button>
                </div>
            </div>
            <div class="hero-visual">
                <canvas id="constellation-canvas"></canvas>
            </div>
        </div>
    </header>

    <div class="controls-wrapper">
        <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="search-input" placeholder="Search ${skills.length} skills (e.g. 'bloc', 'testing', 'optimization')...">
            <span class="search-shortcut">/</span>
        </div>

        <div class="filter-container">
            <button class="filter-btn active" data-platform="all">
                <span>All</span>
                <span class="filter-count">(${skills.length})</span>
            </button>
            <button class="filter-btn" data-platform="flutter">
                <span>Flutter</span>
                <span class="filter-count">(${flutterCount})</span>
            </button>
            <button class="filter-btn" data-platform="dart">
                <span>Dart</span>
                <span class="filter-count">(${dartCount})</span>
            </button>
            <button class="filter-btn" data-platform="github">
                <span>GitHub</span>
                <span class="filter-count">(${githubCount})</span>
            </button>
        </div>
    </div>

    <main>
        <div class="card-grid">
            ${skills.map(skill => {
              const platforms = skill.platforms || [];
              return `
                <a href="${skill.id}.html" class="card"
                   data-title="${skill.title}"
                   data-desc="${skill.description}"
                   data-platforms="${[...(skill.platforms || []), ...(skill.languages || [])].join(',')}"
                   data-category="${skill.category || ''}">
                    <div class="card-header">
                        <div class="badges">
                            ${platforms.map(p => `<span class="badge ${p.toLowerCase() === 'flutter' ? 'platform-flutter' : p.toLowerCase() === 'dart' ? 'platform-dart' : p.toLowerCase().includes('git') ? 'platform-github' : ''}">${p}</span>`).join('')}
                            <span class="badge category">${skill.category || 'general'}</span>
                        </div>
                        <h3>${skill.title}</h3>
                    </div>
                    <p>${skill.description}</p>
                    <div class="card-footer">
                        <span class="view-btn">
                            View Skill
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </span>
                    </div>
                </a>
              `;
            }).join('')}
        </div>

        <div id="empty-state">
            <h4>No matching skills found</h4>
            <p>Try searching for a different keyword or category.</p>
        </div>
    </main>

    <footer>
        <div>&copy; 2026 Agent Skills Library &middot; Designed for AI Agents &amp; Developers</div>
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
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
                <span>Agent Skills</span>
            </a>
            <div class="nav-links">
                <button class="theme-btn" onclick="toggleTheme()" id="theme-icon" aria-label="Toggle color theme">🌙</button>
                <a href="https://github.com/dhruvanbhalara/skills" target="_blank" rel="noopener">GITHUB</a>
            </div>
        </div>
    </nav>

    <main>
        <div class="skill-page-header">
            <div class="breadcrumb">
                <a href="/">Library</a>
                <span class="breadcrumb-sep">/</span>
                <span>${skill.category || 'General'}</span>
                <span class="breadcrumb-sep">/</span>
                <span>${skill.title}</span>
            </div>

            <div class="skill-title-block">
                <div class="badges" style="margin-bottom: 1.25rem;">
                    ${(skill.platforms || []).map(p => `<span class="badge ${p.toLowerCase() === 'flutter' ? 'platform-flutter' : p.toLowerCase() === 'dart' ? 'platform-dart' : p.toLowerCase().includes('git') ? 'platform-github' : ''}">${p}</span>`).join('')}
                    ${(skill.languages || []).map(l => `<span class="badge">${l}</span>`).join('')}
                    <span class="badge category">${skill.category || 'general'}</span>
                </div>
                <h1>${skill.title}</h1>
                <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 720px; line-height: 1.6;">${skill.description}</p>
            </div>

            <div class="install-box" style="max-width: 100%;">
                <div class="install-box-code">
                    <span class="install-box-prompt">$</span>
                    <span class="cmd-text">${installCmd}</span>
                </div>
                <button onclick="navigator.clipboard.writeText('${installCmd}').then(() => { this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000); })">Copy</button>
            </div>
        </div>

        <section class="article-section">
            <article class="markdown-body">
                ${htmlContent}
            </article>
        </section>

        <div style="margin-top: 5rem; padding-top: 2rem;">
            <a href="/" class="back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Library
            </a>
        </div>
    </main>

    <footer>
        <div>&copy; 2026 Agent Skills Library &middot; Designed for AI Agents &amp; Developers</div>
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

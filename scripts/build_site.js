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

// Helper to capitalize IDs
function toTitleCase(str) {
  if (!str) return '';
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getBaseStyles() {
  return `
    :root {
      --bg: oklch(0.15 0.02 260);
      --text: oklch(0.95 0.01 260);
      --primary: oklch(0.7 0.2 250);
      --card-bg: oklch(0.18 0.02 260);
      --border: oklch(0.25 0.02 260);
      --nav-bg: oklch(0.12 0.02 260 / 0.8);
      --code-bg: oklch(0.12 0.02 260);
      --max-width: 1125px;
    }

    [data-theme="light"] {
      --bg: oklch(0.98 0.01 260);
      --text: oklch(0.15 0.02 260);
      --primary: oklch(0.6 0.2 250);
      --card-bg: oklch(0.95 0.01 260);
      --border: oklch(0.85 0.01 260);
      --nav-bg: oklch(1 0 0 / 0.8);
      --badge-bg: oklch(0.9 0.02 260);
    }

    :root {
      --badge-bg: oklch(0.22 0.02 260);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; transition: background 0.15s, color 0.15s; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Outfit', -apple-system, sans-serif;
      line-height: 1.6;
      padding-top: 60px;
      -webkit-font-smoothing: antialiased;
    }

    nav {
      position: fixed; top: 0; left: 0; width: 100%; height: 60px;
      background: var(--nav-bg);
      backdrop-filter: blur(12px);
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
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text);
      text-decoration: none;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links a { color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.8rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }
    .nav-links a:hover { opacity: 1; }

    header {
      padding: 5rem 2rem 3rem;
      max-width: var(--max-width);
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      line-height: 1;
      font-weight: 900;
      margin-bottom: 0.75rem;
      letter-spacing: -1.5px;
      text-transform: uppercase;
      color: var(--primary);
    }
    .subtitle {
      font-size: 0.9rem;
      opacity: 0.5;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2.5rem;
    }

    .install-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto 2.5rem;
      max-width: var(--max-width);
      min-height: 72px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: var(--text);
    }
    .install-box span { opacity: 0.9; }
    .install-box button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-weight: 800;
      font-size: 0.75rem;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    main { max-width: var(--max-width); margin: 0 auto; padding: 2rem 0; }


    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      max-width: var(--max-width);
      margin: 0 auto;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 2.25rem;
      border-radius: 16px;
      text-decoration: none;
      color: var(--text);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .card:hover { border-color: var(--primary); transform: translateY(-3px); }
    .card h3 { font-size: 1.05rem; margin-bottom: 1rem; color: var(--text); text-transform: uppercase; font-weight: 800; letter-spacing: -0.3px; }
    .card p { font-size: 0.9rem; opacity: 0.6; line-height: 1.6; margin-bottom: 2rem; flex-grow: 1; }
    .view-btn { font-size: 0.7rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }

    .theme-btn:hover { background: var(--border); }

    /* Badges */
    .badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .badge {
      font-size: 0.6rem;
      font-weight: 800;
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      background: var(--badge-bg);
      color: var(--text);
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid var(--border);
    }
    .badge.platform { border-color: var(--primary); color: var(--primary); opacity: 1; }

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
      padding: 0.5rem 1rem;
      border-radius: 8px;
      color: var(--text);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      cursor: pointer;
      letter-spacing: 0.5px;
    }
    .filter-btn:hover { background: var(--badge-bg); }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

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
      border-radius: 12px;
      color: var(--text);
      font-family: inherit;
      font-size: 1rem;
      outline: none;
    }
    #search-input:focus { border-color: var(--primary); }

    /* Markdown Styles */
    .markdown-body { max-width: var(--max-width); margin: 0 auto; padding-bottom: 6rem; }
    .markdown-body h1 { text-align: left; font-size: 1.5rem; color: var(--text); margin-top: 1.5rem; margin-bottom: 2rem; letter-spacing: -0.5px; text-transform: uppercase; line-height: 1.2; font-weight: 800; }
    .markdown-body h2 { font-size: 1.1rem; margin: 3.5rem 0 1.25rem; letter-spacing: -0.3px; text-transform: uppercase; font-weight: 800; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
    .markdown-body h3 { font-size: 0.95rem; margin: 2.5rem 0 1rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; }
    .markdown-body p { margin-bottom: 1.5rem; font-size: 1rem; opacity: 0.8; line-height: 1.75; }
    .markdown-body ul, .markdown-body ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
    .markdown-body li { margin-bottom: 0.75rem; opacity: 0.8; font-size: 0.95rem; }

    .markdown-body pre {
      background: var(--code-bg) !important;
      padding: 1.75rem;
      border-radius: 12px;
      margin: 2rem 0;
      position: relative;
      overflow-x: auto;
      border: 1px solid var(--border);
    }
    .markdown-body code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
    }

    .article-section {
      margin-top: 5rem;
      padding-top: 4rem;
      border-top: 1px solid var(--border);
    }

    .copy-btn {
      position: absolute; top: 1rem; right: 1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.65rem;
      text-transform: uppercase;
      font-weight: 800;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    }
    pre:hover .copy-btn { opacity: 1; }

    .breadcrumb {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 2rem;
      opacity: 0.4;
    }
    .breadcrumb a { color: var(--text); text-decoration: none; }
    .breadcrumb a:hover { opacity: 1; text-decoration: underline; }

    @media (max-width: 900px) {
      .card-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      h1 { font-size: 2rem; }
      header { padding-top: 4rem; }
      .card-grid { grid-template-columns: 1fr; }
      .install-box { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem; height: auto; }
      .install-box button { margin-left: 0; width: 100%; }
    }
  `;
}

function getThemeScript() {
  return `
    (function() {
      function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.getElementById('theme-icon');
        if (icon) icon.innerText = theme === 'dark' ? '🌙' : '☀️';
      }

      const savedTheme = localStorage.getItem('theme') || 'dark';
      applyTheme(savedTheme);

      window.toggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
      };

      // Sync theme on back/forward navigation
      window.addEventListener('pageshow', (event) => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme);
      });

      window.addEventListener('DOMContentLoaded', () => {
        applyTheme(localStorage.getItem('theme') || 'dark');

        if (typeof hljs !== 'undefined') hljs.highlightAll();

        document.querySelectorAll('pre').forEach(block => {
          const button = document.createElement('button');
          button.className = 'copy-btn';
          button.innerText = 'Copy';
          button.addEventListener('click', () => {
            const codeBlock = block.querySelector('code');
            if (!codeBlock) return;
            const code = codeBlock.innerText;
            navigator.clipboard.writeText(code).then(() => {
              button.innerText = 'Copied!';
              setTimeout(() => button.innerText = 'Copy', 2000);
            });
          });
          block.appendChild(button);
        });

        // Filtering & Search Logic
        const searchInput = document.getElementById('search-input');
        const filterBtns = document.querySelectorAll('.filter-btn');
        let activePlatform = 'all';

        function updateVisibility() {
          const query = searchInput.value.toLowerCase();
          const cards = document.querySelectorAll('.card');

          cards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const desc = card.getAttribute('data-desc').toLowerCase();
            const platforms = card.getAttribute('data-platforms').toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();

            const matchesSearch = title.includes(query) || desc.includes(query) || platforms.includes(query) || category.includes(query);
            const matchesPlatform = activePlatform === 'all' || platforms.includes(activePlatform);

            if (matchesSearch && matchesPlatform) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }

        if (searchInput) {
          searchInput.addEventListener('input', updateVisibility);
        }

        filterBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePlatform = btn.getAttribute('data-platform');
            updateVisibility();
          });
        });
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
  const title = "Agent Skills Library — The Directory for AI Agents";
  const description = "Premium documentation library for professional Flutter and Dart AI agents. Built for Antigravity, Copilot, and Cursor.";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800;900&family=JetBrains+Mono&display=swap" rel="stylesheet">
    ${getMetaTags(title, description)}
    <style>${getBaseStyles()}</style>
    <script>${getThemeScript()}</script>
</head>
<body>
    <nav>
        <div class="nav-content">
            <a href="/" class="logo">Agent Skills</a>
            <div class="nav-links">
                <button class="theme-btn" onclick="toggleTheme()" id="theme-icon">🌙</button>
                <a href="https://github.com/dhruvanbhalara/skills" target="_blank">GITHUB</a>
            </div>
        </div>
    </nav>

    <header>
        <h1>Agent Skills</h1>
        <div class="subtitle">by Dhruvan Bhalara</div>

        <div class="install-box">
            <span>npx skills add dhruvanbhalara/skills</span>
            <button onclick="navigator.clipboard.writeText('npx skills add dhruvanbhalara/skills').then(() => { this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000); })">Copy</button>
        </div>
    </header>

    <div class="search-container">
        <input type="text" id="search-input" placeholder="Search skills (e.g., 'optimization', 'bloc', 'git')...">
    </div>

    <div class="filter-container">
        <button class="filter-btn active" data-platform="all">All Platforms</button>
        <button class="filter-btn" data-platform="flutter">Flutter</button>
        <button class="filter-btn" data-platform="android">Android</button>
        <button class="filter-btn" data-platform="ios">iOS</button>
        <button class="filter-btn" data-platform="cross-platform">Cross-Platform</button>
    </div>

    <main>
        <div class="card-grid">
            ${skills.map(skill => `
                <a href="${skill.id}.html" class="card"
                   data-title="${skill.title}"
                   data-desc="${skill.description}"
                   data-platforms="${(skill.platforms || []).join(',')}"
                   data-category="${skill.category || ''}">
                    <div class="badges">
                        ${(skill.platforms || []).map(p => `<span class="badge platform">${p}</span>`).join('')}
                        <span class="badge">${skill.category || 'general'}</span>
                    </div>
                    <h3>${skill.title}</h3>
                    <p>${skill.description}</p>
                    <div class="view-btn">View Skill &rarr;</div>
                </a>
            `).join('')}
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
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800;900&family=JetBrains+Mono&display=swap" rel="stylesheet">
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
            <a href="/" class="logo">Agent Skills</a>
            <div class="nav-links">
                <button class="theme-btn" onclick="toggleTheme()" id="theme-icon">🌙</button>
                <a href="https://github.com/dhruvanbhalara/skills" target="_blank">GITHUB</a>
            </div>
        </div>
    </nav>

    <main>
        <div class="breadcrumb">
            <a href="/">Library</a> / ${skill.title}
        </div>

        <div style="margin-bottom: 2rem; display: flex; gap: 0.5rem;">
            ${(skill.platforms || []).map(p => `<span class="badge platform">${p}</span>`).join('')}
            ${(skill.languages || []).map(l => `<span class="badge">${l}</span>`).join('')}
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
        title: (frontmatter.name || folderName).toUpperCase(),
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

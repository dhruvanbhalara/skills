# Contributing to Agent Skills

We welcome contributions! To maintain the quality and consistency of this library, please follow these guidelines when adding or modifying skills.

## Adding a New Skill

1. **Create a Directory**: Add a new folder in `skills/` named after the skill (slug-case, e.g., `performance-tuning`).
2. **Add SKILL.md**: Every skill folder MUST contain a `SKILL.md` file.
3. **YAML Frontmatter**: Include metadata at the top of the file:
   ```yaml
   ---
   name: skill-id
   description: Brief description of what this skill covers.
   platforms: [flutter, android, ios]
   languages: [dart, kotlin, swift]
   category: category-name
   ---
   ```
4. **Content Structure**:
   - Use `#` for the main title.
   - Use `##` and `###` for sub-sections.
   - Ensure instructions are actionable and concise.
   - Use code blocks for examples.

## Standards
- **Agent Agnostic**: Avoid references to specific AI agents (e.g., Antigravity, Copilot).
- **Conciseness**: Keep skills focused. If a skill becomes too broad, consider splitting it.
- **Universal Tech**: While we focus on Flutter, general Dart or Mobile principles should be clearly identified.

## Site Preview
To test your changes locally:
1. Run `npm install`.
2. Run `npm run dev` to build the site with the `--watch` flag.
3. Open `_site/index.html` in your browser.

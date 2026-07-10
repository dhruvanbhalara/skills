---
name: changelog-writing
description: Audit and rewrite project changelogs to adhere strictly to Keep a Changelog and Semantic Versioning standards. Use when reviewing, drafting, or refining project changelogs.
metadata:
    platforms: "cross-platform"
    languages: "generic"
    category: "git"
---

# Changelog Writing & Auditing

Use this skill when reviewing, drafting, or refining project changelogs. It ensures they follow Keep a Changelog formatting and remain clear to readers.

## Core Rules

1. **Write for Humans**: Changelogs must be clear and readable. They are written for developers and users to understand what changed and why.
2. **Do Not Dump Git Logs**: Never export git commit messages directly into the changelog. Group and summarize changes into clear, user-facing actions.
3. **Chronological Order**: Group changes by version release, with the newest version at the top.
4. **Link to Releases**: Format version headers as links comparing the previous tag with the current tag when possible.

---

## Standard Categories

Group changes under these third-level headers (`###`):

* `### Added`: New features or capabilities.
* `### Changed`: Improvements to existing behavior or APIs.
* `### Deprecated`: Features that will be removed in future versions.
* `### Removed`: Features removed in this release.
* `### Fixed`: Bug fixes.
* `### Security`: Vulnerability fixes or security upgrades.

---

## Read Git History

Before updating a changelog, read the git history of the target branch:
1. **Find Base Branch**: Identify the base branch (e.g., `main` or the last release tag).
2. **Get Commit Messages**: Run `git log <base-branch>..HEAD --oneline` to see the commits. If checking local changes, use `git log -n 50 --oneline`.
3. **Check Diff**: If commit messages lack detail, run `git diff <base-branch>..HEAD` to see the code changes.
4. **Summarize**: Group changes under the standard Keep a Changelog categories. Translate commit messages into plain actions.

---

## Tone and Style

* **Plain Wording**: Avoid corporate jargon or AI terms (e.g., "leverage", "streamline", "optimize", "enhance"). Use simple active verbs (e.g., "Use", "Simplify", "Improve", "Group").
* **Active Voice**: Start bullet points with past-tense action verbs (e.g., "Grouped 41 tools...", "Replaced format parameters...").
* **Keep Lines Short**: Use brief, single-sentence bullet points.

---

## Examples

### Bad Entry (Raw commit dump / AI-jargon)
```markdown
## 1.1.0

- Refactored user authentication handlers to streamline login flow and leverage performance metrics.
- We also resolved minor warnings.
- Added custom styling to dashboard panel.
- Fixed some bugs in the API request processor.
```

### Good Entry (Keep a Changelog standard)
```markdown
## 1.1.0

### Added
- Added custom styling properties to dashboard panels.

### Changed
- Simplified login flows in user authentication handlers.

### Fixed
- Fixed exception handling when processing API requests.
```

---

## Checklist

Before saving a `CHANGELOG.md` file, verify:
1. Are changes grouped under standard categories (`Added`, `Changed`, `Fixed`, `Removed`)?
2. Are raw git logs, hashes, and commit messages absent?
3. Are all entries written in plain English, free of AI terms?
4. Is the newest version at the top?

# Flutter Agent Skills Library

A collection of 17 specialized coding agent skills for professional Flutter and Dart development. Optimized for **Claude Code**, **GitHub Copilot**, **Antigravity**, **Cursor**, and **OpenAI Codex**.

## 🚀 Installation

These skills can be installed into your AI coding agent using the [skills.sh](https://skills.sh) CLI:

```bash
# Install all skills
npx skills add dhruvanbhalara/skills

# Install a specific skill (e.g., architecture)
npx skills add dhruvanbhalara/skills --skill architecture
```

## 📂 Available Skills

Each skill is a self-contained unit of specialized knowledge:

| Skill | Description |
|---|---|
| [architecture](skills/architecture/SKILL.md) | Clean Architecture, Repository Pattern, Native Integration |
| [app-config](skills/app-config/SKILL.md) | Flavors, single main.dart, dart-define-from-file |
| [ci-cd](skills/ci-cd/SKILL.md) | PR requirements, Analysis, Formatting, Testing pipelines |
| [clean-code](skills/clean-code/SKILL.md) | Dart guidelines, naming, conciseness, anti-patterns |
| [code-generation](skills/code-generation/SKILL.md) | build_runner build/watch patterns |
| [debugging](skills/debugging/SKILL.md) | AppLogger, DevTools, Memory & Performance debugging |
| [design-system](skills/design-system/SKILL.md) | Authoritative source for colors, spacing, typography tokens |
| [firebase](skills/firebase/SKILL.md) | Auth, Firestore, FCM, Crashlytics, Analytics |
| [forms](skills/forms/SKILL.md) | BLoC-driven forms, validation, lifecycle |
| [git-workflow](skills/git-workflow/SKILL.md) | Conventional & Atomic commits, PR metadata |
| [local-storage](skills/local-storage/SKILL.md) | Isar Database, offline-first caching patterns |
| [localization](skills/localization/SKILL.md) | ARB files, context.l10n, zero hardcoded strings |
| [networking](skills/networking/SKILL.md) | Dio, interceptors, retry logic, resilience |
| [security](skills/security/SKILL.md) | flutter_secure_storage, encryption, secrets management |
| [state-management](skills/state-management/SKILL.md) | BLoC, Injectable, submission checklists |
| [testing](skills/testing/SKILL.md) | 100% coverage, mirror structure, Mocktail usage |
| [ui-and-design](skills/ui-and-design/SKILL.md) | UI performance, layout rules, interaction patterns |

## 🤖 Global Agent Instructions

For agents that support global project-level guidance (like GitHub Copilot or Codex), we provide:
- `.github/copilot-instructions.md`
- `AGENTS.md`

## 📄 License
This library is licensed under the MIT License.

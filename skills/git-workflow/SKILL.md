---
name: git-workflow
description: Git & Development Flow
---

# Git & Development Flow

-   **Conventional Commits**: Follow `type(scope): message` pattern.
-   **Atomic Commits**: One commit = one logical change. Do not commit files unrelated to the current feature.
-   **PR Checklist**: Ensure `checklist.md` is reviewed before marking a task as complete.
-   **PR Metadata**: ALWAYS specify labels/tags (e.g., `bug`, `feature`) and at least one assignee when creating a Pull Request to ensure trackability.
-   **PR Labeling**: Categorize PRs using labels (e.g., `enhancement`, `bug`, `security`) and priority (e.g., `priority:high`).
-   **Branching**: Create feature branches from `main`; merge back into `main` when complete.
-   **PR Quality**: All PRs MUST pass analysis (0 warnings), formatting, and tests before merge.

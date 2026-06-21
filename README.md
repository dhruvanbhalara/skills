# Agent Skills Library

A collection of 42 specialized coding agent skills for professional software development, including Flutter, Dart, and GitHub workflows. These skills help AI coding assistants (like Antigravity, Claude Code, Cursor, and Copilot) follow your project standards for architecture, testing, UI design, and CI/CD.

[View Live Documentation](https://dhruvanbhalara.github.io/skills/)

---

## Installation

Add these skills to your AI agent using the `skills` CLI:

```bash
# Add all skills to your workspace
npx skills add dhruvanbhalara/skills

# Add a specific skill (e.g., flutter-spm)
npx skills add dhruvanbhalara/skills --skill flutter-spm
```

---

## Available Skills

### Dart Skills (14)

- [dart-add-unit-test](skills/dart/dart-add-unit-test/SKILL.md) — Write unit tests with mocking and coverage analysis for Dart CLI and backend apps.
- [dart-build-cli-app](skills/dart/dart-build-cli-app/SKILL.md) — Build Dart CLI applications with proper entrypoint structure, exit codes, and subprocess handling.
- [dart-collect-coverage](skills/dart/dart-collect-coverage/SKILL.md) — Collect test coverage, generate LCOV/HTML reports, and filter out generated files.
- [dart-fix-runtime-errors](skills/dart/dart-fix-runtime-errors/SKILL.md) — Fix common static analysis and runtime failures using specific type system patterns.
- [dart-generate-test-mocks](skills/dart/dart-generate-test-mocks/SKILL.md) — Generate mock dependencies using `package:mockito` and `build_runner`.
- [dart-genkit](skills/dart/dart-genkit/SKILL.md) — Build AI-powered workflows and agents using the Genkit Dart SDK.
- [dart-logic-patterns](skills/dart/dart-logic-patterns/SKILL.md) — Organize business logic using algorithms, data structures, and Dart 3 pattern matching.
- [dart-memory](skills/dart/dart-memory/SKILL.md) — Prevent memory leaks and reduce garbage collection pressure in Dart and Flutter.
- [dart-migrate-to-checks-package](skills/dart/dart-migrate-to-checks-package/SKILL.md) — Migrate test assertions from `package:matcher` to `package:checks`.
- [dart-modern-syntax](skills/dart/dart-modern-syntax/SKILL.md) — Use the latest features (private named parameters, extension types, wildcard variables, and records).
- [dart-optimization](skills/dart/dart-optimization/SKILL.md) — Optimize Dart code for runtime performance, type safety, and memory efficiency.
- [dart-run-static-analysis](skills/dart/dart-run-static-analysis/SKILL.md) — Configure linter rules and manage diagnostic suppressions in `analysis_options.yaml`.
- [dart-tooling](skills/dart/dart-tooling/SKILL.md) — Resolve package version conflicts and manage dependency overrides.
- [dart-use-pattern-matching](skills/dart/dart-use-pattern-matching/SKILL.md) — Build exhaustive control flows using switch expressions and sealed classes.

### Flutter Skills (25)

- [flutter-add-integration-test](skills/flutter/flutter-add-integration-test/SKILL.md) — Set up and run end-to-end integration tests on devices, web, or Firebase Test Lab.
- [flutter-add-widget-preview](skills/flutter/flutter-add-widget-preview/SKILL.md) — Add interactive widget previews using the `@Preview` annotation system.
- [flutter-add-widget-test](skills/flutter/flutter-add-widget-test/SKILL.md) — Write widget tests using `WidgetTester`, pump strategies, and finders.
- [flutter-apply-architecture-best-practices](skills/flutter/flutter-apply-architecture-best-practices/SKILL.md) — Enforce Clean Architecture (Data, Domain, Presentation) with the BLoC pattern.
- [flutter-bloc](skills/flutter/flutter-bloc/SKILL.md) — Set up state management and dependency injection using BLoCs and Cubits.
- [flutter-bloc-forms](skills/flutter/flutter-bloc-forms/SKILL.md) — Manage form states, input validation, and asynchronous submission.
- [flutter-build-responsive-layout](skills/flutter/flutter-build-responsive-layout/SKILL.md) — Build adaptive layouts for mobile, tablet, and desktop form factors.
- [flutter-code-gen](skills/flutter/flutter-code-gen/SKILL.md) — Run code generation for immutable data models and JSON serialization.
- [flutter-config](skills/flutter/flutter-config/SKILL.md) — Set up development, staging, and production flavors using `--dart-define-from-file`.
- [flutter-debugging](skills/flutter/flutter-debugging/SKILL.md) — centralize error boundaries, configure Crashlytics, and set up logging.
- [flutter-devtools](skills/flutter/flutter-devtools/SKILL.md) — Diagnose rendering, memory, and performance issues using DevTools and custom widget properties.
- [flutter-dio](skills/flutter/flutter-dio/SKILL.md) — Build API clients with Dio, featuring interceptors, request cancellation, and caching.
- [flutter-firebase](skills/flutter/flutter-firebase/SKILL.md) — Set up Firebase Authentication, Firestore, messaging, and remote configuration.
- [flutter-fix-layout-issues](skills/flutter/flutter-fix-layout-issues/SKILL.md) — Fix common layout exceptions (RenderFlex overflow, unbounded dimensions).
- [flutter-implement-json-serialization](skills/flutter/flutter-implement-json-serialization/SKILL.md) — Parse JSON data safely using background isolates and pattern matching.
- [flutter-isar](skills/flutter/flutter-isar/SKILL.md) — Set up local data persistence using Isar database with schema migrations.
- [flutter-native](skills/flutter/flutter-native/SKILL.md) — Communicate with native code using MethodChannels, EventChannels, and Pigeon.
- [flutter-security](skills/flutter/flutter-security/SKILL.md) — Encrypt local data using AES-256-GCM and secure credentials storage.
- [flutter-setup-declarative-routing](skills/flutter/flutter-setup-declarative-routing/SKILL.md) — Set up URL-based deep linking and shell navigation with `go_router`.
- [flutter-setup-localization](skills/flutter/flutter-setup-localization/SKILL.md) — Add localization support using ARB translation files and ICU message syntax.
- [flutter-spm](skills/flutter/flutter-spm/SKILL.md) — Manage native iOS and macOS dependencies using Swift Package Manager.
- [flutter-testing](skills/flutter/flutter-testing/SKILL.md) — Set up a test pyramid, golden variants, and state matrix testing.
- [flutter-ui](skills/flutter/flutter-ui/SKILL.md) — Build performant UIs with strict design tokens, PopScope navigation, and Android 15 edge-to-edge rules.
- [flutter-use-http-package](skills/flutter/flutter-use-http-package/SKILL.md) — Execute standard REST network calls using the built-in HTTP package.
- [flutter-wasm-web](skills/flutter/flutter-wasm-web/SKILL.md) — Compile and optimize web applications for WebAssembly (Wasm-GC).

### GitHub Skills (3)

- [git-commit](skills/github/git-commit/SKILL.md) — Write clean, atomic commits following the Conventional Commits specification.
- [github-actions](skills/github/github-actions/SKILL.md) — Build CI/CD pipelines to run format checks, tests, and build releases.
- [github-pr](skills/github/github-pr/SKILL.md) — Create structured Pull Requests with assignees, labels, and check validations.

---

## Configuration Guidelines

For agents that support project-level guidance (like GitHub Copilot or Codex), we provide:
- `.github/copilot-instructions.md`
- `AGENTS.md`

## License

This library is licensed under the [MIT License](LICENSE).

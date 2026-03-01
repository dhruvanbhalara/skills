---
name: clean-code
description: Clean Code, Dart Guidelines & Documentation
---

# Dart Coding Guidelines

- Write concise, technical Dart code with accurate examples
- Use functional and declarative programming patterns
- Choose descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Keep functions and classes short (< 200 lines, < 10 public methods)
- Always use English for code and documentation
- Use PascalCase for classes, camelCase for variables and functions, snake_case for files, UPPERCASE for constants
- Use arrow syntax for simple methods and expression bodies for one-line getters/setters
- Avoid nesting blocks; prefer early checks and returns
- Pass and return parameters using RO-RO (Receive Object, Return Object)
- Avoid magic numbers; use well-named constants
- Follow an 100-character line limit and use trailing commas for better formatting
- Follow the lint rules set for this project (`all_lint_rules.yaml` and `analysis_options.yaml`)
- **Strong Typing**: Strictly prohibit `dynamic`. Use `Object?` or explicit types.
- **Cascade Pattern**: Use cascade notation (`..`) for cleaner initialization of complex objects where appropriate.
- **Null Safety**: Avoid `!` null assertion operator unless value is guaranteed non-null by control flow. Prefer pattern matching.
- **Switch Expressions**: Prefer exhaustive `switch` expressions (no `break` needed in Dart 3).

# Code Clarity & Maintenance

-   **300-Line Limit**: Strictly flag any file exceeding 300 lines (excluding tests) for decomposition into separate files.
-   **Guard Clauses**: Use early returns (e.g., `if (user == null) return;`) to reduce indentation.
-   **Meaningful Naming**: Use intention-revealing names. Boolean variables MUST use prefixes like `is`, `has`, `should`.
-   **Disposable Lifecycle**: `TextEditingController`, `ScrollController`, `FocusNode`, `StreamSubscription`, `AnimationController`, etc. MUST be `late` initialized in `initState()` and disposed in `dispose()`. Inline initialization is STRICTLY prohibited to prevent memory leaks and ensure proper lifecycle management.
-   **No Print Statements**: STRICTLY prohibit `print()`. Use `AppLogger` for all logging.
-   **Localization**: Zero hardcoded user-facing strings. Use `.arb` files and `context.l10n`.
-   **Reuse**: If a widget or code block is used multiple times, extract it into a common widget or utility. Place shared widgets in `core/views/widgets`.
-   **Library Organization**: Group related classes within the same library file. For large libraries, export smaller private libraries from a single top-level library.

# Anti-Patterns

-   **No Heavy Work in `build()`**: Move sorting, filtering, and expensive computations to `initState()` or `didUpdateWidget()`. Never compute in every rebuild.
-   **No Nested ScrollViews** in the same direction. Use `CustomScrollView` with Slivers instead.
-   **No Unnecessary Containers**: Prefer `SizedBox`, `Padding`, `DecoratedBox` over `Container`.
-   **Widget Extraction**: STRICTLY prohibit private `_build*()` methods that return widgets. Extract into separate widget classes.

# Documentation

-   **No Redundant Comments**: Do not explain WHAT code does. Explain WHY (intent).
-   **Simple & Informative**: Comments MUST be concise, informative, and understandable. Avoid "wall of text".
-   **No History Comments**: STRICTLY prohibit comments like "fixed X" or "updated Y". Git history is the source of truth.
-   Follow official documentation for best practices.
-   Document public classes and methods with clear descriptions, parameters, return values, and a code snippet taken from the codebase
-   Comment briefly only complex logic and non-obvious code decisions

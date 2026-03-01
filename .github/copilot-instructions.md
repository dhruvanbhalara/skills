# Flutter Project Instructions & Best Practices

As an AI agent working on this repository, you MUST adhere to the following core principles and coding standards. These are synthesized from the individual skills in the `skills/` directory.

## Core Tech Stack
- **Language**: Dart 3 (Strong typing, null safety, exhaustive switch expressions)
- **Framework**: Flutter
- **State Management**: BLoC / Cubit (Event-driven, logic separation)
- **Dependency Injection**: `injectable` / `get_it`
- **Architecture**: Clean Architecture (Data → Domain → Presentation)

## Coding Standards
- **Naming**: `PascalCase` for classes, `camelCase` for variables/functions, `snake_case` for files.
- **Strong Typing**: NO `dynamic`. Use `Object?` or explicit types.
- **Conciseness**: Keep files < 300 lines. Keep functions short.
- **Null Safety**: Avoid `!` operator. Prefer pattern matching or early returns.
- **Logging**: Use `AppLogger`. NEVER use `print()` or raw `debugPrint()`.

## Architecture & Data
- **Repository Pattern**: DataSources handle raw IO (Dio, Isar, Firebase). Repositories handle orchestrating and domain mapping.
- **Models**: Use `fromJson`/`toJson` factories. Data models live in `data/` and Domain entities live in `domain/`.
- **Forms**: Manage form state in BLoCs. Use pure validator functions in the domain layer.

## UI & Design System
- **Design Tokens**: ZERO hardcoded colors or spacing. Use `AppColors` and `AppSpacing`.
- **Widget Lifecycle**: Declare controllers/nodes as `late final` in `initState()` and dispose in `dispose()`.
- **Performance**: NO heavy work in `build()`. Mandate isolates for JSON parsing > 1MB.
- **Anti-Patterns**: NO nested ScrollViews in the same direction. NO private `_buildWidget` methods (extract into classes instead).

## Security
- **Sensitive Data**: Use `flutter_secure_storage` for tokens and secrets. NEVER use `SharedPreferences` or source code for sensitive data.
- **Traffic**: All API communication MUST use HTTPS.

## Testing Strategy (100% Coverage)
- **Structure**: All test files MUST strictly mirror the `lib/` directory structure.
- **Mocks**: Use `mocktail` for all dependency mocking.
- **Principles**: 100% logic coverage for domain and bloc layers. Each test must be independent.

## Environment & Flavors
- **Configuration**: Use a single `main.dart`. Feed environment data via `--dart-define-from-file=config/<flavor>.json`.
- **Secrets**: NEVER commit production secrets to Git.

---
> Refer to specific files in `skills/` for detailed rules on Networking, Local Storage, CI/CD, etc.

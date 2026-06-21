---
name: flutter-debugging
description: Debug and profile Flutter applications using DevTools, structured logging, and memory analysis. Use when diagnosing layout issues, tracking performance bottlenecks, or setting up centralized error reporting with Crashlytics.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "tooling"
---

# Logging

-   Use a centralized `AppLogger` class for all logging — NEVER use `print()` or raw `debugPrint()`
-   Define log levels: `verbose`, `debug`, `info`, `warning`, `error`, `fatal`
-   In dev flavor: log everything (verbose and above)
-   In staging: log info and above
-   In production: log warning and above only, route to Crashlytics
-   Include context in logs: `AppLogger.error('Failed to fetch user', error: e, stackTrace: st)`
-   NEVER log sensitive data (passwords, tokens, PII) at any level

# Flutter DevTools

-   Use **Widget Inspector** to debug layout issues and identify unnecessary rebuilds
-   Use **Performance Overlay** (`showPerformanceOverlay: true`) to monitor frame rates
-   Use **Timeline View** to identify jank — target 16ms per frame (60fps)
-   Use **Memory View** to detect memory leaks and monitor allocation patterns
-   Use **Network Profiler** to inspect Dio requests/responses during development

# Debugging Strategies

-   **Layout Issues**: Use `debugPaintSizeEnabled = true` to visualize widget boundaries (see [flutter-devtools](file:///Users/dhruvanbhalara/Desktop/Github%20Projects/skills/skills/flutter/flutter-devtools/SKILL.md)).
-   **Overflow Errors**: Check `RenderFlex overflowed` — use `Expanded`, `Flexible`, or constrain dimensions
-   **Unbounded Height**: Wrap `ListView` in `SizedBox` or use `shrinkWrap: true` with `NeverScrollableScrollPhysics`
-   **Rebuild Tracking**: Add `debugPrint('$runtimeType rebuild')` temporarily to identify excessive rebuilds — remove before commit
-   **Agentic Hot Reload**: In Flutter 3.44+/Dart 3.12+, AI coding agents and MCP servers detect code modifications and trigger hot reload automatically. Keep a debug daemon running (`flutter run`) to enable real-time updates.
-   **Async Errors**: Always catch and log errors in `try-catch` blocks with stack traces
-   Use `assert()` for development-time invariant checks that are stripped in release builds

# Memory Management

-   Dispose ALL controllers, subscriptions, `Timer`, and `AnimationController` in `dispose()`
-   Use `late` initialization in `initState()` — never inline-initialize disposable objects
-   Use `WeakReference` for caches that should not prevent garbage collection
-   Profile memory with DevTools Memory tab — watch for monotonically increasing allocations
-   Watch for common leaks: undisposed listeners, closures capturing `BuildContext`, global streams without cancellation

# Performance Profiling

-   Always profile with `--profile` mode (not debug): `flutter run --profile --flavor dev`
-   Use `Timeline.startSync` / `Timeline.finishSync` for custom performance tracing of critical paths
-   **Impeller Graphics**: Impeller is the default rendering engine on iOS and Android. Pre-compiling shaders (SkSL warmup) is deprecated and no longer needed. If rendering artifacts occur, verify compilation logs in the terminal.
-   Target metrics for displays:
    - **60Hz screens**: < 16.6ms frame build time.
    - **90Hz screens**: < 11.1ms frame build time.
    - **120Hz screens**: < 8.3ms frame build time.
    - Screen transition: < 100ms.
    - Cold start: < 2s.

# Error Boundaries

-   Route errors to Crashlytics in staging/prod (`FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError`)
-   Set `FlutterError.onError` and `PlatformDispatcher.instance.onError` to catch framework and async errors
-   Wrap critical widget subtrees in custom error boundary widgets that show fallback UI instead of red screens
-   In release mode: NEVER show stack traces to users — show user-friendly error messages only

# Runtime Error Taxonomy

Categorize and fix Dart runtime errors systematically using static analysis and type system knowledge.

## Type System Soundness
-   **Method Overrides**: Maintain sound return types (covariant) and parameter types (contravariant). Use `covariant` keyword when intentionally tightening parameter types.
-   **Generics**: Add explicit type annotations to generic classes (`List<int>` not `List<dynamic>`). Never assign `List<dynamic>` to a typed list.
-   **Downcasting**: Avoid implicit downcasts from `dynamic`. Use explicit casts (`as Type`) only when runtime type is guaranteed.
-   **Enable Strict Casts**: Add to `analysis_options.yaml`:
    ```yaml
    analyzer:
      language:
        strict-casts: true
    ```

## Null Safety Error Patterns

| Error | Cause | Fix |
|---|---|---|
| `Property cannot be accessed on nullable receiver` | Accessing member on `Type?` | Use `?.` or null check |
| `Non-nullable instance field must be initialized` | Uninitialized non-null field | Use `late` or make nullable |
| `The argument type can't be assigned` | `Type?` passed where `Type` expected | Add null check or `!` (with caution) |

**Rules**:
-   Avoid `!` operator — prefer pattern matching or early returns.
-   Use `late` only when initialization is guaranteed before first access.
-   Use `_` wildcard (Dart 3.7+) for unused variables.

## Automated Resolution Workflow

```bash
# 1. Identify all errors
dart analyze . --fatal-infos

# 2. Preview automated fixes
dart fix --dry-run

# 3. Apply automated fixes
dart fix --apply

# 4. Verify resolution
dart analyze .
dart test
```

**Feedback Loop**: If `dart test` fails with `TypeError` after fixing → you introduced an invalid cast (`as T`) or accessed an uninitialized `late` variable. Locate and correct.

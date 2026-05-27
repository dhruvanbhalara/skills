---
name: dart-migrate-to-checks-package
description: Migrate test suites from legacy `package:matcher` (using `expect()`) to the modern, fluent, and highly descriptive assertions of `package:checks`.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "testing"
---

## Contents
- [Why Migrate to package:checks](#why-migrate-to-packagechecks)
- [Dependency Management](#dependency-management)
- [Assertion Mapping and Syntax Guidelines](#assertion-mapping-and-syntax-guidelines)
- [Advanced Asynchronous Assertions](#advanced-asynchronous-assertions)
- [Workflow: Executing Syntax Migrations](#workflow-executing-syntax-migrations)
- [Examples](#examples)

## Why Migrate to package:checks

`package:checks` is a modern assertion library maintained by the Dart team that replaces `package:matcher`. It offers several benefits over traditional matchers:

- **Fluent API**: Chain assertions naturally using Dart methods instead of nested helper functions.
- **Type Safety**: Benefit from compiler checks on expected properties, preventing type mismatches in tests.
- **Descriptive Diagnostics**: Read extremely clear failure messages showing exactly what failed and why (e.g. displaying collection differences).

## Dependency Management

To add the checks library to your package:

1. Add `checks` as a `dev_dependency` using the terminal:
   ```bash
   dart pub add dev:checks
   ```
2. Import the main package entrypoint in all migrating test files:
   ```dart
   import 'package:checks/checks.dart';
   ```
3. Remove explicit `package:matcher` dependencies from `pubspec.yaml` (note that `package:test` transitively imports matchers, which is acceptable).

## Assertion Mapping and Syntax Guidelines

Migrate legacy assertions using the following mapping guidelines:

| Scenario | Legacy Matcher (`package:matcher`) | Modern Checks (`package:checks`) |
|---|---|---|
| **Equality** | `expect(value, equals(expected))` | `check(value).equals(expected)` |
| **Identity** | `expect(value, same(expected))` | `check(value).identicalTo(expected)` |
| **Type Check** | `expect(value, isA<Type>())` | `check(value).isA<Type>()` |
| **Nullness** | `expect(value, isNull)` | `check(value).isNull()` |
| **Booleans** | `expect(value, isTrue)` | `check(value).isTrue()` |
| **Containment** | `expect(list, contains(item))` | `check(list).contains(item)` |
| **String Prefixes** | `expect(str, startsWith(prefix))` | `check(str).startsWith(prefix)` |
| **Property checks** | `expect(user.name, equals('Alice'))` | `check(user).has((u) => u.name, 'name').equals('Alice')` |

### Chaining Multiple Checks
Use Dart's cascade operator (`..`) to assert multiple properties on a single subject without writing separate expectation statements:
```dart
check(user)
  ..has((u) => u.name, 'name').equals('Alice')
  ..has((u) => u.age, 'age').isGreaterThan(20);
```

## Advanced Asynchronous Assertions

### 1. Futures
To verify Future resolutions, always `await` the base `check` statement:
```dart
// Verify completion value:
await check(fetchScore()).completes((score) => score.equals(100));

// Verify throws error:
await check(failingTask()).throws<HttpException>().has((e) => e.statusCode, 'statusCode').equals(500);
```

### 2. Streams
To assert multiple sequential items emitted by a Stream, wrap the target stream in a `StreamQueue` from `package:async`:
```dart
import 'package:async/async.dart';

final queue = StreamQueue(eventStream);
await check(queue).emits((event) => event.equals('first_event'));
await check(queue).emits((event) => event.equals('second_event'));
```

## Workflow: Executing Syntax Migrations

Follow this checklist when migrating your test suite:

- [ ] **Dependency Setup**: Install `dev:checks` and run `dart pub get`.
- [ ] **Find target files**: Locate test files containing traditional `expect()` calls.
- [ ] **Update imports**: Replace matcher imports or add `import 'package:checks/checks.dart'`.
- [ ] **Convert simple cases**: Map basic equalities and type matches from `expect` to `check`.
- [ ] **Optimize with cascades**: Group multiple assertions targeting the same object into cascades.
- [ ] **Update async calls**: Rewrite asynchronous Future/Stream checks to use `await` and `completes()` closures.
- [ ] **Validate compiler checks**: Run `dart analyze` to resolve any type mismatch warnings.
- [ ] **Execute tests**: Run `dart test` to verify that all migrated assertions execute successfully.

## Examples

### Migration Comparison

This example demonstrates migrating a complete, high-fidelity user profile test case from legacy matcher syntax to modern checks syntax.

```dart
// --- Legacy Matcher Assertion Style ---
import 'package:test/test.dart';

class Account {
  final String email;
  final List<String> tags;
  Account(this.email, this.tags);
}

void badTest() {
  final account = Account('alice@test.com', ['admin', 'premium']);

  expect(account.email, equals('alice@test.com'));
  expect(account.tags, contains('admin'));
  expect(account.tags.length, equals(2));
}

// --- Modern Checks Assertion Style ---
import 'package:checks/checks.dart';

void goodTest() {
  final account = Account('alice@test.com', ['admin', 'premium']);

  // Chain validations cleanly using cascades and property extractors
  check(account)
    ..has((a) => a.email, 'email').equals('alice@test.com')
    ..has((a) => a.tags, 'tags').contains('admin')
    ..has((a) => a.tags.length, 'tags length').equals(2);
}
```

### Testing Exceptions and Future Completions

```dart
import 'package:checks/checks.dart';
import 'package:test/test.dart';

Future<String> fetchRole(bool fail) async {
  await Future.delayed(const Duration(milliseconds: 10));
  if (fail) throw StateError('Fetch failed');
  return 'Manager';
}

void main() {
  group('Asynchronous Tests', () {
    test('verifies successful completion', () async {
      await check(fetchRole(false)).completes(
        (role) => role.equals('Manager'),
      );
    });

    test('verifies throwing specific state errors', () async {
      await check(fetchRole(true)).throws<StateError>().has(
        (e) => e.message, 'message',
      ).equals('Fetch failed');
    });
  });
}
```

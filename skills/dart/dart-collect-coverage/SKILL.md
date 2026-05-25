---
name: dart-coverage
description: Collect test coverage, generate LCOV/HTML reports, and apply coverage ignore directives. Use when measuring test coverage, setting up coverage gates in CI, or generating coverage reports for Dart and Flutter projects.
metadata:
    platforms: "dart, flutter"
    languages: "dart"
    category: "testing"
---

## Contents
- [Setup](#setup)
- [Automated Collection](#automated-collection)
- [Flutter-Specific Coverage](#flutter-specific-coverage)
- [Manual VM Service Workflow](#manual-vm-service-workflow)
- [Coverage Ignore Directives](#coverage-ignore-directives)
- [CI Integration](#ci-integration)
- [Workflow: Generating Coverage Reports](#workflow-generating-coverage-reports)
- [Examples](#examples)

## Setup

Add `coverage` strictly as a `dev_dependency`:

**Dart project:**
```bash
dart pub add dev:coverage
```

**Flutter project:**
```bash
flutter pub add dev:coverage
```

## Automated Collection

Use the bundled `test_with_coverage` script for one-command coverage:

```bash
dart run coverage:test_with_coverage
```

This automatically:
1.  Runs all tests
2.  Collects JSON coverage from the Dart VM
3.  Formats into LCOV report at `coverage/lcov.info`

**Monorepo support** — specify test directories explicitly:
```bash
dart run coverage:test_with_coverage -- pkgs/foo/test pkgs/bar/test
```

## Flutter-Specific Coverage

### Generate LCOV
```bash
flutter test --coverage
```
Outputs `coverage/lcov.info` at project root.

### Generate HTML Report
```bash
# Install lcov (macOS)
brew install lcov

# Generate HTML from LCOV
genhtml coverage/lcov.info -o coverage/html

# Open in browser
open coverage/html/index.html
```

### Filter Out Generated Code
```bash
lcov --remove coverage/lcov.info \
  '*.g.dart' \
  '*.freezed.dart' \
  '*.part.dart' \
  -o coverage/lcov_cleaned.info
```

## Manual VM Service Workflow

For granular control over coverage collection (branch/function-level):

### 1. Run Tests with VM Service
```bash
dart run --pause-isolates-on-exit \
  --disable-service-auth-codes \
  --enable-vm-service=8181 \
  test &
```

### 2. Collect Raw Coverage
```bash
dart run coverage:collect_coverage \
  --wait-paused \
  --uri=http://127.0.0.1:8181/ \
  -o coverage/coverage.json \
  --resume-isolates \
  --function-coverage \
  --branch-coverage
```

Optional flags:
-   `--function-coverage` — function-level metrics (Dart VM 2.17.0+)
-   `--branch-coverage` — branch-level metrics (Dart VM 2.17.0+)

### 3. Format to LCOV
```bash
dart run coverage:format_coverage \
  --packages=.dart_tool/package_config.json \
  --lcov \
  -i coverage/coverage.json \
  -o coverage/lcov.info \
  --check-ignore
```

## Coverage Ignore Directives

Exclude specific code from coverage metrics using inline comments. Pass `--check-ignore` during formatting to enforce.

| Directive | Scope | Usage |
|---|---|---|
| `// coverage:ignore-line` | Single line | Unreachable branches, platform checks |
| `// coverage:ignore-start` / `// coverage:ignore-end` | Block | Generated code, legacy methods |
| `// coverage:ignore-file` | Entire file | Generated files, config files |

```dart
// coverage:ignore-file
// This entire file is excluded from coverage

class GeneratedRoutes {
  // coverage:ignore-start
  void legacyInit() {
    print('Deprecated initialization');
  }
  // coverage:ignore-end

  bool isProduction(String env) {
    if (env == 'prod') return true;
    return false; // coverage:ignore-line
  }
}
```

## CI Integration

### GitHub Actions Coverage Gate
```yaml
- name: Run tests with coverage
  run: flutter test --coverage

- name: Check coverage threshold
  run: |
    COVERAGE=$(lcov --summary coverage/lcov.info 2>&1 | grep "lines" | awk '{print $2}' | sed 's/%//')
    echo "Coverage: $COVERAGE%"
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Coverage below 80% threshold!"
      exit 1
    fi

- name: Upload coverage
  uses: codecov/codecov-action@v4
  with:
    files: coverage/lcov.info
```

### Coverage Targets (from AGENTS.md)
-   **100% logic coverage** for `domain` and `bloc` layers.
-   **Widget coverage** for all major UI components.
-   Use `// coverage:ignore-file` for generated code (`.g.dart`, `.freezed.dart`).

## Workflow: Generating Coverage Reports

### Task Progress
- [ ] **Step 1**: Add `coverage` to `dev_dependencies`.
- [ ] **Step 2**: Run `flutter test --coverage` (or `dart run coverage:test_with_coverage`).
- [ ] **Step 3**: Validate `coverage/lcov.info` exists.
- [ ] **Step 4**: Filter generated code: `lcov --remove ... '*.g.dart' '*.freezed.dart'`.
- [ ] **Step 5**: Generate HTML: `genhtml coverage/lcov.info -o coverage/html`.
- [ ] **Step 6**: Review uncovered files — add tests or `// coverage:ignore-file`.
- [ ] **Step 7**: Add coverage gate to CI pipeline (80% minimum).

## Examples

### pubspec.yaml Configuration
```yaml
name: my_app
environment:
  sdk: ^3.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  coverage: ^1.15.0
  bloc_test: ^9.1.0
  mocktail: ^1.0.0
```

### Quick Coverage Check Script
```bash
#!/bin/bash
# scripts/coverage.sh
set -e

echo "Running tests with coverage..."
flutter test --coverage

echo "Filtering generated code..."
lcov --remove coverage/lcov.info \
  '*.g.dart' '*.freezed.dart' '*.part.dart' \
  -o coverage/lcov_cleaned.info

echo "Generating HTML report..."
genhtml coverage/lcov_cleaned.info -o coverage/html

echo "Opening report..."
open coverage/html/index.html
```

---
name: dart-run-static-analysis
description: Configure project linter rules, configure `analysis_options.yaml`, enforce strict static type checking, and manage fine-grained file or line-level diagnostic suppressions.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "analysis"
---

## Contents
- [Analysis Configuration](#analysis-configuration)
- [Diagnostic Suppression Rules](#diagnostic-suppression-rules)
- [Workflow: Running Static Analysis](#workflow-running-static-analysis)
- [Workflow: Applying Automated Code Fixes](#workflow-applying-automated-code-fixes)
- [Examples](#examples)

## Analysis Configuration

Enforce strict formatting, stylistic cleanliness, and code sanity by configuring `analysis_options.yaml` in the root of your Dart package:

- **Inheriting Lints**: Inherit a baseline recommended rule set using the `include` directive. Prefer `package:lints/recommended.yaml` for pure Dart packages or `package:flutter_lints/flutter.yaml` for Flutter applications.
- **Strict Type Checking**: Explicitly declare strict static types under the `analyzer: language:` configuration to eliminate unsafe dynamic types:
  ```yaml
  analyzer:
    language:
      strict-casts: true
      strict-inference: true
      strict-raw-types: true
  ```
- **Linter Rules Customization**: Customize specific rules under `linter: rules:`. Use a map key structure (`rule_name: true/false`) to explicitly activate or deactivate rules when overriding an inherited configuration.
- **Auto-Formatting Options**: Declare formatter parameters under the `formatter:` node (e.g. configuring `page_width: 80`).

## Diagnostic Suppression Rules

When an analyzer warning or style lint yields a false positive or hits generated files, suppress the warning explicitly using one of these strategies:

- **Exclusion Filters**: Exclude entire files or directory trees (such as JSON generated models or internationalization files) from analysis under the `analyzer: exclude:` list using standard glob patterns:
  ```yaml
  analyzer:
    exclude:
      - "lib/generated/**"
      - "**/*.g.dart"
  ```
- **File-Level Suppressions**: Add `// ignore_for_file: diagnostic_name` on a dedicated line at the absolute top of the Dart file to disable specific rules across the entire file context.
- **Line-Level Suppressions**: Add `// ignore: diagnostic_name` on the line directly preceding the target statement, or appended at the end of the matching line.
- **Pubspec Suppressions**: Suppress package dependency warnings within the `pubspec.yaml` by injecting comments (e.g. `# ignore: sort_pub_dependencies`).

## Workflow: Running Static Analysis

Follow this checklist to perform static code auditing:

- [ ] **Establish analysis config**: Ensure `analysis_options.yaml` exists at the project root.
- [ ] **Run analysis**: Run the analyzer from the terminal:
  ```bash
  dart analyze .
  ```
- [ ] **Escalate infos to fatal**: In CI/CD pipelines, ensure informational lints fail the build by appending the fatal flag:
  ```bash
  dart analyze . --fatal-infos
  ```
- [ ] **Triage diagnostics**: Review warnings, correcting type hierarchies or unused variables, or applying suppressions where appropriate.

## Workflow: Applying Automated Code Fixes

Follow this checklist to apply mechanical quick-fixes automatically:

- [ ] **Verify lints**: Confirm that the target linter rules are enabled in `analysis_options.yaml`.
- [ ] **Dry run check**: Run a dry run to inspect proposed mechanical modifications:
  ```bash
  dart fix --dry-run
  ```
- [ ] **Apply fixes**: Apply the quick-fixes directly across the workspace:
  ```bash
  dart fix --apply
  ```
- [ ] **Format code**: Format the modified code files:
  ```bash
  dart format .
  ```
- [ ] **Re-run analysis**: Confirm that `dart analyze` reports clean results.

## Examples

### Comprehensive `analysis_options.yaml` Template

```yaml
include: package:lints/recommended.yaml

analyzer:
  exclude:
    - "lib/generated/**"
    - "**/*.g.dart"
    - "**/*.freezed.dart"
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true
  errors:
    todo: ignore
    missing_required_param: error
    missing_return: error

linter:
  rules:
    always_declare_return_types: true
    avoid_empty_else: true
    prefer_const_constructors: true
    sort_pub_dependencies: false

formatter:
  page_width: 100
  trailing_commas: preserve
```

### Inline Suppression Techniques

```dart
// 1. Suppress all instances of unused variables inside this specific file
// ignore_for_file: unused_local_variable

void calculateMetrics() {
  // 2. Suppress a single line using a preceding comment ignore
  // ignore: invalid_assignment
  int x = 'not_an_int';

  final unusedString = 'value'; // File-level ignore handles this
  
  // 3. Suppress at the end of the line
  final double pi = 3.14; // ignore: constant_identifier_names
}
```

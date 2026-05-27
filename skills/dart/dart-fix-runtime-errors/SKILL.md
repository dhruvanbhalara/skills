---
name: dart-fix-runtime-errors
description: Uses static analysis diagnostics and custom handling patterns for null safety, dynamic lists, contravariance overrides, and unrecoverable errors.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "analysis"
---

## Contents
- [Type System and Soundness](#type-system-and-soundness)
- [Null Safety and Variable Initialization](#null-safety-and-variable-initialization)
- [Error and Exception Handling](#error-and-exception-handling)
- [Workflow: Resolving Static Analysis and Runtime Failures](#workflow-resolving-static-analysis-and-runtime-failures)
- [Examples](#examples)

## Type System and Soundness

Dart enforces a sound type system to ensure that variables match their compile-time types at runtime. To prevent runtime type errors:

- **Method Overrides**: Ensure subclass overrides maintain covariant return types and contravariant parameter types. Never tighten parameter types in a subclass unless explicitly using the `covariant` keyword to override safety checks.
- **Generics and Collection Types**: Avoid assigning untyped collections (like `List<dynamic>`) directly to strongly typed targets. Always provide explicit generic parameters (e.g. `List<String>`) during list or map initialization.
- **Explicit Downcasting**: Avoid implicit downcasts from `dynamic` values. Use explicit type casting (e.g. `as List<Map<String, dynamic>>`) only when the underlying structure is guaranteed to match.
- **Strict Configuration**: Enable strict casting configurations in your project's `analysis_options.yaml` to enforce explicit casts and catch dynamic typing bugs during code analysis:
  ```yaml
  analyzer:
    language:
      strict-casts: true
  ```

## Null Safety and Variable Initialization

Properly manage variable states to avoid compile-time analyzer errors and runtime null pointer exceptions:

- **Nullable Indicators**: Append `?` to types that are permitted to hold null values. Use `!` only when asserting that a value is definitively non-null.
- **Late Initialization**: Apply the `late` keyword only when the variable is guaranteed to be initialized before its first access. If a late variable is accessed before initialization, a `LateInitializationError` is thrown at runtime.
- **Wildcard Variables**: Use a single underscore `_` (supported in modern Dart versions) to declare local parameters or variables that are intentionally unread, satisfying unused variable lints.

## Error and Exception Handling

Distinguish between recoverable app failures (Exceptions) and unrecoverable bugs (Errors):

- **Catching Exceptions**: Implement try-catch blocks to catch and handle subclasses of `Exception` (e.g. `FormatException`, `SocketException`). These represent expected runtime failures that the application should handle gracefully.
- **Avoid Catching Errors**: Do not catch `Error` or its subclasses (e.g. `TypeError`, `RangeError`). Errors represent coding bugs that must be corrected during development, not suppressed at runtime.
- **Rethrowing**: When catching an exception to perform logging or cleanup, always use the `rethrow` keyword instead of throwing the caught exception again. `rethrow` preserves the original stack trace.

## Workflow: Resolving Static Analysis and Runtime Failures

Follow this checklist to identify, correct, and verify static and runtime bugs:

- [ ] **Run static analyzer**: Execute `dart analyze . --fatal-infos` in the project root.
- [ ] **Apply automated fixes**: Preview and apply mechanical adjustments using:
  ```bash
  dart fix --dry-run
  dart fix --apply
  ```
- [ ] **Identify manual fixes**: Address complex warnings:
  - If a nullability conflict is reported: Assess the business logic, specify defaults using the coalescing operator `??`, or use the null-aware chain `?.`.
  - If a covariant mismatch is reported: Adjust subclass parameters or apply the `covariant` modifier.
- [ ] **Test execution**: Run `dart test` or `flutter test` to ensure runtime soundness.
- [ ] **Verify late state changes**: Inspect stack traces if a `TypeError` or `LateInitializationError` occurs at runtime, correcting initialization flows.

## Examples

### Correcting Dynamic List Assignments

```dart
// Fails Static Analysis due to List<dynamic> assignment:
void printScores(List<int> scores) => print(scores);

void badMain() {
  final scores = []; // Inferred as List<dynamic>
  scores.add(90);
  printScores(scores); // Error: List<dynamic> cannot be assigned to List<int>
}

// Corrected Implementation:
void goodMain() {
  final scores = <int>[]; // Explicitly typed
  scores.add(90);
  printScores(scores); // Compiles and runs safely
}
```

### Method Overrides and Covariants

```dart
class Worker {
  void performTask(Task t) {}
}

// Fails Static Analysis: Tightening parameter type from Task to CodingTask
class SoftwareEngineer extends Worker {
  @override
  void performTask(CodingTask t) {} 
}

// Corrected Implementation using the covariant keyword:
class LeadSoftwareEngineer extends Worker {
  @override
  void performTask(covariant CodingTask t) {} 
}
```

### Safely Managing Late Initializations

```dart
class DatabaseClient {
  // Late keyword defers null safety checks to runtime
  late final String connectionString;

  void initialize(String url) {
    connectionString = url;
  }

  void connect() {
    // If connect() is called before initialize(), this throws a LateInitializationError
    print('Connecting to $connectionString');
  }
}
```

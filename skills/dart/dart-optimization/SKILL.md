---
name: dart-optimization
description: Master Dart/Flutter performance optimization, efficient code patterns, error handling, and type safety.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "optimization"
---

# Optimization & Debugging

Performance in Dart goes beyond UI rendering; it's about efficient execution, smart resource utilization, and sound error handling.

## Dart Performance Patterns
- **Standardize Types**: Avoid `dynamic`. Use explicit types or `Object?`. Statically typed code allows the compiler to perform far better optimizations.
- **Efficient Collections**:
  - Use `Set` for average O(1) containment checks.
  - Use `List` for ordered indexing.
  - Prefer `Iterable` methods (`map`, `where`) for readability, but use `for` loops in performance-critical hot paths.
- **Inlining**: Small getters and trivial functions are often inlined by the VM/AOT, but keeping them simple ensures this optimization happens.

## Compile-Time Optimizations
- **Final & Const**: Declare variables as `final` whenever possible. Use `const` constructors for widgets and data models to enable compile-time allocation and reduce runtime garbage collection pressure.
- **Ternary vs If-Else**: In Dart, they are generally equivalent, but prioritize readability. Use `switch` expressions (Dart 3+) for exhaustive and efficient pattern matching.

## Hot Paths & Loops
- **Minimize Work in Loops**: Extract calculations and object creations outside of loops.
- **Collection Literals**: Use literal syntax `[]` or `{}` instead of constructors like `List()` for brevity and minor performance gains.

## Type System & Soundness
Enforce Dart's sound type system to prevent runtime invalid states. 
- **Method Overrides:** Maintain sound return types (covariant) and parameter types (contravariant). Never tighten a parameter type in a subclass unless explicitly marked with the `covariant` keyword.
- **Generics & Collections:** Add explicit type annotations to generic classes (e.g., `List<T>`). Never assign a `List<dynamic>` to a typed list.
- **Downcasting:** Avoid implicit downcasts from `dynamic`. Use explicit casts (e.g., `as List<Cat>`) when necessary, but ensure the underlying runtime type matches to prevent `TypeError` exceptions.
- **Strict Casts:** Enable `strict-casts: true` in `analysis_options.yaml` to force explicit casting and catch implicit downcast errors at compile time.

## Null Safety & Error Handling
Eliminate static errors related to null safety by correctly managing variable initialization and nullability.
- **Modifiers:** Apply `?` for nullable types, `!` for null assertions, and `required` for named parameters that cannot be null.
- **Late Initialization:** Use the `late` keyword for non-nullable variables guaranteed to be initialized before use.
- **Catching:** Catch `Exception` subtypes for recoverable failures. 
- **Errors:** Never explicitly catch `Error` or its subtypes (e.g., `TypeError`, `ArgumentError`). Errors indicate programming bugs that must be fixed, not caught.
- **Rethrowing:** Use `rethrow` inside a `catch` block to propagate an exception while preserving its original stack trace.

## Profiling & Debugging
- **DevTools CPU Profiler**: Identify hot paths and "heavy" functions.
- **Benchmarking**: Use `package:benchmark_harness` for scientific performance measurement of non-UI logic.
- **Hot Reload vs Restart**: Use hot reload for UI changes. For state initialization or deep logic changes that cause runtime errors, use hot restart to clear the state tree.

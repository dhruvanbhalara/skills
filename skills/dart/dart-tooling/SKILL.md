---
name: dart-tooling
description: Run Dart tooling workflows for static analysis, dependency conflict resolution, and test migration to package:checks. Use when fixing analyzer errors, resolving pub dependency conflicts, or modernizing test assertions.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "tooling"
---

# Dart Tooling & Package Workflows

## Contents
- [Static Analysis Resolution](#static-analysis-resolution)
- [Resolving Package Conflicts](#resolving-package-conflicts)
- [Migrating Tests to package:checks](#migrating-tests-to-packagechecks)

## Static Analysis Resolution

Use this sequential workflow to identify, fix, and verify static analysis errors in a Dart project.
1. **Run Static Analyzer**: `dart analyze . --fatal-infos`
2. **Apply Automated Fixes**: 
   - `dart fix --dry-run`
   - `dart fix --apply`
3. **Resolve Manually**: Address Type Mismatches, Null Safety, or Invalid Overrides that `dart fix` couldn't automatically resolve.
4. **Verify**: Ensure both `dart analyze .` and `dart test` pass.

## Resolving Package Conflicts

When adding or upgrading dependencies, conflicts can occur if transitive dependencies require incompatible versions of shared packages.
1. **Analyze Constraints**: Read the error message carefully. Identify the direct dependency you are trying to add/upgrade and the existing dependencies that share a transitive dependency.
2. **Determine Shared Constraints**: Find the overlapping version range for the shared transitive dependency.
3. **Apply `dependency_overrides`**: Add a temporary override in `pubspec.yaml` using the highest common compatible version.
    ```yaml
    dependency_overrides:
      shared_package: ^x.y.z
    ```
4. **Run `flutter pub get` or `dart pub get`**: Ensure the resolution succeeds.
5. **Update Direct Dependencies**: Eventually, upgrade the direct dependencies to versions that natively support the newer transitive package, and remove the override.

## Migrating Tests to package:checks

Transition test assertions from the `package:matcher` syntax to the literate API provided by `package:checks` for more readable output.
- **Dependency**: Add `dev_dependency` `checks` via `dart pub add dev:checks`.
- **Basic Equality:** Replace `expect(actual, equals(expected))` with `check(actual).equals(expected)`.
- **Type Checking:** Replace `expect(actual, isA<Type>())` with `check(actual).isA<Type>()`.
- **Asynchronous Expectations:** 
  - `await check(Future.value(10)).completes((it) => it.equals(10));`
- **Workflow**:
  1. Add `package:checks` and import `package:checks/checks.dart`.
  2. Rewrite `expect()` calls to `check()`.
  3. Run static analyzer and tests to verify.

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

When `pub get` fails due to incompatible package versions, use this systematic approach.

### Understanding `dart pub outdated`

| Column | Meaning |
|---|---|
| **Current** | Version in `pubspec.lock` right now |
| **Upgradable** | Latest version allowed by `pubspec.yaml` constraints |
| **Resolvable** | Latest version that CAN be resolved with all other deps |
| **Latest** | Latest published version (ignoring constraints) |

```bash
dart pub outdated
```

### Version Constraint Best Practices
-   **Use Caret Syntax**: Always use `^1.2.3` — allows non-breaking updates up to next major version.
-   **Tighten Dev Dependencies**: Set lower bounds to exact current version for `dev_dependencies`.
-   **CI Reproducibility**: Use `dart pub get --enforce-lockfile` in CI to ensure exact tested versions.

### Upgrading Dependencies

**If updating to "Upgradable" versions:**
```bash
dart pub upgrade
dart pub upgrade --tighten  # Auto-update lower bounds in pubspec.yaml
```

**If updating to "Resolvable" versions (major):**
1.  Manually edit `pubspec.yaml` to bump constraints.
2.  Run `dart pub upgrade`.
3.  Run `dart analyze` → fix breaking API changes.
4.  Run `dart test` → fix regressions.

### Surgical Lockfile Removal

**NEVER** delete the entire `pubspec.lock`. This causes uncontrolled upgrades across the dependency graph.

Instead, remove ONLY the conflicting package's block:
1.  Open `pubspec.lock`.
2.  Find and delete ONLY the conflicting package's YAML block.
3.  Run `dart pub get` — fetches newest compatible version for that package only.
4.  Verify: `dart pub deps` → check dependency graph resolves correctly.

### Temporary Overrides (Last Resort)
```yaml
dependency_overrides:
  shared_package: ^x.y.z  # Remove once direct deps support newer version
```

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

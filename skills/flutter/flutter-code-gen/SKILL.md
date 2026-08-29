---
name: flutter-code-gen
description: Use when generating immutable data models, JSON serialization, or dependency injection bindings using build_runner.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "tooling"
---

# Code Generation Guidelines

- Generate code for:
  - Mappable classes
  - JSON serialization
  - Other generated code
- Use this command for code generation:
  `dart run build_runner build --delete-conflicting-outputs`
- Run code generation after:
  - Adding new Mappable classes
  - Modifying existing Mappable classes

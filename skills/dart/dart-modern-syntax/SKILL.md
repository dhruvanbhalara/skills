---
name: dart-modern-syntax
description: Guide for utilizing Dart 3.0+ up to 3.12 syntax updates (private named parameters, extension types, records, pattern matching, wildcard variables, and primary constructors).
metadata:
    platforms: "dart"
    languages: "dart"
    category: "language"
---

# Modern Dart Syntax (Dart 3.0 - 3.12+)

Leverage the latest syntax features introduced in Dart 3.x to write clean, concise, type-safe, and highly optimized code.

## Contents
- [Private Named Parameters](#private-named-parameters)
- [Extension Types](#extension-types)
- [Wildcards for Unused Elements](#wildcards-for-unused-elements)
- [Records and Pattern Matching](#records-and-pattern-matching)
- [Primary Constructors](#primary-constructors)

---

## Private Named Parameters

*Introduced in Dart 3.12*

Dart now supports initializing private fields directly using named parameters in constructors. This removes the need for manual assignments in the initializer list.

### Usage
- When declaring a named constructor parameter, prefix the private field name with `this.`:
- The compiler automatically strips the leading underscore (`_`) at the call site.

```dart
class User {
  final String _name;
  final int _age;

  // Initializing private fields directly
  User({
    required String this._name,
    required int this._age,
  });

  String get name => _name;
  int get age => _age;
}

void main() {
  // Call site does NOT include the underscore
  final user = User(name: 'Alice', age: 30);
  print(user.name); // Alice
}
```

---

## Extension Types

*Introduced in Dart 3.3*

Extension types are compile-time-only wrapper classes around an underlying representation type. They provide a zero-cost abstraction, meaning they do not allocate wrapper objects in memory at runtime, unlike standard classes.

### Rules & Patterns
- Expose a new interface for an existing type without runtime allocation overhead.
- Declare using `extension type Name(RepresentationType value)`.
- Use when designing performance-sensitive APIs, domain-specific ID wrappers, or when wrapping JS interop objects.

```dart
// Exposes a zero-cost wrapper around an integer
extension type Id(int value) {
  // Add custom helper methods
  bool get isValid => value > 0;
}

// Wrapping a list to restrict available methods
extension type IntList(List<int> list) {
  int get head => list.first;
  
  void printSummary() {
    print('Length: ${list.length}, Head: $head');
  }
}

void main() {
  final myId = Id(42); // Zero overhead, compiled directly to 42
  print(myId.isValid); // true
}
```

---

## Wildcards for Unused Elements

*Introduced in Dart 3.7*

You can use the wildcard `_` to denote unused elements. This prevents linter warnings and clearly signals to other developers (and AI agents) that a variable or import is intentionally ignored.

### Wildcard Scopes
- **Unused Parameters**: Use `_` (and `__`, `___` if nesting) in callbacks.
- **Unused Local Variables**: Declare variables as `_` if they are only needed to trigger side effects.
- **Unused Imports**: Import a package as `_` to run its initialization logic without binding names.

```dart
import 'package:init_library/init.dart' as _;

void processItems() {
  final items = ['apple', 'banana', 'orange'];
  
  // Wildcards in list mapping
  final indexed = items.mapIndexed((index, _) => 'Item $index');
  
  // Wildcard for unused exception variable
  try {
    performDangerousTask();
  } catch (_) {
    print('Failed to perform task.');
  }
}
```

---

## Records and Pattern Matching

*Introduced in Dart 3.0*

Records allow returning multiple values from a function without the boilerplate of a custom class. Pattern matching extracts those values or destructures objects cleanly.

### Syntactic Best Practices
- **Positional Records**: `(double, double) getCoordinates() => (37.77, -122.41);`
- **Named Records**: `({String name, int age}) getDetails() => (name: 'Bob', age: 25);`
- **Destructuring**: Assign directly to matching structures:

```dart
// 1. Positional Record Destructuring
final (lat, lng) = getCoordinates();

// 2. Named Record Destructuring
final (name: userName, age: userAge) = getDetails();

// 3. Object Destructuring with Patterns
if (user case User(name: final name, age: > 18)) {
  print('$name is an adult');
}
```

---

## Primary Constructors

*Introduced in Dart 3.12 (Experimental)*

Primary constructors provide a concise syntax for defining classes with automatic field declarations and assignments, similar to other modern languages.

```dart
// Shorthand for immutable data structures
class Point(int x, int y);

// Equivalent to:
// class Point {
//   final int x;
//   final int y;
//   Point(this.x, this.y);
// }
```

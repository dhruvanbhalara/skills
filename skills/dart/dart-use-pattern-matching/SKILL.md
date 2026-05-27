---
name: dart-use-pattern-matching
description: Leverage switch expressions and Dart 3+ pattern matching to build clean, exhaustive, and type-safe control flows for algebraic data types, JSON parsing, and variable destructuring.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "logic"
---

## Contents
- [Pattern Selection Strategy](#pattern-selection-strategy)
- [Switch Expressions vs Switch Statements](#switch-expressions-vs-switch-statements)
- [Core Pattern Syntaxes](#core-pattern-syntaxes)
- [Workflow: Designing Pattern Matching Logic](#workflow-designing-pattern-matching-logic)
- [Examples](#examples)

## Pattern Selection Strategy

Apply distinct pattern matching strategies based on the target data structure:

- **JSON Validation and Destructuring**: Use Map and List patterns to simultaneously validate nested shapes and bind values to local variables in a single step.
- **Multiple Returns**: Return Records from functions and use Record patterns to destructure named or positional values directly into scoped variables.
- **Algebraic Data Types (ADTs)**: Combine `sealed` class hierarchies with Object patterns in switch expressions to benefit from compile-time exhaustiveness checking.
- **Numeric Ranges and logical Checks**: Combine relational patterns (`>=`, `<`, etc.) and logical-and (`&&`) or logical-or (`||`) operators within switch cases.
- **Guard Clauses**: Use the `when` keyword to assert dynamic conditions that cannot be expressed purely through static patterns.

## Switch Expressions vs Switch Statements

Choose the correct switch construct based on the operational context:

### Switch Expressions
- **When to Use**: When the switch construct must resolve to and return a single value.
- **Syntax**: `final result = switch (value) { pattern => expression, _ => fallback };`
- **Rule**: Every case must resolve to an expression (no statements or code blocks). The cases must be exhaustive (checked by the compiler). Implicit fallthrough is not supported.

### Switch Statements
- **When to Use**: When the switch construct must execute side effects, statements, or complex code blocks.
- **Syntax**: 
  ```dart
  switch (value) {
    case pattern:
      // statements
      break; // Implicitly breaks, but can be added explicitly
  }
  ```
- **Rule**: Empty cases fall through. Non-empty cases do not implicitly fall through.

## Core Pattern Syntaxes

Understand and apply standard Dart 3+ pattern syntaxes:

- **Logical-or (`||`)**: Combines patterns. Matches if either pattern succeeds. Both branches must define identical sets of variables.
- **Logical-and (`&&`)**: Matches if both patterns succeed. Branches must not define overlapping variables.
- **Relational**: Evaluates against constants using comparative operators (e.g. `> 100`, `!= 0`).
- **Cast (`as`)**: Asserts type transformations during destructuring (throws if type check fails).
- **Null-check (`?`)**: Filters out null values and binds variables to their non-nullable base types.
- **Null-assert (`!`)**: Asserts that a value is non-nullable (throws if null).
- **List Pattern**: Matches arrays of specific length (e.g. `[var first, var second]`). Use a rest element (`...`) to ignore trailing list elements.
- **Map Pattern**: Matches key-value targets (e.g. `{'id': var id}`). Ignores keys that are not explicitly matched.
- **Object Pattern**: Matches class instances and extracts property values (e.g. `User(:final name)`).

## Workflow: Designing Pattern Matching Logic

Follow this checklist to implement clean pattern matching structures:

- [ ] **Determine the structure**: Identify if the source is an Enum, a Sealed Class hierarchy, a Record, or raw JSON.
- [ ] **Select switch structure**: Choose Switch Expressions for value assignments, or Switch Statements for side effects.
- [ ] **Define case bindings**: Construct explicit Map, List, or Object patterns to extract needed fields into scoped variables.
- [ ] **Inject guards**: Add `when` expressions for conditional boundary checks.
- [ ] **Verify exhaustiveness**: If using a sealed class or enum, let the compiler enforce exhaustiveness. If using open types, include a wildcard `_` fallback.
- [ ] **Validate compiler output**: Run `dart analyze` to ensure there are no unhandled cases or type mismatches.

## Examples

### JSON Validation and Parsing

Validate structure and extract values in a single step using map destructuring.

```dart
void processPayload(Map<String, dynamic> payload) {
  if (payload case {'status': 'success', 'data': [String title, int count]}) {
    print('Product: $title, Inventory: $count');
  } else {
    print('Invalid payload structure received');
  }
}
```

### Exhaustive Sealed Class Matching

Leverage sealed classes to force exhaustive compile-time verification when executing domain logic.

```dart
sealed class NetworkState {}

class NetworkIdle extends NetworkState {}
class NetworkLoading extends NetworkState {}
class NetworkSuccess extends NetworkState {
  final String response;
  NetworkSuccess(this.response);
}
class NetworkFailure extends NetworkState {
  final String error;
  NetworkFailure(this.error);
}

// Compiler guarantees all sub-states are handled without requiring a default fallback
String getStatusMessage(NetworkState state) {
  return switch (state) {
    NetworkIdle() => 'Waiting to connect...',
    NetworkLoading() => 'Loading data...',
    NetworkSuccess(:final response) => 'Data loaded: $response',
    NetworkFailure(:final error) => 'Failed: $error',
  };
}
```

### Record Destructuring and Swapping

```dart
// Destructuring a positional and named return record:
(String name, {int age}) getUser() => ('Alice', age: 30);

void main() {
  final (name, age: userAge) = getUser();
  print('$name is $userAge years old');

  // Value swapping without temp variables:
  var (x, y) = (1, 2);
  (y, x) = (x, y);
}
```

---
name: dart-logic-patterns
description: Apply efficient algorithms, data structures, and Dart 3 pattern matching for clean business logic. Use when implementing search, sorting, debouncing, memoization, or exhaustive control flow in domain layers.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "logic"
---

# Algorithms & Logic

The efficiency of your business logic directly impacts battery life and responsiveness.

## Complexity Analysis
- **Big O Awareness**: Understand the cost of your operations. Avoid O(n²) or higher on the main thread for datasets larger than a few hundred items.
- **Data Structure Selection**:
  - `Map`: Fast key-based lookups.
  - `Set`: Fast unique item management.
  - `List`: Fast indexing and sequential access.
  - `LinkedHashSet/Map`: Preserves insertion order while providing fast lookups.

## Logic Patterns
- **Debouncing**: Delay execution until a user stops interacting (e.g., search-as-you-type).
- **Throttling**: Limit execution to at most once every interval (e.g., scrolling events).
- **Memoization**: Cache the results of expensive pure functions based on their arguments. Use `package:memoize` or custom implementations.
- **Pattern Matching (Dart 3+)**: Use switch expressions and exhaustive pattern matching for control flow instead of deeply nested if-else chains. This is a core part of clean Dart logic.

## Search & Sort
- **Binary Search**: Use for sorted lists to transform O(n) searches into O(log n).
- **Efficient Sorting**: Use Dart's built-in `list.sort()`, which uses highly optimized algorithms. Provide targeted `Comparable` implementations for custom objects.

## Business Logic Organization
- **Pure Functions**: Keep business logic in pure, testable functions outside of UI classes.
- **Fail Fast**: Use guard clauses to handle edge cases and invalid states early.
- **Validation Logic**: Keep complex validation in a separate domain layer, reusable across different screens.

---
name: flutter-testing
description: Write comprehensive widget and integration tests using pattern-based testing (Golden Variants, State Matrix, Interaction Contracts). Use when testing UI components, user interaction flows, or running end-to-end integration tests.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "testing"
---

# Testing Strategy

-   **Test Pyramid**: More unit and widget tests, fewer integration tests. Unit tests are fastest and cheapest.
-   **Mirror Test Rule**: 100% logic and widget coverage. No code without a test.
-   **Mirror Organization**: Test files MUST strictly mirror the `lib/` directory structure and end with `_test.dart`.
-   **Coverage Targets**: Target 100% logic coverage for `domain` and `bloc` layers.
-   **Test Independence**: Each test MUST be independent. No shared mutable state between tests.

# Widget Testing

-   Write widget tests for all major UI components.
-   Test user interactions and state changes.
-   **Widget Keys**: Use `Key('feature_action_id')` format on interactive widgets for test access.
-   **Test Localization**: Use `AppLocalizations` (`context.l10n`) in widget tests — no hardcoded strings.

# Pattern-Based Testing

Adopt these three structural patterns to eliminate boilerplate, enforce complete coverage, and ensure consistency across the test suite. These are conventions — no external package dependency is required.

## Golden Variant Testing
When a widget has multiple visual states (primary, disabled, hover, error), test all variants in a single structured `group()` with a `Map<String, Widget Function()>`:
-   Define a `variants` map where keys are state names and values are widget builders.
-   Each variant MUST be rendered in isolation (fresh `pumpWidget` call per variant).
-   Use deterministic golden file naming: `goldens/<component>.<variant>.png`.
-   Set a consistent `surfaceSize` via `tester.view.physicalSize` to avoid flaky pixel diffs.
-   **When to use**: Design system components, widgets with distinct modes/types.
-   **When NOT to use**: Integration tests or animation frame verification.

## State Matrix Testing
Every stateful widget MUST be tested against ALL possible UI states. Use a state matrix to separate setup from verification:
-   Define a `states` map with every state the widget can render (`loading`, `error`, `data`, `empty`).
-   Write a single `verify(stateName)` callback that asserts correct rendering per state using `switch` expressions.
-   This pattern prevents the common mistake of only testing the "happy path".
-   **When to use**: Widgets with complex state machines (e.g., BLoC-driven screens).
-   **When NOT to use**: If verification logic varies wildly between states, write separate tests.

## Interaction Contract Testing
Reusable widgets have implicit behavioral rules. Define these as explicit, reusable contracts:
-   Create helper functions in `test/utils/` for common contracts:
    -   `verifyTappable(tester, finder, mockCallback)` — Tap fires callback exactly once.
    -   `verifyDisabledNotTappable(tester, finder, mockCallback)` — Tap does NOT fire callback when disabled.
    -   `verifyValidatesOnBlur(tester, finder)` — Validation triggers when focus leaves.
-   Apply contracts consistently across all widgets sharing the same behavior.
-   **When to use**: Widgets with strictly defined behavioral rules that must hold across refactors.
-   **When NOT to use**: One-off logic unique to a single widget.

# Integration Testing

-   Use `IntegrationTestWidgetsFlutterBinding.ensureInitialized()` at the start of integration tests
-   Interact with widgets via `Key` (e.g., `find.byKey(const ValueKey('increment'))`)
-   Use `pumpAndSettle()` to wait for animations and async operations to complete
-   Run with: `flutter test integration_test/`

# Test Naming & Structure

-   **Test Naming**: Use string interpolation for test group names: `group('$ClassName',` not `group('ClassName',`. This ensures consistency and enables better tooling support.
-   **Test Grouping**: Use `group()` to organize tests by feature, class, or state for clearer reporting.
-   **Descriptive Names**: Test names should clearly describe what is being tested and why.

# Common Test Errors

-   `A RenderFlex overflowed...` — Wrap widget in `Expanded` or constrain dimensions in test
-   `Vertical viewport was given unbounded height` — Wrap `ListView` in `SizedBox` with fixed height in test
-   `setState called during build` — Defer state changes to post-frame callback

## Workflow: Testing Execution

Follow this sequential workflow when testing a feature. Copy the checklist to track progress.

### Task Progress
- [ ] **Step 1: Write Widget Tests.** Ensure all interactive UI elements have `Key`s. Apply Golden Variant, State Matrix, or Interaction Contract patterns as appropriate.
- [ ] **Step 2: Write Integration Tests.** Create end-to-end user flows using `IntegrationTestWidgetsFlutterBinding`.
- [ ] **Step 3: Check Coverage.** Run `flutter test --coverage` and verify targets are met.
- [ ] **Step 4: Run Static Analysis.** Execute `dart analyze` to ensure code conforms to linting rules.

# Running Tests

-   `flutter test` — Run all unit and widget tests
-   `flutter test test/path/to/file_test.dart` — Run specific test file
-   `flutter test integration_test/` — Run integration tests
-   `flutter test --coverage` — Run with coverage report

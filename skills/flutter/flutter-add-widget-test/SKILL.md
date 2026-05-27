---
name: flutter-add-widget-test
description: Write widget tests using WidgetTester with pump patterns, finder APIs, and key-based targeting. Use when testing UI components, user interactions, or verifying widget rendering and state changes.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "testing"
---

## Contents
- [Setup](#setup)
- [Core APIs](#core-apis)
- [Finder Patterns](#finder-patterns)
- [Interaction Patterns](#interaction-patterns)
- [Pump Strategies](#pump-strategies)
- [Testing with BLoC](#testing-with-bloc)
- [Common Pitfalls](#common-pitfalls)
- [Workflow: Adding a Widget Test](#workflow-adding-a-widget-test)
- [Examples](#examples)

## Setup

-   `flutter_test` is an SDK dependency, so no `pub add` is needed.
-   Test file naming: `test/<mirror_path>/<widget>_test.dart`.
-   Every test file starts with:
    ```dart
    import 'package:flutter/material.dart';
    import 'package:flutter_test/flutter_test.dart';
    ```
-   Use `testWidgets('description', (WidgetTester tester) async { ... })` for all widget tests.
-   Always wrap the widget under test in `MaterialApp` to provide `MediaQuery`, `Theme`, and `Navigator` context.

## Core APIs

| API | Purpose |
|---|---|
| `tester.pumpWidget(widget)` | Render widget into test environment |
| `tester.pump()` | Trigger a single frame |
| `tester.pump(Duration(...))` | Advance by specific duration |
| `tester.pumpAndSettle()` | Wait for all animations to complete |
| `tester.tap(finder)` | Simulate tap gesture |
| `tester.longPress(finder)` | Simulate long press |
| `tester.enterText(finder, 'text')` | Type into text field |
| `tester.drag(finder, Offset(dx, dy))` | Simulate drag gesture |
| `tester.scrollUntilVisible(finder, delta)` | Scroll until widget is visible |

## Finder Patterns

Use finders to locate widgets in the test tree. Prefer `Key`-based finders for stability.

-   `find.byKey(const ValueKey('login_button'))` — **Preferred**. Most stable across refactors.
-   `find.byType(ElevatedButton)` — By widget type. Fails if multiple instances exist.
-   `find.text('Submit')` — By displayed text. Avoid with localized strings.
-   `find.byIcon(Icons.add)` — By icon data.
-   `find.descendant(of: parentFinder, matching: childFinder)` — Nested lookup.
-   `find.ancestor(of: childFinder, matching: parentFinder)` — Reverse lookup.

**Key Naming Convention**: Use `Key('feature_action_id')` format on interactive widgets.

```dart
// Production code
ElevatedButton(
  key: const Key('login_submit_button'),
  onPressed: _onSubmit,
  child: const Text('Login'),
)

// Test code
final submitButton = find.byKey(const Key('login_submit_button'));
await tester.tap(submitButton);
```

## Interaction Patterns

### Tap and Verify State Change
```dart
testWidgets('increments counter on tap', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: CounterPage()));

  expect(find.text('0'), findsOneWidget);

  await tester.tap(find.byKey(const Key('increment_button')));
  await tester.pump();

  expect(find.text('1'), findsOneWidget);
});
```

### Enter Text and Validate Form
```dart
testWidgets('validates email field', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: LoginForm()));

  await tester.enterText(find.byKey(const Key('email_field')), 'invalid');
  await tester.tap(find.byKey(const Key('submit_button')));
  await tester.pumpAndSettle();

  expect(find.text('Enter a valid email'), findsOneWidget);
});
```

### Scroll to Off-Screen Widget
```dart
testWidgets('finds item in long list', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: ItemListPage()));

  final listFinder = find.byType(Scrollable);
  final itemFinder = find.byKey(const Key('item_99'));

  await tester.scrollUntilVisible(itemFinder, 500.0, scrollable: listFinder);

  expect(itemFinder, findsOneWidget);
});
```

## Pump Strategies

Choose the right pump method based on your scenario:

| Scenario | Method | Why |
|---|---|---|
| Simple state change | `pump()` | Single frame is enough |
| Animation completes | `pumpAndSettle()` | Waits for all frames |
| Timed animation | `pump(Duration(milliseconds: 300))` | Advance specific time |
| Infinite animation (e.g., `CircularProgressIndicator`) | `pump()` | `pumpAndSettle()` will **timeout** |
| Debounced input | `pump(Duration(milliseconds: 500))` | Wait for debounce period |

**WARNING**: `pumpAndSettle()` throws `PumpAndSettleTimedOutException` on infinite animations. Use `pump()` instead when testing loading states.

## Testing with BLoC

When testing widgets that depend on BLoC/Cubit:

```dart
testWidgets('shows user name from BLoC', (tester) async {
  final mockBloc = MockUserBloc();

  whenListen(
    mockBloc,
    Stream.fromIterable([UserLoaded(User(name: 'Alice'))]),
    initialState: UserInitial(),
  );

  await tester.pumpWidget(
    MaterialApp(
      home: BlocProvider<UserBloc>.value(
        value: mockBloc,
        child: const UserProfilePage(),
      ),
    ),
  );

  await tester.pumpAndSettle();

  expect(find.text('Alice'), findsOneWidget);
});
```

-   Use `MockBloc` / `MockCubit` from `bloc_test` package.
-   Use `whenListen()` to stub state stream responses.
-   Use `BlocProvider.value()` to inject mock into the widget tree.

## Common Pitfalls

| Error | Cause | Fix |
|---|---|---|
| `No MediaQuery widget ancestor` | Missing `MaterialApp` wrapper | Wrap in `MaterialApp(home: ...)` |
| `A RenderFlex overflowed` | Widget exceeds test viewport | Constrain with `SizedBox` or `Expanded` |
| `Vertical viewport was given unbounded height` | `ListView` without height constraint | Wrap in `SizedBox(height: 600)` |
| Widget not found after navigation | Missing `pumpAndSettle()` | Add `await tester.pumpAndSettle()` after navigation |
| `PumpAndSettleTimedOutException` | Infinite animation running | Use `pump()` instead of `pumpAndSettle()` |

## Workflow: Adding a Widget Test

### Task Progress
- [ ] **Step 1**: Add `Key`s to interactive widgets in production code.
- [ ] **Step 2**: Create test file at `test/<mirror_path>/<widget>_test.dart`.
- [ ] **Step 3**: Wrap widget in `MaterialApp` and call `tester.pumpWidget()`.
- [ ] **Step 4**: Use appropriate finder (`byKey` preferred).
- [ ] **Step 5**: Simulate interactions (`tap`, `enterText`, `drag`).
- [ ] **Step 6**: Assert with `expect(finder, findsOneWidget)` or state checks.
- [ ] **Step 7**: Apply Golden Variant / State Matrix / Interaction Contract pattern (see `flutter-testing`).
- [ ] **Step 8**: Run `flutter test test/path/to/widget_test.dart`.
- [ ] **Step 9**: Feedback Loop — fix failures → re-run until green.

## Examples

### Minimal Widget Test
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/features/counter/counter_page.dart';

void main() {
  group('$CounterPage', () {
    testWidgets('renders initial counter value', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: CounterPage()));

      expect(find.text('0'), findsOneWidget);
      expect(find.byType(FloatingActionButton), findsOneWidget);
    });

    testWidgets('increments counter when FAB is tapped', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: CounterPage()));

      await tester.tap(find.byType(FloatingActionButton));
      await tester.pump();

      expect(find.text('1'), findsOneWidget);
    });
  });
}
```

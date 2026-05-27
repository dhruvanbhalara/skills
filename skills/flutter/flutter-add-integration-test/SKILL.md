---
name: flutter-add-integration-test
description: Configure and run integration tests using the integration_test package with Flutter Driver. Use when testing complete user flows, verifying navigation, or running end-to-end tests on devices or CI.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "testing"
---

## Contents
- [Project Setup](#project-setup)
- [Test Authoring](#test-authoring)
- [Execution Targets](#execution-targets)
- [Performance Profiling](#performance-profiling)
- [CI/CD Integration](#ci-cd-integration)
- [Common Pitfalls](#common-pitfalls)
- [Workflow: Adding an Integration Test](#workflow-adding-an-integration-test)
- [Examples](#examples)

## Project Setup

1.  Add required development dependencies to `pubspec.yaml`:
    ```bash
    flutter pub add 'dev:integration_test:{"sdk":"flutter"}'
    flutter pub add 'dev:flutter_test:{"sdk":"flutter"}'
    ```

2.  Create directory structure:
    ```
    project_root/
    ├── integration_test/
    │   └── app_test.dart          # Test cases
    └── test_driver/
        └── integration_test.dart  # Host driver script
    ```

3.  Create the host driver script at `test_driver/integration_test.dart`:
    ```dart
    import 'package:integration_test/integration_test_driver.dart';

    Future<void> main() => integrationDriver();
    ```

4.  Add `ValueKey`s to critical widgets in production code for reliable targeting:
    ```dart
    FloatingActionButton(
      key: const ValueKey('increment_fab'),
      onPressed: _increment,
      child: const Icon(Icons.add),
    )
    ```

## Test Authoring

-   Initialize the binding at the top of `main()` — this replaces the default test binding.
-   Load the full application with `tester.pumpWidget(const MyApp())`.
-   Use `tester.pumpAndSettle()` after every interaction to wait for animations and async operations.
-   Assert widget visibility using `expect(find.byKey(ValueKey('foo')), findsOneWidget)`.
-   Scroll to off-screen widgets using `tester.scrollUntilVisible(finder, 500.0)`.

### Test File Structure
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('End-to-end test', () {
    testWidgets('complete user flow', (tester) async {
      // Load full app
      await tester.pumpWidget(const MyApp());

      // Interact with widgets
      await tester.tap(find.byKey(const ValueKey('login_button')));
      await tester.pumpAndSettle();

      // Assert navigation happened
      expect(find.byType(HomePage), findsOneWidget);
    });
  });
}
```

## Execution Targets

Choose the execution method based on target platform:

### Local Device (Android/iOS)
```bash
flutter test integration_test/
```

### Chrome (Web)
```bash
# Terminal 1: Start ChromeDriver
chromedriver --port=4444

# Terminal 2: Run tests
flutter drive \
  --driver=test_driver/integration_test.dart \
  --target=integration_test/app_test.dart \
  -d chrome
```

### Headless Web
```bash
flutter drive \
  --driver=test_driver/integration_test.dart \
  --target=integration_test/app_test.dart \
  -d web-server
```

### Firebase Test Lab (Android)
```bash
# 1. Build debug APK
flutter build apk --debug

# 2. Build instrumentation test APK
pushd android && ./gradlew app:assembleAndroidTest && popd

# 3. Upload both APKs to Firebase Test Lab via console or gcloud:
gcloud firebase test android run \
  --type instrumentation \
  --app build/app/outputs/flutter-apk/app-debug.apk \
  --test build/app/outputs/apk/androidTest/debug/app-debug-androidTest.apk
```

## Performance Profiling

Wrap test actions in `binding.traceAction()` to capture performance timelines:

```dart
void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('scrolling performance', (tester) async {
    await tester.pumpWidget(const MyApp());

    await binding.traceAction(() async {
      final listFinder = find.byType(Scrollable);
      await tester.fling(listFinder, const Offset(0, -500), 10000);
      await tester.pumpAndSettle();
    }, reportKey: 'scrolling_timeline');
  });
}
```

### Performance Profiling Driver
Use this driver to capture and write timeline data:
```dart
import 'package:flutter_driver/flutter_driver.dart' as driver;
import 'package:integration_test/integration_test_driver.dart';

Future<void> main() {
  return integrationDriver(
    responseDataCallback: (data) async {
      if (data != null) {
        final timeline = driver.Timeline.fromJson(
          data['scrolling_timeline'] as Map<String, dynamic>,
        );
        final summary = driver.TimelineSummary.summarize(timeline);
        await summary.writeTimelineToFile(
          'scrolling_timeline',
          pretty: true,
          includeSummary: true,
        );
      }
    },
  );
}
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
- name: Run integration tests
  uses: reactivecircus/android-emulator-runner@v2
  with:
    api-level: 33
    script: flutter test integration_test/ --flavor dev
```

-   Use `reactivecircus/android-emulator-runner` for Android emulator.
-   Collect test result artifacts with `actions/upload-artifact`.
-   For web, run `chromedriver` as a service and test with `-d chrome`.

## Common Pitfalls

| Error | Cause | Fix |
|---|---|---|
| `PumpAndSettleTimedOutException` | Infinite animation (e.g., `CircularProgressIndicator`) | Use `pump()` instead, or dismiss the loading state |
| Widget not found | Lazy-loaded in `SliverList` or `ListView` | Call `scrollUntilVisible()` before interacting |
| Test hangs | Network call in production code | Mock HTTP client or use `--dart-define` to bypass |
| `No host driver specified` | Missing `test_driver/integration_test.dart` | Create the host driver file |

## Workflow: Adding an Integration Test

### Task Progress
- [ ] **Step 1**: Add `integration_test` and `flutter_test` to `dev_dependencies`.
- [ ] **Step 2**: Assign `ValueKey`s to target widgets in production code.
- [ ] **Step 3**: Create `integration_test/app_test.dart` with binding initialization.
- [ ] **Step 4**: Create `test_driver/integration_test.dart` with `integrationDriver()`.
- [ ] **Step 5**: Write test cases — load app, interact, assert.
- [ ] **Step 6**: Choose execution target:
  - Local device: `flutter test integration_test/`
  - Chrome: `flutter drive ... -d chrome`
  - Firebase Test Lab: build + upload APKs
- [ ] **Step 7**: Feedback Loop:
  - If `PumpAndSettleTimedOutException` → check for infinite animations.
  - If widget not found → add `scrollUntilVisible`.
  - Re-run until all tests pass.

## Examples

### Standard Integration Test
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Counter app', () {
    testWidgets('tap FAB, verify counter increments', (tester) async {
      await tester.pumpWidget(const MyApp());

      // Verify initial state
      expect(find.text('0'), findsOneWidget);

      // Tap the increment button
      final fab = find.byKey(const ValueKey('increment_fab'));
      await tester.tap(fab);
      await tester.pumpAndSettle();

      // Verify counter incremented
      expect(find.text('1'), findsOneWidget);
    });
  });
}
```

### Multi-Screen Navigation Flow
```dart
testWidgets('login and navigate to home', (tester) async {
  await tester.pumpWidget(const MyApp());

  // Enter credentials
  await tester.enterText(find.byKey(const ValueKey('email_field')), 'user@test.com');
  await tester.enterText(find.byKey(const ValueKey('password_field')), 'password123');

  // Submit login
  await tester.tap(find.byKey(const ValueKey('login_button')));
  await tester.pumpAndSettle();

  // Verify navigation to home
  expect(find.byType(HomePage), findsOneWidget);
  expect(find.byType(LoginPage), findsNothing);
});
```

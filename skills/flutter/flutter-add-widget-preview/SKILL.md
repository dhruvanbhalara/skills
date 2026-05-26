---
name: flutter-add-widget-preview
description: Add interactive widget previews using the @Preview annotation system. Use when creating new UI components, verifying designs in isolation, or testing visual states without running the full app.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "ui"
---

## Contents
- [Preview Guidelines](#preview-guidelines)
- [Handling Limitations](#handling-limitations)
- [IDE and CLI Integration](#ide-and-cli-integration)
- [Custom Annotations](#custom-annotations)
- [Workflow: Adding a Widget Preview](#workflow-adding-a-widget-preview)
- [Examples](#examples)

## Preview Guidelines

Use the Flutter Widget Previewer to render widgets in real-time, isolated from the full application context.

-   **Target Elements**: Apply the `@Preview` annotation to:
    -   Top-level functions returning `Widget`
    -   Static methods within a class returning `Widget`
    -   Public widget constructors/factories with no required arguments
-   **Import**: Always import `package:flutter/widget_previews.dart`.
-   **Multiple Configurations**: Apply multiple `@Preview` annotations to a single target for multiple preview instances (e.g., light/dark mode).
-   **Naming**: Use `name` and `group` parameters for organized preview panels.
-   **Sizing**: Apply explicit constraints using the `size` parameter if the widget is unconstrained — the previewer defaults to approximately half the viewport.

## Handling Limitations

The Widget Previewer runs in a **web environment**. Adhere to these constraints:

| Limitation | Impact | Workaround |
|---|---|---|
| No `dart:io` | File system, sockets unavailable | Use conditional imports to mock |
| No `dart:ffi` | Native code won't execute | Stub native calls in preview mode |
| Asset paths | `dart:ui` `fromAsset` requires package paths | Use `packages/my_package/assets/...` |
| Callbacks | Must be public and constant | No closures in annotation params |
| Unconstrained widgets | May render incorrectly | Set `size` parameter in `@Preview` |

## IDE and CLI Integration

### IDE (Android Studio, IntelliJ, VS Code with Flutter 3.38+)
1.  Launch the IDE. The Widget Previewer starts automatically.
2.  Open the **"Flutter Widget Preview"** tab in the sidebar.
3.  Toggle **"Filter previews by selected file"** at the bottom left to view previews outside the active file.

### Command Line
```bash
flutter widget-preview start
```
Opens a Chrome environment with live previews.

### Feedback Loop
1.  Modify the widget code or preview configuration.
2.  Observe the automatic update in the Widget Previewer.
3.  If global state was modified → click global hot restart (bottom right).
4.  If only local widget state needs resetting → click individual hot restart on the preview card.
5.  Review errors in the IDE/CLI console → fix → repeat.

## Custom Annotations

### Extending Preview
Create reusable preview configurations by extending the `Preview` class:
```dart
import 'package:flutter/widget_previews.dart';
import 'package:flutter/material.dart';

final class ThemedPreview extends Preview {
  const ThemedPreview({super.name, super.group});

  PreviewThemeData _themeBuilder() {
    return PreviewThemeData(
      materialLight: ThemeData.light(),
      materialDark: ThemeData.dark(),
    );
  }

  @override
  Preview transform() {
    final originalPreview = super.transform();
    final builder = originalPreview.toBuilder()
      ..name = 'Themed - ${originalPreview.name}'
      ..theme = _themeBuilder;
    return builder.toPreview();
  }
}

@ThemedPreview(name: 'Primary Button')
Widget primaryButton() => const ElevatedButton(onPressed: null, child: Text('Click'));
```

### MultiPreview for Brightness Variants
```dart
final class MultiBrightnessPreview extends MultiPreview {
  const MultiBrightnessPreview({required this.name});
  final String name;

  @override
  List<Preview> get previews => const [
    Preview(brightness: Brightness.light),
    Preview(brightness: Brightness.dark),
  ];

  @override
  List<Preview> transform() {
    return super.transform().map((preview) {
      final builder = preview.toBuilder()
        ..group = 'Brightness'
        ..name = '$name - ${preview.brightness!.name}';
      return builder.toPreview();
    }).toList();
  }
}

@MultiBrightnessPreview(name: 'User Card')
Widget userCard() => const Card(
  child: Padding(padding: EdgeInsets.all(16), child: Text('John Doe')),
);
```

## Workflow: Adding a Widget Preview

### Task Progress
- [ ] **Step 1**: Import `package:flutter/widget_previews.dart`.
- [ ] **Step 2**: Identify valid target (top-level function, static method, or no-arg constructor).
- [ ] **Step 3**: Apply `@Preview` annotation with `name`, `group`, `size` params.
- [ ] **Step 4**: If config is reused across widgets → extract into custom `Preview` subclass.
- [ ] **Step 5**: Launch previewer (IDE tab or `flutter widget-preview start`).
- [ ] **Step 6**: Iterate — modify widget → observe auto-update → fix errors → repeat.

## Examples

### Basic Preview
```dart
import 'package:flutter/widget_previews.dart';
import 'package:flutter/material.dart';

@Preview(name: 'Greeting Text', group: 'Typography')
Widget greetingText() {
  return const Text('Hello, World!', style: TextStyle(fontSize: 24));
}
```

### Preview with Size Constraints
```dart
@Preview(
  name: 'Login Form',
  group: 'Forms',
  size: Size(400, 600),
)
Widget loginFormPreview() {
  return const MaterialApp(home: LoginForm());
}
```

### Preview on a Constructor
```dart
@Preview(name: 'Default Avatar')
class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key});

  @override
  Widget build(BuildContext context) {
    return const CircleAvatar(radius: 40, child: Icon(Icons.person));
  }
}
```

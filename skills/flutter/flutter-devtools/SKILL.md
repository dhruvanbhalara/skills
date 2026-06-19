---
name: flutter-devtools
description: Guide for utilizing Flutter DevTools, using visual debugging properties, and exposing custom widget states to the inspector.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "tooling"
---

# Flutter DevTools & Visual Debugging

Debugging UI, performance, and memory leaks efficiently in Flutter requires mastering the DevTools suite and utilizing framework-level debugging properties.

## Contents
- [Connecting DevTools](#connecting-devtools)
- [Visual Debugging Flags](#visual-debugging-flags)
- [Custom Widget Diagnostics (`debugFillProperties`)](#custom-widget-diagnostics-debugfillproperties)
- [Performance & Memory Profiling](#performance-memory-profiling)

---

## Connecting DevTools

Start and connect DevTools to a running Flutter application:

1. **Via CLI**: Run `flutter devtools` in the terminal to launch the DevTools web application server.
2. **Via IDE**:
   - In VS Code, open the Command Palette (`Cmd+Shift+P`) and select **Dart: Open DevTools**.
   - In Android Studio, click the **Flutter DevTools** icon in the run/debug toolbar.
3. **Execution Mode**:
   - Use **Debug Mode** for Inspector, Network, and Logging tabs.
   - Use **Profile Mode** (`flutter run --profile`) for Performance and Memory profiling. Never profile performance in Debug mode due to VM overhead.

---

## Visual Debugging Flags

Toggle these runtime properties to visually diagnose layout and rendering performance directly on the emulator/device.

Import the rendering library to access these flags:
```dart
import 'package:flutter/rendering.dart';
import 'package:flutter/foundation.dart';
```

### Key Debugging Flags

| Flag | Purpose | Usage |
|---|---|---|
| `debugPaintSizeEnabled = true` | Visualizes layout boxes, margins, padding, and alignment. | To identify misplaced padding or sizing issues. |
| `debugRepaintRainbowEnabled = true` | Overlays a rotating set of border colors on layers that repaint. | If a static widget changes colors on scroll, wrap it in a `RepaintBoundary`. |
| `debugPaintLayerBordersEnabled = true` | Outlines the borders of individual compositor layers in orange. | Useful for debugging composite layer splits. |
| `debugProfileBuildsEnabled = true` | Enables tracing for widget builds in the DevTools Performance timeline. | Tracks exactly which widgets are rebuilding during jank. |
| `debugProfilePaintsEnabled = true` | Enables tracing for paint operations in the DevTools Performance timeline. | Captures heavy paint operations on custom canvases. |

### Example Setup
```dart
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

void main() {
  // Toggle layout boundaries in debug mode
  debugPaintSizeEnabled = true;
  runApp(const MyApp());
}
```

---

## Custom Widget Diagnostics (`debugFillProperties`)

When building custom widgets, design system components, or stateful widgets with complex parameters, override `debugFillProperties` to expose internal state variables to the **Flutter Inspector's Details Tree**.

### Diagnostic Properties Pattern
- Override `debugFillProperties(DiagnosticPropertiesBuilder properties)` in your Widget or State class.
- **Always** call `super.debugFillProperties(properties)` first.
- Add typed properties (`IntProperty`, `DoubleProperty`, `StringProperty`, `FlagProperty`, `EnumProperty`) to keep output clean and structured.

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String label;
  final bool isLoading;
  final int badgeCount;

  const CustomButton({
    super.key,
    required this.label,
    this.isLoading = false,
    this.badgeCount = 0,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : () {},
      child: Text(label),
    );
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    
    // Add custom properties visible in Flutter Inspector
    properties.add(StringProperty('label', label));
    properties.add(FlagProperty('isLoading', value: isLoading, ifTrue: 'loading', ifFalse: 'ready'));
    properties.add(IntProperty('badgeCount', badgeCount, defaultValue: 0));
  }
}
```

---

## Performance & Memory Profiling

### Performance Tab
- **Flame Chart**: Shows execution time for the UI and Raster threads. Look for functions stretching horizontally to find execution bottlenecks.
- **Frame Time Budgets**:
  - **60Hz display**: < 16.6ms frame rendering time.
  - **90Hz display**: < 11.1ms frame rendering time.
  - **120Hz display**: < 8.3ms frame rendering time.

### Memory Tab
- **Heap Snapshot**: Take snapshots before and after a user flow (e.g. opening/closing a screen) to check if memory returns to baseline.
- **Leak Detection**: Look for undisposed classes, controllers, or image assets that remain in the heap after screen closure.

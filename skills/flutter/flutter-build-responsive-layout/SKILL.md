---
name: flutter-build-responsive-layout
description: Build adaptive layouts using LayoutBuilder, MediaQuery, or Expanded/Flexible widgets to ensure the UI looks elegant across all mobile, tablet, and desktop form factors.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "ui"
---

## Contents
- [Space Measurement Guidelines](#space-measurement-guidelines)
- [Widget Sizing and Constraints](#widget-sizing-and-constraints)
- [Device and Orientation Behaviors](#device-and-orientation-behaviors)
- [Workflow: Constructing an Adaptive Layout](#workflow-constructing-an-adaptive-layout)
- [Workflow: Optimizing for Large Screens](#workflow-optimizing-for-large-screens)
- [Examples](#examples)

## Space Measurement Guidelines

To ensure that layouts adapt fluidly to the app window (which is especially important on platforms with resizable windows or multi-window multitasking), determine available space using these principles:

- **Use `MediaQuery.sizeOf(context)`**: Instead of accessing the full `MediaQuery.of(context)` (which triggers rebuilds for any MediaQuery property change), use the modern and efficient `MediaQuery.sizeOf(context)` to retrieve the dimensions of the application window.
- **Use `LayoutBuilder`**: Place layout decisions inside a `LayoutBuilder` when you want a component to adapt based on the size allocated to it by its parent widget rather than the global screen dimensions. Use `constraints.maxWidth` to choose the appropriate widget subtree to render.
- **Avoid global orientation builders**: Do not rely on device orientation builders (`OrientationBuilder` or `MediaQuery.orientationOf`) near the top of the widget tree to switch main layouts. The device orientation does not always reflect the actual available layout space, particularly in multi-window or foldable multitasking modes.
- **Do not check for physical hardware type**: Do not check whether the current hardware is a "phone", "tablet", or "desktop" to determine layout rules. Layouts must adapt to window constraints, not physical hardware types, since resizable windows, picture-in-picture, and screen splits are standard on modern platforms.

## Widget Sizing and Constraints

In Flutter, layouts are built using a negotiation process: **Constraints go down, sizes go up, and the parent sets the position**. Apply these rules to manage widget dimensions elegantly:

- **Distribute Space with Flex**: Use `Expanded` and `Flexible` inside `Row`, `Column`, or `Flex` layouts to share available space proportionally among siblings.
  - Use `Expanded` to force a child to consume all remaining available space along the main axis.
  - Use `Flexible` to allow a child to size itself up to a specific limit, and use the `flex` factor to define how remaining space is shared.
- **Limit Max Width**: Avoid letting content stretch infinitely across wide displays. Wrap list views, grids, and form blocks in a `ConstrainedBox` or a `Container` with a maximum width restriction and keep them centered using a `Center` widget.
- **Lazy Render lists**: Always use `ListView.builder` or `GridView.builder` when displaying lists or grids with a large or dynamic number of items to ensure off-screen widgets are lazily built and memory consumption remains low.

## Device and Orientation Behaviors

A truly responsive and professional application adapts to dynamic form factors and multiple input methods seamlessly:

- **Avoid locking screen orientation**: Locking the application to a single orientation is highly discouraged. It breaks the user experience on foldable devices and large-format form factors, resulting in awkward letterboxing.
- **Provide safe fallbacks**: If orientation locking is unavoidable due to strict business mandates, utilize the `Display API` to retrieve physical screen dimensions instead of `MediaQuery`, which may return incorrect dimensions in compatibility or legacy scaling modes.
- **Support diverse inputs**: Ensure all interactive widgets have minimum touch target sizes of 48x48 logical pixels. Optimize layout components to respond to mouse hovers, trackpad gestures, and keyboard navigation.

## Workflow: Constructing an Adaptive Layout

Follow this checklist to build and verify responsive layouts:

- [ ] **Identify the target layout**: Select the page or section that requires custom responsive behavior.
- [ ] **Implement LayoutBuilder**: Wrap the subtree in a `LayoutBuilder` widget.
- [ ] **Extract constraint width**: Read `constraints.maxWidth` in the builder callback.
- [ ] **Define clear breakpoints**: Use established breakpoints (e.g., 600 logical pixels for tablet/large-screen layouts).
- [ ] **Define subtrees**:
  - [ ] If `maxWidth > 600`: Return the multi-pane or split-screen layout (e.g., placing navigation sidebars beside content).
  - [ ] If `maxWidth <= 600`: Return the single-column or mobile-optimized layout.
- [ ] **Inspect and verify**: Run the app, resize the window dynamically or rotate the simulator, and verify that there are no layout overflows or jank during transitions.

## Workflow: Optimizing for Large Screens

Follow this checklist to optimize readability on large screens:

- [ ] **Identify stretched components**: Find full-screen text blocks, input forms, or list items that span the entire screen width.
- [ ] **Apply constraints**: Wrap the stretched content in a `ConstrainedBox` widget.
- [ ] **Define maximum limits**: Set a maximum readable width (e.g., `BoxConstraints(maxWidth: 800.0)`).
- [ ] **Center the content**: Wrap the `ConstrainedBox` in a `Center` widget to keep the layout balanced on wide monitors.
- [ ] **Inspect and verify**: Test the layout on a desktop build or tablet simulator to ensure readability remains excellent and content does not stretch.

## Examples

### Adaptive Layout with Breakpoints

This example shows how to switch between a mobile-optimized layout and a larger screen split-pane layout depending on available space.

```dart
import 'package:flutter/material.dart';

class AdaptiveHomeLayout extends StatelessWidget {
  const AdaptiveHomeLayout({super.key});

  static const double tabletBreakpoint = 600.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth > tabletBreakpoint) {
            return _buildTabletLayout();
          }
          return _buildMobileLayout();
        },
      ),
    );
  }

  Widget _buildTabletLayout() {
    return Row(
      children: [
        const SizedBox(
          width: 240,
          child: NavigationSidebar(),
        ),
        const VerticalDivider(width: 1),
        Expanded(
          child: const MainContentArea(),
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return const MainContentArea();
  }
}

class NavigationSidebar extends StatelessWidget {
  const NavigationSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 16),
      children: const [
        ListTile(
          leading: Icon(Icons.dashboard),
          title: Text('Dashboard'),
        ),
        ListTile(
          leading: Icon(Icons.settings),
          title: Text('Settings'),
        ),
      ],
    );
  }
}

class MainContentArea extends StatelessWidget {
  const MainContentArea({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Main Content Area'),
    );
  }
}
```

### Constraining Width on Wide Screens

This example prevents a profile or settings form from stretching awkwardly across wide desktop screens.

```dart
import 'package:flutter/material.dart';

class ConstrainedProfileForm extends StatelessWidget {
  const ConstrainedProfileForm({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(
            maxWidth: 600.0,
          ),
          child: ListView(
            padding: const EdgeInsets.all(24.0),
            children: [
              const TextFormField(
                decoration: InputDecoration(
                  labelText: 'Full Name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              const TextFormField(
                decoration: InputDecoration(
                  labelText: 'Email Address',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {},
                child: const Text('Save Changes'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

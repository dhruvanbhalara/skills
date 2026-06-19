---
name: flutter-ui
description: Build performant, accessible UIs with strict design tokens and reusable widget patterns. Use when implementing layouts, responsive breakpoints, theming, widget extraction, or fixing common rendering issues like overflow errors.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "ui"
---

# 1. Performance & Rendering

-   **Const-First**: Every widget that can be `const` MUST be `const`.
-   **Lazy Rendering**: Use `SliverList.builder` or `SliverGrid.builder` for lists > 10 items.
-   **Repaint Boundaries**: Wrap complex animations in `RepaintBoundary`.
-   **Impeller Rendering**: Impeller is the default rendering engine for iOS and Android. Ensure custom canvas paints are optimized and do not rely on Skia-specific behaviors.
-   **Isolate Parsing**: Use `compute()` or `Isolate` for JSON > 1MB.
-   **BuildContext Safety**: Check `mounted` before using `context` across async gaps.

# 2. Design Tokens (Theming)

Use `AppColors`, `AppSpacing`, `AppRadius`, and `AppTypography`. NEVER hardcode raw values.
-   **Colors**: Use `context.colorScheme.primary` or `AppColors`. Support light/dark modes.
-   **Spacing**: Use `AppSpacing.sm` (8), `AppSpacing.md` (16), etc. Use `SizedBox` for gaps.
-   **Radius**: Use `AppRadius.md` (12) for consistent rounding.
-   **Typography**: Use `context.textTheme.bodyMedium`. Support text scaling.

# 3. Reusable Components

-   **Single Responsibility**: Each component has one clear purpose.
-   **Parameterization**: Expose parameters for customization.
-   **Complexity**: Extract widgets or code blocks used multiple times into `core/views/widgets`.
-   **Keys**: Assign `Key('feature_action_id')` to interactive widgets for test access.

# 4. Widget & Interaction Patterns

-   **Extraction**: STRICTLY prohibit private `_build*()` methods. Extract into separate widget classes.
-   **Slivers**: Prefer `CustomScrollView` with Slivers for non-trivial scrollable layouts.
-   **FAB**: Use Floating Action Buttons for primary positive actions (Add, Create).
-   **Scroll Padding**: Add dynamic bottom padding when a FAB or BottomBar is present to prevent overlap.
-   **Pop Handling**: NEVER use the deprecated `WillPopScope` widget. Use the standard `PopScope` widget to intercept or block back-navigation.
-   **Sheets vs Screens**: Prefer full `Scaffold` screens over `ModalBottomSheet` for complex forms.

# 5. Adaptive & Responsive Design and Common Fixes

-   **Mobile First**: Design for mobile, then adapt for tablet (`600-840dp`) and desktop (`>840dp`). Use `MediaQuery.sizeOf(context).width`.
-   **Layout Builder**: Use `LayoutBuilder` when widget rendering depends on the immediate parent's constraints, not the whole screen.
-   **Safe Area & Android 15**: Wrap main layouts in `SafeArea` to avoid device notches and system bar overlays. Since Android 15 enforces edge-to-edge rendering by default, use `MediaQuery.paddingOf(context)` or `SafeArea` to prevent widgets from clipping under the system status or navigation bars.
-   **Modular UI Imports**: Flutter 3.44+ decouples `material` and `cupertino` from the core framework. In pure structural widgets, import only `package:flutter/widgets.dart` to maintain clear library separation.
-   **Overflow Fixes**:
    -   `A RenderFlex overflowed...`: Typically means a widget is demanding more space than available in a `Row` or `Column`. Wrap the offending widget in `Expanded` or `Flexible`.
    -   `Vertical viewport was given unbounded height`: Often happens when nesting scrollable views (like `ListView` inside `Column`). Use `Expanded` on the `ListView` or set `shrinkWrap: true`.
-   **Rules**: Never lock orientation unless strictly required by a unique feature. Support keyboard navigation and hover effects for desktop users.

# 6. Responsive Layout Patterns

## LayoutBuilder vs MediaQuery

| Tool | Use When | Returns |
|---|---|---|
| `MediaQuery.sizeOf(context)` | Layout depends on **screen size** (app-level breakpoints) | `Size` of the screen |
| `LayoutBuilder` | Layout depends on **parent constraints** (widget-level) | `BoxConstraints` from parent |

**Rule**: Use `MediaQuery` for page-level layouts. Use `LayoutBuilder` for reusable components that adapt to their container.

## Breakpoint Conventions

| Window Class | Width | Layout | Columns |
|---|---|---|---|
| Compact | < 600dp | Single column, bottom nav | 4 |
| Medium | 600–840dp | Two-pane, navigation rail | 8 |
| Expanded | > 840dp | Multi-pane, side navigation | 12 |

## Adaptive Layout Pattern
```dart
Widget build(BuildContext context) {
  final width = MediaQuery.sizeOf(context).width;
  return switch (width) {
    < 600 => const MobileLayout(),
    < 840 => const TabletLayout(),
    _ => const DesktopLayout(),
  };
}
```

## Constraint Widgets

| Widget | Behavior | Use When |
|---|---|---|
| `Expanded` | Fill ALL remaining space in `Row`/`Column` | Child should stretch |
| `Flexible` | Allow child to be SMALLER than remaining space | Child has natural size |
| `FractionallySizedBox` | Size as fraction of parent (e.g., 0.5 = 50%) | Proportional layouts |
| `ConstrainedBox` | Set min/max constraints | Bounded flexibility |
| `SizedBox` | Fixed absolute dimensions | Known exact size |

# 7. UI States & Accessibility

-   **States**: Always handle Loading, Error, and Empty states with clear messaging.
-   **Accessibility**: Include `Semantics` labels. Ensure 48x48 dp touch targets. WCAG AA contrast.

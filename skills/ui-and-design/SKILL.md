---
name: ui-and-design
description: UI Performance, Design System, Adaptive UI & Interaction Patterns
---

# Performance & Rendering

-   **Const-First**: Every widget that can be `const` MUST be `const`.
-   **Lazy Rendering**: Mandatory use of lazy-loading constructs (`SliverList.builder` or `SliverGrid.builder`) for any list exceeding 10 items.
-   **Repaint Boundaries**: Wrap complex animations or heavy UI sections in `RepaintBoundary` to optimize Impeller frame budget.
-   **Isolate Parsing**: Mandate `compute()` or `Isolate` for JSON parsing exceeding 1MB to avoid main-thread jank.
-   Optimize image handling with `cached_network_image`
-   Handle asynchronous operations cleanly with proper cancellation during widget disposal
-   Minimize unnecessary rebuilds using memoization techniques
-   Implement pagination for large data sets
-   Flatten widget hierarchies where reasonable for better rendering performance
-   **BuildContext Safety**: Check `mounted` before using `context` across async gaps to prevent `setState` after dispose.

# Design System

> See [design-system/SKILL.md](../design-system/SKILL.md) for full token definitions (colors, spacing, radius, typography), reusable component rules, theming standards, and accessibility. Always use design tokens — never hardcode values.

# Widget Patterns

-   **Widget Extraction**: STRICTLY prohibit private `_build*()` methods that return widgets. Extract them into separate `StatelessWidget` or `StatefulWidget` classes (can be private with `_` prefix). This ensures better testability, reusability, and composition.
-   **Sliver Preference**: Prefer `CustomScrollView` with `Slivers` over `SingleChildScrollView` for any non-trivial scrollable layout to ensure lazy loading and avoid jank. Use `SliverList.builder` or `SliverList.separated` and `SliverGrid.builder` for mixed content types.
-   Prominently use Sliver widgets: `SliverAppBar`, `SliverList`, `SliverGrid`, `SliverToBoxAdapter`, `SliverPadding`, `SliverPersistentHeader`, `SliverFillRemaining`, `SliverFixedExtentList`, `SliverAnimatedList`, `SliverFillViewport`, `SliverOpacity`, `SliverIgnorePointer`, `SliverLayoutBuilder`, `SliverPrototypeExtentList`, `SliverVisibility`
-   **No Unnecessary Containers**: Reduce usage of `Container`. Use chained widgets like `DecoratedBox`, `Padding`, `SizedBox`, etc. Prefer `SizedBox` over `Container` for simple spacing.
-   Use inbuilt animated widgets where applicable (`AnimatedContainer`, `AnimatedOpacity`, `AnimatedSwitcher`, `AnimatedPositioned`, etc.) before resorting to explicit `AnimationController`.
-   Keep widgets focused and composable with clear responsibilities
-   **Widget Keys**: Assign `Key('feature_action_id')` to interactive widgets for test access. Use `ValueKey(item.id)` (not `ValueKey(index)`) for list items.

# UI States

-   Use a loading indicator while fetching data
-   Use an error indicator with appropriate messaging for error displays
-   Handle empty states gracefully in UI with clear messaging

# Interaction Patterns

-   **FAB Usage**: Use Floating Action Buttons (FAB) for primary positive actions (Add, Create, Generate, Save) on a screen. Avoid inline primary buttons when a FAB is more appropriate for the screen context.
-   **Scroll Padding**: ALWAYS add dynamic bottom padding to `SliverList.builder` or `SingleChildScrollView` when a FAB or Bottom Navigation Bar is present. Use `MediaQuery.of(context).padding.bottom + kFloatingActionButtonMargin + 56` (or `AppSpacing.xxl`) to prevent content overlap.
-   **Screen vs Sheet**: Prefer full `Scaffold` screens over `ModalBottomSheet` for complex forms, especially those with text inputs, to ensure proper keyboard handling and deep linking capability.
-   **Deep Linking**: Complex flows should be addressable via deep links (e.g., `/strategy/:id` instead of just a bottom sheet).

# Adaptive & Responsive Design

-   Design mobile first
-   Use `LayoutBuilder` and `MediaQuery` for adaptive layouts
-   Design for different screen sizes and orientations using responsive breakpoints

## Adaptive Workflow (Abstract → Measure → Branch)

1. **Abstract**: Identify widgets needing adaptability. Share common data (e.g., `Destination` for both `NavigationBar` and `NavigationRail`).
2. **Measure**: Use `MediaQuery.sizeOf(context)` for app-level layout decisions; `LayoutBuilder` for widget-specific constraints.
3. **Branch**: Apply breakpoints — `< 600` mobile, `600–840` tablet, `>= 840` desktop (Material guidelines).

## Adaptive Rules

-   Never lock orientation; support both portrait and landscape
-   Never use `Platform.isIOS` / `Platform.isAndroid` for layout decisions; use window size
-   Don't use `OrientationBuilder` for layout changes; use `MediaQuery.sizeOf` or `LayoutBuilder` with breakpoints
-   On large screens, avoid full-width content; constrain content width for readability
-   Support keyboard navigation, mouse hover effects, and focus handling for custom widgets

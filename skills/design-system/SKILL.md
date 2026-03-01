---
name: design-system
description: Design Tokens, Reusable Components & Theming Standards
---

# Design Tokens

Design tokens are the atomic values of the design system. UI elements MUST use tokens — never raw values.

## Colors

-   ✅ Use `AppColors.primary`, `AppColors.secondary`, `AppColors.error`, `AppColors.success`, `AppColors.warning`, `AppColors.surface`, `AppColors.textPrimary`, `AppColors.textSecondary`
-   ❌ NEVER use `Color(0xFF...)`, `Colors.blue`, or inline hex values
-   Map semantic tokens to Material 3 `ColorScheme` for platform consistency
-   Each color token MUST document its use case and ensure WCAG AA contrast ratio
-   Support light and dark mode via `ThemeData` — never branch on `Brightness` manually in widgets

## Spacing

-   ✅ Use `AppSpacing.xxs` (2), `AppSpacing.xs` (4), `AppSpacing.sm` (8), `AppSpacing.md` (16), `AppSpacing.lg` (24), `AppSpacing.xl` (32), `AppSpacing.xxl` (48)
-   ✅ Use `AppSpacing.screenHorizontal` (24), `AppSpacing.screenVertical` (16) for consistent screen padding
-   ❌ NEVER use `EdgeInsets.all(16.0)`, `SizedBox(height: 8)`, or hardcoded padding values
-   Use `SizedBox(height: AppSpacing.sm)` for gaps — not `Container` or `Padding` with empty child

## Border Radius

-   ✅ Use `AppRadius.xs` (4), `AppRadius.sm` (8), `AppRadius.md` (12), `AppRadius.lg` (16), `AppRadius.xl` (24), `AppRadius.full` (999)
-   ❌ NEVER use `BorderRadius.circular(12)` or inline radius values

## Typography

-   ✅ Use `context.textTheme.headlineLarge`, `context.textTheme.bodyMedium`, etc. via theme extensions
-   ✅ Optionally use `AppTypography` wrapper for custom token names mapping to `TextTheme`
-   ❌ NEVER use `TextStyle(fontSize: 16)` or inline text styles
-   Define font family, size, weight, and letter spacing as tokens

## Iconography

-   Use a consistent icon set (Material Icons, Cupertino Icons, or custom icon font)
-   Wrap icon usage in `AppIcons` constants for consistency
-   Use `Icon(AppIcons.settings, size: AppSpacing.lg)` — not raw `Icons.settings`

# Reusable Components

## Component Rules

-   **Single Responsibility**: Each component has one clear purpose. Complex UIs MUST be composed of smaller, focused components.
-   **Parameterization**: Components expose parameters for customization (text, callbacks, styles). Avoid creating near-duplicate widgets.
-   **Composition Over Inheritance**: Build widgets by composing smaller widgets. Do NOT extend framework widgets unless strictly necessary.
-   **Immutable Widgets**: Design widgets as stateless wherever possible. Manage state externally via BLoC.
-   **Reuse Threshold**: If a widget or pattern appears 2+ times, extract it into `core/views/widgets/`.
-   **Testability**: Every reusable component MUST have a corresponding widget test in the mirror structure.

## Component Organization

```
core/
├── views/
│   └── widgets/
│       ├── buttons/          (AppPrimaryButton, AppOutlinedButton, AppIconButton)
│       ├── cards/            (AppCard, AppInfoCard, AppActionCard)
│       ├── dialogs/          (AppAlertDialog, AppConfirmDialog)
│       ├── inputs/           (AppTextField, AppSearchField, AppDropdown)
│       ├── feedback/         (AppSnackbar, AppToast, AppEmptyState, AppErrorState)
│       ├── loading/          (AppLoadingIndicator, AppShimmer, AppSkeleton)
│       └── layout/           (AppScaffold, AppSectionHeader, AppDivider)
├── theme/
│   ├── app_colors.dart
│   ├── app_spacing.dart
│   ├── app_radius.dart
│   ├── app_typography.dart
│   ├── app_theme.dart        (ThemeData assembly)
│   └── app_theme_extensions.dart (BuildContext extensions)
└── constants/
    └── app_icons.dart
```

## Component Best Practices

-   All reusable widgets MUST accept `Key` parameter via `super.key`
-   Use `const` constructors in all reusable components
-   Provide sensible defaults — components should work with minimal configuration
-   Document each public component with `///` comment explaining purpose, required params, and an inline usage example

# Theming

## ThemeData Assembly

-   Assemble `ThemeData` in a single `app_theme.dart` file using token classes
-   Use `ColorScheme.fromSeed()` or map semantic `AppColors` to `ColorScheme` slots
-   Define both `lightTheme` and `darkTheme` in the same file
-   Use `ThemeExtension<T>` for custom tokens beyond Material's defaults (e.g., `AppSpacing`, `AppRadius`)

## Theme Access

-   ALWAYS access via `BuildContext` extensions: `context.colorScheme`, `context.textTheme`, `context.theme`
-   NEVER pass theme values as constructor parameters when `context` is available
-   NEVER use `Theme.of(context)` directly — use extensions for readability

## Dark Mode

-   Every screen and component MUST render correctly in both light and dark mode
-   Test dark mode as part of widget tests using `MediaQuery` theme override
-   Use semantic color tokens (`surface`, `onSurface`, `primary`, `onPrimary`) — not absolute colors

# Accessibility

-   All interactive components MUST include `Semantics` labels
-   Support minimum touch target size (48x48 dp) per Material guidelines
-   Ensure text scales correctly via `MediaQuery.textScaleFactor`
-   Use sufficient color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text)

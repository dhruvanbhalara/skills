---
name: flutter-setup-localization
description: Configure internationalization and localization support using Flutter's built-in l10n system, App Resource Bundle (ARB) files, and ICU formatting syntax.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "i18n"
---

## Contents
- [Setup and Configuration](#setup-and-configuration)
- [ARB File Structure and Rules](#arb-file-structure-and-rules)
- [ICU Message Formatting](#icu-message-formatting)
- [RTL (Right-to-Left) Layout Support](#rtl-right-to-left-layout-support)
- [Workflow: Adding Localization Support](#workflow-adding-localization-support)
- [Examples](#examples)

## Setup and Configuration

Flutter handles internationalization using the `flutter_localizations` and `intl` packages. The standard workflow compiles `.arb` source files into a synthetic generation package for type-safe code access.

### 1. Add Dependencies
Run the following commands in the terminal to add the required dependencies to your `pubspec.yaml`:
```bash
flutter pub add flutter_localizations --sdk=flutter
flutter pub add intl:any
```

### 2. Enable Code Generation
Enable the `generate` flag inside the `flutter` section of your `pubspec.yaml` file:
```yaml
flutter:
  generate: true
```

### 3. Create Configuration File
Create an `l10n.yaml` file at the root of the project to define localized directory inputs and outputs:
```yaml
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
synthetic-package: true
```

### 4. Configure Application Entry Point
Import the generated synthetic package and inject the delegates and supported locales into your `MaterialApp` or `CupertinoApp`:
```dart
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

// ... inside the MaterialApp build method
return MaterialApp(
  localizationsDelegates: const [
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ],
  supportedLocales: const [
    Locale('en'), // English
    Locale('es'), // Spanish
  ],
  home: const HomeScreen(),
);
```

## ARB File Structure and Rules

App Resource Bundle (`.arb`) files use standard JSON formatting to represent key-value translation strings.

- **File Naming**: Place all ARB files inside `lib/l10n/` using the `app_{locale}.arb` pattern (e.g., `app_en.arb`, `app_es.arb`).
- **Metadata Requirement**: The template file (`app_en.arb`) must contain a corresponding `@key` metadata object for every translation key, providing a clear description to help translation workflows.
- **Key Naming Convention**: Use `camelCase` or snake_case consistently (e.g., `loginTitle` or `login_title`). Maintain clean, descriptive names indicating where the string is consumed.
- **Strict User-facing Isolation**: Prohibit hardcoding any user-facing strings in the presentation layer. Expose all text through ARB keys.

## ICU Message Formatting

Use ICU message syntax within ARB files to handle dynamic arguments, quantity-based plurals, and conditional selection.

### 1. Simple Placeholders
Define parameter names within curly braces and document their type inside the key metadata:
```json
"helloUser": "Hello {name}",
"@helloUser": {
  "description": "Greeting message containing user name",
  "placeholders": {
    "name": {
      "type": "String",
      "example": "Jane"
    }
  }
}
```

### 2. Plurals
Use plural syntax to define countable item variations. The `other` case is strictly mandatory:
```json
"itemsCount": "{count, plural, =0{no items} =1{1 item} other{{count} items}}",
"@itemsCount": {
  "description": "Inventory count message",
  "placeholders": {
    "count": {
      "type": "num"
    }
  }
}
```

### 3. Selection
Use select syntax to display strings depending on an argument match (e.g. enum-like values):
```json
"pronoun": "{gender, select, male{he} female{she} other{they}}",
"@pronoun": {
  "description": "Gendered pronoun selector",
  "placeholders": {
    "gender": {
      "type": "String"
    }
  }
}
```

## RTL (Right-to-Left) Layout Support

When localizing for RTL languages (e.g. Arabic, Hebrew), layouts must adapt automatically:

- **Directional UI**: Use `Directionality` and widgets that automatically resolve writing directions.
- **Directional Spacing**: Never use left/right absolute coordinates. Always prefer directional equivalent margins and padding (e.g. `EdgeInsetsDirectional.only(start: 16)` instead of `EdgeInsets.only(left: 16)`).
- **Flex Alignment**: Prefer `start` and `end` in `MainAxisAlignment` and `CrossAxisAlignment` flex layout configurations rather than absolute `left` or `right` values.

## Workflow: Adding Localization Support

Follow this checklist to implement and expand multi-language support:

- [ ] **Add packages**: Install `flutter_localizations` and `intl` packages.
- [ ] **Enable generation**: Flip the `generate: true` flag in your `pubspec.yaml`.
- [ ] **Configure l10n**: Create `l10n.yaml` at the project root.
- [ ] **Establish template**: Create `lib/l10n/app_en.arb` containing baseline keys and descriptions.
- [ ] **Add target translations**: Create `lib/l10n/app_es.arb` (and other target language files) with translated strings.
- [ ] **Generate code**: Run `flutter pub get` or `flutter gen-l10n` to trigger compilation.
- [ ] **Inject Delegates**: Update `MaterialApp` to define localizations delegates.
- [ ] **Expose context shortcuts**: Add a clean context extension helper to resolve strings cleanly inside widgets:
  ```dart
  extension LocalizedContext on BuildContext {
    AppLocalizations get l10n => AppLocalizations.of(this)!;
  }
  ```
- [ ] **Test layout borders**: Run tests in target RTL/LTR locales to ensure layout and alignment remain elegant.

## Examples

### Complete Base ARB Template (`lib/l10n/app_en.arb`)

```json
{
  "loginHeader": "Welcome Back",
  "@loginHeader": {
    "description": "Main header visible on the authentication screen"
  },
  "greetingMessage": "Welcome, {username}!",
  "@greetingMessage": {
    "description": "Personalized welcome greeting",
    "placeholders": {
      "username": {
        "type": "String",
        "example": "Jane"
      }
    }
  },
  "cartItems": "{count, plural, =0{Your cart is empty} =1{1 item in your cart} other{{count} items in your cart}}",
  "@cartItems": {
    "description": "Cart items indicator showing quantity status",
    "placeholders": {
      "count": {
        "type": "num"
      }
    }
  }
}
```

### Context Consumer Widget

This example consumes localized values cleanly using a custom BuildContext extension helper.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

// 1. Clean BuildContext extension helper
extension LocalizedContext on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this)!;
}

class DashboardHeader extends StatelessWidget {
  final String username;
  final int itemsCount;

  const DashboardHeader({
    super.key,
    required this.username,
    required this.itemsCount,
  });

  @override
  Widget build(BuildContext context) {
    // 2. Consume values cleanly via the extension shortcut
    final l10n = context.l10n;

    return Padding(
      padding: const EdgeInsetsDirectional.only(start: 16.0, end: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            l10n.loginHeader,
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.greetingMessage(username),
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 12),
          Text(
            l10n.cartItems(itemsCount),
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}
```

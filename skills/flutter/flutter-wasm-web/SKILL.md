---
name: flutter-wasm-web
description: Best practices for compiling, optimizing, and deploying Flutter Web applications to WebAssembly (Wasm-GC) using modern JS interop.
metadata:
    platforms: "flutter, web"
    languages: "dart, javascript"
    category: "web"
---

# Flutter Web with WebAssembly (Wasm-GC)

Flutter Web supports compilation to **WebAssembly (Wasm-GC)** for near-native UI rendering performance, smoother animations, and faster load times.

## Contents
- [Compilation & Deployment](#compilation--deployment)
- [Modern JS Interop (`dart:js_interop` and `package:web`)](#modern-js-interop-dartjs_interop-and-packageweb)
- [Wasm-Specific Limitations & Solutions](#wasm-specific-limitations--solutions)
- [Debugging WebAssembly](#debugging-webassembly)

---

## Compilation & Deployment

Compile your application to WebAssembly using the Flutter CLI:

```bash
flutter build web --wasm
```

### Server Configuration
Wasm-GC requires serving specific files with correct HTTP headers. Ensure your web host (Firebase Hosting, Cloudflare, Vercel, Nginx) includes:
- **`Content-Type: application/wasm`** for the generated `.wasm` files.
- COOP and COEP headers (recommended for performance and multithreading safety):
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

---

## Modern JS Interop (`dart:js_interop` and `package:web`)

Wasm-GC compilation **strictly prohibits** using the legacy `dart:html`, `dart:js`, or `package:js` libraries. You must utilize the standard `dart:js_interop` and `package:web` packages.

### JS Interop Core Principles
- **Do not import `dart:html`**. Import `package:web/web.dart` for DOM access.
- Use the `@JS()` annotation for declaring external JavaScript functions.
- Always use Dart JS Types (e.g., `JSString`, `JSNumber`, `JSBool`, `JSAny`, `JSObject`).

### Example: Invoking a JS API
```dart
import 'dart:js_interop';
import 'package:web/web.dart';

// Declare external JS API
@JS('console.log')
external void jsConsoleLog(JSAny message);

@JS('localStorage.setItem')
external void jsSetLocalStorage(JSString key, JSString value);

void main() {
  // Convert Dart types to JS types
  jsConsoleLog('Hello from Wasm-GC!'.toJS);
  jsSetLocalStorage('app_mode'.toJS, 'dark'.toJS);
  
  // Accessing the DOM via package:web
  final windowEl = window;
  jsConsoleLog(windowEl.location.href.toJS);
}
```

---

## Wasm-Specific Limitations & Solutions

### 1. No `dart:io`
- **Impact**: Filesystem, Socket, and standard HTTP Client won't compile.
- **Solution**: Use `package:http` (resolves to browser-native Fetch API) and use IndexedDB or local storage for caching.

### 2. Isolate/Threading limitations
- **Impact**: Standard Dart VM isolates do not run in WebAssembly. Calling `Isolate.spawn` or `compute()` will throw runtime errors on web.
- **Solution**: Use web worker threads via JS Interop if heavy processing is required, or perform computations on the main thread in small chunks.

### 3. Font and Asset Loading
- **Impact**: Wasm compilation renders widgets using CanvasKit. Custom fonts must be declared explicitly in `pubspec.yaml` to prevent fallback font rendering.

---

## Debugging WebAssembly

- **Chrome Developer Tools**: Chrome supports debugging Wasm-GC source maps. You can inspect Dart source code directly in the Chrome Sources panel.
- **Check Compatibility**: Use `flutter run -d chrome --wasm` to run and debug locally under Wasm.

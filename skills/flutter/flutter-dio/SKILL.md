---
name: flutter-dio
description: Implement HTTP networking with Dio including interceptors, retry logic, and response caching. Use when building API clients, configuring authentication headers, or handling network errors gracefully.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "networking"
---

# Networking with Dio

-   Use **Dio** as the primary HTTP client package.
-   Use type-safe model classes with `fromJson` / `toJson` factories for all request/response bodies.
-   Handle all HTTP status codes appropriately with typed exceptions (e.g., `ServerException`, `NetworkException`, `UnauthorizedException`).
-   Use proper request timeouts (`connectTimeout`, `receiveTimeout`, `sendTimeout`).

# Dio Interceptors

-   Use interceptors for cross-cutting concerns:
    -   **Auth Interceptor**: Attach access tokens to headers, handle token refresh on 401.
    -   **Logging Interceptor**: Log requests/responses in debug mode via `AppLogger`.
    -   **Error Interceptor**: Transform `DioException` into domain-specific `Failure` types.
-   Register interceptors centrally via `injectable` for consistent behavior across all API calls.

# Repository Pattern

-   DataSources contain only raw Dio API calls — no business logic or mapping
-   Repositories orchestrate between remote DataSources and local cache for network data

# Retry & Resilience

-   Implement retry logic with exponential backoff for transient failures (e.g., 500, timeout).
-   Set a maximum retry count (default: 3 retries).
-   Cache responses when appropriate to reduce network calls and improve offline UX.

# Performance

-   Parse JSON in background isolates for large responses (> 1MB) using `compute()`
-   Do NOT block the UI thread with synchronous network operations

# Security

-   Store tokens via `flutter_secure_storage` — never in source code or `SharedPreferences`
-   All API communication MUST use HTTPS

# Alternative: http Package

For simple REST calls that don't need interceptors, caching, or retry logic, use `http` instead of Dio.

## Dio vs http

| Criteria | `http` | `Dio` |
|---|---|---|
| **Interceptors** | No | Yes, full chain |
| **Retry logic** | Manual | Built-in with backoff |
| **Response caching** | Manual | Plugin available |
| **FormData / Multipart** | Manual | Built-in |
| **Cancel requests** | No | Yes, `CancelToken` |
| **Dependencies** | Minimal (1 package) | Heavier |
| **Use case** | Simple CRUD APIs | Production API clients |

Use `http` for prototypes and simple fetch-and-display. Use `Dio` for production API clients that need auth, retry, and caching.

## Basic http Patterns

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

// GET request
Future<Map<String, dynamic>> fetchData(http.Client client) async {
  final response = await client.get(
    Uri.parse('https://api.example.com/data'),
    headers: {'Accept': 'application/json'},
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body) as Map<String, dynamic>;
  } else {
    throw Exception('Failed to fetch: ${response.statusCode}');
  }
}

// POST request
Future<void> createItem(http.Client client, Map<String, dynamic> body) async {
  final response = await client.post(
    Uri.parse('https://api.example.com/items'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  if (response.statusCode != 201) {
    throw Exception('Failed to create: ${response.statusCode}');
  }
}
```

**Testing**: Always accept `http.Client` as a parameter (not `http.get()` directly) to enable mock injection in tests.

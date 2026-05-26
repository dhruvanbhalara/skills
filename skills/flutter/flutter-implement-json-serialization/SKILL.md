---
name: flutter-implement-json-serialization
description: Create model classes with fromJson/toJson using dart:convert and Dart 3 pattern matching. Use when manually mapping JSON to classes, parsing HTTP responses, or choosing between manual and code-generated serialization.
metadata:
    platforms: "flutter, dart"
    languages: "dart"
    category: "data"
---

## Contents
- [Core Guidelines](#core-guidelines)
- [Dart 3 Pattern Matching in fromJson](#dart-3-pattern-matching-in-fromjson)
- [Background Parsing](#background-parsing)
- [Manual vs Code-Gen Decision](#manual-vs-code-gen-decision)
- [Workflow: Implementing a Serializable Model](#workflow-implementing-a-serializable-model)
- [Workflow: Fetching and Parsing JSON](#workflow-fetching-and-parsing-json)
- [Examples](#examples)

## Core Guidelines

-   **Import `dart:convert`**: Use `jsonEncode()` and `jsonDecode()` for manual serialization.
-   **Type Safety**: Always cast `jsonDecode()` result to `Map<String, dynamic>` (objects) or `List<dynamic>` (arrays). Never work with raw `dynamic`.
-   **Encapsulation**: Define `fromJson` factory constructor and `toJson` method within the model class.
-   **Background Parsing**: Offload to a separate isolate via `compute()` if parsing takes > 16ms (large JSON payloads).
-   **Error Handling**: Throw `FormatException` on invalid JSON. Never return `null` from `fromJson`.

## Dart 3 Pattern Matching in fromJson

Use `switch` expressions with destructuring for type-safe, concise deserialization:

```dart
import 'dart:convert';

class User {
  final int id;
  final String name;
  final String email;

  const User({required this.id, required this.name, required this.email});

  factory User.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final int id,
        'name': final String name,
        'email': final String email,
      } =>
        User(id: id, name: name, email: email),
      _ => throw const FormatException('Invalid User JSON'),
    };
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
  };
}
```

**Benefits over manual casting**:
-   Compile-time type checking in destructuring patterns
-   Single expression handles both extraction and validation
-   `FormatException` thrown automatically on type mismatch

### Nested Objects
```dart
class Post {
  final int id;
  final String title;
  final User author;

  const Post({required this.id, required this.title, required this.author});

  factory Post.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final int id,
        'title': final String title,
        'author': final Map<String, dynamic> authorJson,
      } =>
        Post(id: id, title: title, author: User.fromJson(authorJson)),
      _ => throw const FormatException('Invalid Post JSON'),
    };
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'author': author.toJson(),
  };
}
```

## Background Parsing

For large JSON payloads (thousands of objects), offload parsing to a background isolate:

```dart
import 'dart:convert';
import 'package:flutter/foundation.dart';

// MUST be a top-level function (not a method or closure)
List<User> parseUsers(String responseBody) {
  final parsed = (jsonDecode(responseBody) as List<dynamic>)
      .cast<Map<String, dynamic>>();
  return parsed.map<User>((json) => User.fromJson(json)).toList();
}

Future<List<User>> fetchUsers(http.Client client) async {
  final response = await client.get(Uri.parse('https://api.example.com/users'));

  if (response.statusCode == 200) {
    return compute(parseUsers, response.body);
  } else {
    throw Exception('Failed to load users: ${response.statusCode}');
  }
}
```

**Rules**:
-   The parsing function MUST be top-level or static (not an instance method).
-   Use `compute()` for simple isolate tasks. For complex scenarios, use `Isolate.run()`.
-   Threshold: parse > 10,000 items or > 1MB payload → use background isolate.

## Manual vs Code-Gen Decision

| Criteria | Manual (`dart:convert`) | Code-Gen (`json_serializable` / `freezed`) |
|---|---|---|
| **Model count** | < 5 models | > 5 models |
| **Nesting depth** | Shallow (1-2 levels) | Deep / complex hierarchies |
| **Dev dependency** | None | `build_runner`, `json_annotation` |
| **Type safety** | Dart 3 pattern matching | Generated code |
| **Boilerplate** | Manual per model | Auto-generated |
| **Build time** | None | Adds `build_runner` step |
| **Flexibility** | Full control over parsing | Constrained by annotations |

**Recommendation**: Start with manual serialization for prototypes and small models. Migrate to `json_serializable` or `freezed` when the model count exceeds 5 or nesting becomes complex. See `flutter-code-gen` skill for code generation workflows.

## Workflow: Implementing a Serializable Model

### Task Progress
- [ ] **Step 1**: Define model class with `final` properties and `const` constructor.
- [ ] **Step 2**: Implement `factory Model.fromJson(Map<String, dynamic> json)` using pattern matching.
- [ ] **Step 3**: Implement `Map<String, dynamic> toJson()` method.
- [ ] **Step 4**: Write unit tests for serialization round-trip (`fromJson(toJson(model)) == model`).
- [ ] **Step 5**: Run tests — `dart test` or `flutter test`.
- [ ] **Step 6**: Feedback Loop — fix type mismatch errors → re-run until green.

## Workflow: Fetching and Parsing JSON

### Task Progress
- [ ] **Step 1**: Execute HTTP request.
- [ ] **Step 2**: Validate response status code (200 → proceed, else → throw).
- [ ] **Step 3**: Determine parsing strategy:
  - Small payload → parse synchronously on main thread.
  - Large payload → use `compute(parseFunction, response.body)`.
- [ ] **Step 4**: Decode and map JSON to model via `fromJson`.

## Examples

### Synchronous HTTP Fetch + Parse
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<User> fetchUser(http.Client client, int userId) async {
  final response = await client.get(
    Uri.parse('https://api.example.com/users/$userId'),
    headers: {'Accept': 'application/json'},
  );

  if (response.statusCode == 200) {
    final Map<String, dynamic> jsonMap =
        jsonDecode(response.body) as Map<String, dynamic>;
    return User.fromJson(jsonMap);
  } else {
    throw Exception('Failed to load user: ${response.statusCode}');
  }
}
```

### List Parsing with Type Safety
```dart
Future<List<User>> fetchAllUsers(http.Client client) async {
  final response = await client.get(
    Uri.parse('https://api.example.com/users'),
  );

  if (response.statusCode == 200) {
    final List<dynamic> jsonList = jsonDecode(response.body) as List<dynamic>;
    return jsonList
        .map((e) => User.fromJson(e as Map<String, dynamic>))
        .toList();
  } else {
    throw Exception('Failed to load users');
  }
}
```

### Unit Test for Serialization
```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('$User', () {
    test('fromJson creates valid User', () {
      final json = {'id': 1, 'name': 'Alice', 'email': 'alice@test.com'};
      final user = User.fromJson(json);

      expect(user.id, 1);
      expect(user.name, 'Alice');
      expect(user.email, 'alice@test.com');
    });

    test('toJson returns valid map', () {
      const user = User(id: 1, name: 'Alice', email: 'alice@test.com');
      final json = user.toJson();

      expect(json['id'], 1);
      expect(json['name'], 'Alice');
    });

    test('round-trip serialization', () {
      const original = User(id: 1, name: 'Alice', email: 'alice@test.com');
      final json = original.toJson();
      final restored = User.fromJson(json);

      expect(restored.id, original.id);
      expect(restored.name, original.name);
      expect(restored.email, original.email);
    });

    test('throws FormatException on invalid JSON', () {
      final invalidJson = {'id': 'not_an_int', 'name': 'Alice'};
      expect(() => User.fromJson(invalidJson), throwsFormatException);
    });
  });
}
```

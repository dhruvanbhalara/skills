---
name: flutter-use-http-package
description: Perform REST API networking operations (GET, POST, PUT, DELETE) using the lightweight and robust standard `http` package, including platform configurations and background parsing models.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "networking"
---

## Contents
- [Configuration and Permissions](#configuration-and-permissions)
- [Request Execution and Response Handling](#request-execution-and-response-handling)
- [Background Parsing](#background-parsing)
- [Workflow: Executing Network Operations](#workflow-executing-network-operations)
- [Examples](#examples)

## Configuration and Permissions

Configure the development environment and platform-specific access controls to enable network requests:

1. Add the `http` dependency using your terminal:
   ```bash
   flutter pub add http
   ```
2. Import the library with an alias in your Dart files:
   ```dart
   import 'package:http/http.dart' as http;
   ```
3. Enable internet permissions on Android by modifying `android/app/src/main/AndroidManifest.xml` within the `<manifest>` tag:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```
4. Enable internet clients on macOS by modifying `macos/Runner/DebugProfile.entitlements` and `macos/Runner/Release.entitlements` within the `<dict>` tag:
   ```xml
   <key>com.apple.security.network.client</key>
   <true/>
   ```

## Request Execution and Response Handling

Design robust REST clients by applying these best practices:

- **Strict URL Parsing**: Always parse endpoint strings via `Uri.parse('url')`. Never pass raw strings to client calls.
- **Headers and Authentication**: Attach all authorization, accept, and content-type configurations. Inject access tokens using the `HttpHeaders.authorizationHeader` key from `dart:io`.
- **Payload Encoding**: When mutating resource states (POST, PUT), encode payload bodies with `jsonEncode` from `dart:convert`.
- **Status Validation**: Verify response codes. Handle only explicit success status codes (e.g. `200 OK` or `201 Created`).
- **Throw on Errors**: Throw descriptive exceptions when the server responds with unsuccessful status codes. Never return `null` on failure, as this hides issues and results in infinite UI loading spinners.
- **Client Mocking**: Accept an `http.Client` dependency in your network classes instead of calling standard global methods. This facilitates easy testing and mock injection.

## Background Parsing

Offload JSON decoding and mapping to a background thread to prevent UI jank (dropped frames) when handling payloads larger than 1MB:

- Import `package:flutter/foundation.dart`.
- Run the parsing logic within the `compute()` function to spawn a background isolate.
- Ensure the parsing function is defined as a top-level function or static class method. Closures and standard instance methods cannot cross isolate boundaries.

## Workflow: Executing Network Operations

Follow this checklist to build and verify network integration:

- [ ] **Define model contracts**: Create clear, immutable model classes with a custom `fromJson` factory constructor.
- [ ] **Establish HTTP clients**: Build the network client class accepting `http.Client`.
- [ ] **Formulate requests**:
  - [ ] For reading (GET): Attach query parameters to the URI.
  - [ ] For mutations (POST/PUT): Set `'Content-Type': 'application/json; charset=UTF-8'` and attach `jsonEncode` data.
  - [ ] For deletions (DELETE): Return success indicators or empty model mappings upon matching `200 OK`.
- [ ] **Enforce error handling**: Throw meaningful exceptions for non-success status codes.
- [ ] **Integrate UI state**: Bind network requests to a `FutureBuilder` or state management controller in the UI layer.
- [ ] **Verify boundaries**: Test with proper loading screens, error dialogs, and offline-handling feedback loops.

## Examples

### Complete Network Client and Isolate Parser

This example demonstrates setting up a robust, testable network client that parses complex payload lists in a background isolate.

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// 1. Top-level parsing function (required to run in a separate Isolate)
List<Product> parseProducts(String responseBody) {
  final parsed = (jsonDecode(responseBody) as List<dynamic>).cast<Map<String, dynamic>>();
  return parsed.map<Product>((json) => Product.fromJson(json)).toList();
}

// 2. Service Layer exposing testable methods
class ProductService {
  final http.Client client;

  const ProductService({required this.client});

  Future<List<Product>> fetchProducts() async {
    final response = await client.get(
      Uri.parse('https://api.example.com/products'),
      headers: {
        HttpHeaders.acceptHeader: 'application/json',
        HttpHeaders.authorizationHeader: 'Bearer token_here',
      },
    );

    if (response.statusCode == 200) {
      // Offload heavy JSON parsing of larger lists to a background isolate
      return compute(parseProducts, response.body);
    } else {
      throw HttpException('Failed to load products. Status: ${response.statusCode}');
    }
  }
}

// 3. Immutable Data Model
class Product {
  final int id;
  final String name;
  final double price;

  const Product({
    required this.id,
    required this.name,
    required this.price,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
    );
  }
}

// 4. UI Layer Integration
class ProductListView extends StatefulWidget {
  final ProductService productService;

  const ProductListView({
    super.key,
    required this.productService,
  });

  @override
  State<ProductListView> createState() => _ProductListViewState();
}

class _ProductListViewState extends State<ProductListView> {
  late Future<List<Product>> _futureProducts;

  @override
  void initState() {
    super.initState();
    // Cache the future once to prevent redundant re-fetching on rebuilds
    _futureProducts = widget.productService.fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Store Products'),
      ),
      body: FutureBuilder<List<Product>>(
        future: _futureProducts,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final products = snapshot.data!;
            return ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return ListTile(
                  title: Text(product.name),
                  trailing: Text('\$${product.price.toStringAsFixed(2)}'),
                );
              },
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'An error occurred: ${snapshot.error}',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          return const Center(
            child: CircularProgressIndicator(),
          );
        },
      ),
    );
  }
}
```

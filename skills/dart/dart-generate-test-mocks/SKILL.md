---
name: dart-generate-test-mocks
description: Define and generate mock objects for external dependencies using `package:mockito` and the `build_runner` code generation lifecycle for unit testing classes.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "testing"
---

## Contents
- [Structuring Code for Testability](#structuring-code-for-testability)
- [Managing Dev Dependencies](#managing-dev-dependencies)
- [Generating Mock Files](#generating-mock-files)
- [Stubbing and Verification Best Practices](#stubbing-and-verification-best-practices)
- [Workflow: Generating Mocks and Validating Tests](#workflow-generating-mocks-and-validating-tests)
- [Examples](#examples)

## Structuring Code for Testability

To write effective unit tests, structure your codebase using dependency injection. Isolate operations that interact with physical layers (like disk storage, external servers, and platform channels) so they can be replaced by mock objects at test time:

- **Constructor Injection**: Pass all service dependencies (e.g. HTTP clients, database helper clients) into class constructors rather than instantiating them directly within the class.
- **Interface Segregation**: Define clear, abstract base classes representing your service contracts. Mocks should ideally target these abstract contracts rather than concrete service implementations.

## Managing Dev Dependencies

Configure your `pubspec.yaml` to specify the packages required for code generation and mock testing:

1. Add target testing frameworks and generators under `dev_dependencies`:
   ```bash
   dart pub add dev:test dev:mockito dev:build_runner
   ```
2. Import Mockito annotations inside your test files:
   ```dart
   import 'package:mockito/annotations.dart';
   import 'package:mockito/mockito.dart';
   ```

## Generating Mock Files

Leverage `package:mockito` alongside `build_runner` to generate mock structures automatically:

- **GenerateNiceMocks**: Always use the `@GenerateNiceMocks` annotation instead of the legacy `@GenerateMocks`. Nice mocks automatically return null or matching default values instead of throwing "MissingStubException" when a method is invoked without a pre-configured stub.
- **MockSpec Configuration**: Annotate your test file's entry point with `@GenerateNiceMocks([MockSpec<YourService>()])`.
- **Mirror Extension Import**: Import the matching generated file using the `.mocks.dart` suffix (e.g. `import 'service_test.mocks.dart'`).
- **Run Generator**: Trigger code generation via the CLI:
   ```bash
   dart run build_runner build --delete-conflicting-outputs
   ```

## Stubbing and Verification Best Practices

Write robust mock interactions by adhering to these guidelines:

- **Future and Stream Stubbing**: When stubbing methods that return a `Future` or a `Stream`, **always** use `.thenAnswer((_) async => value)`. Never use `.thenReturn()` for asynchronous return values, as this causes runtime cast errors.
- **Invocation Tracking**: Use the `verify()` API to verify that specific methods were invoked. Call `.called(number)` to assert precise invocation counts.
- **Unused Assertions**: Use `verifyNever()` or `verifyNoMoreInteractions(mock)` to guarantee that no unexpected actions occurred during the test lifecycle.

## Workflow: Generating Mocks and Validating Tests

Follow this checklist to establish mock configurations:

- [ ] **Constructor check**: Ensure the target service class accepts dependencies via its constructor.
- [ ] **Write test file**: Create `test/feature_test.dart` and import Mockito along with testing libraries.
- [ ] **Annotate entrypoint**: Add `@GenerateNiceMocks([MockSpec<TargetService>()])` above `main()`.
- [ ] **Declare mock import**: Add the import statement targeting `feature_test.mocks.dart`.
- [ ] **Generate code**: Run `dart run build_runner build` in your terminal to create the mocked file.
- [ ] **Instantiate mocks**: In the `setUp` callback, instantiate the generated mock class (e.g. `mockService = MockTargetService()`).
- [ ] **Apply stubbing**: Configure behavior in your test cases using `when()`.
- [ ] **Execute and assert**: Call the system under test, verifying outputs via `expect()`.
- [ ] **Verify calls**: Use `verify()` to assert mock interactions.

## Examples

### Complete Mocked Test Suit (Mockito)

This example shows how to mock a remote API client to test a database synchronization service.

```dart
import 'package:test/test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;

// Define an abstract contract for a user repository
abstract class UserRepository {
  Future<String> getUserName(int id);
}

// System Under Test consuming the repository
class UserService {
  final UserRepository repository;

  UserService(this.repository);

  Future<String> fetchDisplayName(int id) async {
    try {
      final name = await repository.getUserName(id);
      return 'User: $name';
    } catch (_) {
      return 'Unknown User';
    }
  }
}

// 1. Annotate to generate MockUserRepository
@GenerateNiceMocks([MockSpec<UserRepository>()])
import 'user_service_test.mocks.dart';

void main() {
  group('UserService', () {
    late MockUserRepository mockRepo;
    late UserService userService;

    setUp(() {
      mockRepo = MockUserRepository();
      userService = UserService(mockRepo);
    });

    test('returns formatted display name when repository succeeds', () async {
      // 2. Arrange: Stub the async getUserName method
      when(mockRepo.getUserName(42)).thenAnswer(
        (_) async => 'Alice',
      );

      // 3. Act: Run target method
      final displayName = await userService.fetchDisplayName(42);

      // 4. Assert: Validate outcomes
      expect(displayName, equals('User: Alice'));

      // 5. Verify: Assert the repository method was invoked with correct arguments
      verify(mockRepo.getUserName(42)).called(1);
    });

    test('returns fallback string when repository throws exception', () async {
      // Arrange: Stub to throw error
      when(mockRepo.getUserName(any)).thenThrow(
        Exception('Connection Timeout'),
      );

      // Act
      final displayName = await userService.fetchDisplayName(99);

      // Assert
      expect(displayName, equals('Unknown User'));
    });
  });
}
```

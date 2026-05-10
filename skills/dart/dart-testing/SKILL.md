---
name: dart-testing
description: Write unit tests with mocking and coverage analysis for pure Dart projects and CLI apps. Use when testing business logic, generating mocks with Mockito or mocktail, or measuring test coverage.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "testing"
---
# Dart Testing Suite

## Contents
- [Unit Testing](#unit-testing)
- [Mocking Dependencies](#mocking-dependencies)
- [Test Coverage](#test-coverage)
- [Workflow: Testing Execution](#workflow-testing-execution)

## Unit Testing
Utilize `package:test` as the standard testing library for Dart CLI and backend applications.
* Organize test files to mirror the `lib` directory structure. Append `_test.dart` to test files.
* Group related tests using the `group()` function.
* Use `setUp()` and `tearDown()` for shared test state.
* Write pure logic inside Domain/BLoC and extract to static pure functions for 100% unit test coverage.
* Use string interpolation for test group names: `group('$ClassName', ...)`
* Structure each test using the **Arrange-Act-Assert** (Given-When-Then) convention:
  - **Arrange**: Set up mocks, create instances, prepare input data.
  - **Act**: Call the method under test.
  - **Assert**: Verify the output or side effects.
* Separate setup from verification to keep tests readable and maintainable.

## Mocking Dependencies
Use `package:mockito` or `package:mocktail` for dependency mocking.
* Never use real implementation dependencies in unit tests, except for lightweight data models.
* Use `@GenerateNiceMocks([MockSpec<YourService>()])` with Mockito, and run `build_runner`.
* Verify interactions using `verify(mockObj.method()).called(1)`.

## Test Coverage
* Target 100% logic coverage for domain models and business logic.
* Run coverage with `dart test --coverage=coverage` or `flutter test --coverage`.
* Use `format_coverage` to convert the `lcov.info` into an HTML report if needed.

## Workflow: Testing Execution
Follow this sequential workflow when testing a Dart feature. Copy the checklist to track progress.

### Task Progress
- [ ] **Step 1: Write Unit Tests.** Focus on core business logic. Ensure files end with `_test.dart`.
- [ ] **Step 2: Generate Mocks.** Run `dart run build_runner build` to generate mocks if using Mockito.
- [ ] **Step 3: Run Tests.** Execute `dart test`.
- [ ] **Step 4: Check Coverage.** Run `dart test --coverage=coverage` and verify coverage targets are met.

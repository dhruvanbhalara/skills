---
name: dart-genkit
description: Guide for utilizing the Genkit Dart SDK to build full-stack, AI-powered agentic applications.
metadata:
    platforms: "dart"
    languages: "dart"
    category: "ai"
---

# AI Engineering with Genkit Dart

Build structured, type-safe, and observable AI-powered workflows and agents using the **Genkit Dart SDK**.

## Contents
- [Project Setup](#project-setup)
- [Defining Prompts & Models](#defining-prompts--models)
- [Creating Custom Tools](#creating-custom-tools)
- [Orchestrating Flows](#orchestrating-flows)
- [Best Practices](#best-practices)

---

## Project Setup

1. Add the Genkit package to your Dart project's `pubspec.yaml`:
   ```yaml
   dependencies:
     genkit: ^0.1.0-preview  # Replace with the latest version
     google_generative_ai: ^0.4.0
   ```
2. Set up your API credentials (e.g., Gemini API key) in your environment:
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

---

## Defining Prompts & Models

Genkit separates model invocation and prompt structure from core application logic using structured prompts.

```dart
import 'package:genkit/genkit.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

void main() async {
  // Initialize Genkit
  final ai = Genkit(
    model: 'gemini-1.5-flash',
    apiKey: String.fromEnvironment('GEMINI_API_KEY'),
  );

  // Invoke the model with a simple prompt
  final response = await ai.generate(
    prompt: 'Explain the concept of monads in Dart.',
  );
  
  print(response.text);
}
```

---

## Creating Custom Tools

Genkit agents utilize **Tools** to execute tasks (e.g., database queries, web scraping, mathematical calculations).

```dart
import 'package:genkit/genkit.dart';

// 1. Define schemas for input and output
final additionInputSchema = Schema.object({
  'a': Schema.number(description: 'First number'),
  'b': Schema.number(description: 'Second number'),
});

// 2. Define the tool
final addTool = ai.defineTool(
  name: 'addNumbers',
  description: 'Adds two numbers together.',
  inputSchema: additionInputSchema,
  action: (input) async {
    final a = input['a'] as num;
    final b = input['b'] as num;
    return {'result': a + b};
  },
);
```

---

## Orchestrating Flows

Flows are executable pipelines that support structured input and output schemas, built-in telemetry, and error handling.

```dart
import 'package:genkit/genkit.dart';

// Define the input and output schemas
final jokeRequestSchema = Schema.object({
  'topic': Schema.string(description: 'The topic for the joke'),
});

final jokeResponseSchema = Schema.object({
  'setup': Schema.string(),
  'punchline': Schema.string(),
});

// Define the Flow
final jokeFlow = ai.defineFlow(
  name: 'jokeFlow',
  inputSchema: jokeRequestSchema,
  outputSchema: jokeResponseSchema,
  action: (input) async {
    final topic = input['topic'] as String;
    
    final response = await ai.generate(
      prompt: 'Tell me a structured joke about $topic.',
      responseSchema: jokeResponseSchema,
    );
    
    return response.structuredOutput!;
  },
);

void main() async {
  // Run the flow
  final result = await jokeFlow.run({'topic': 'coding'});
  print('Setup: ${result['setup']}');
  print('Punchline: ${result['punchline']}');
}
```

---

## Best Practices

- **Exhaustive Schema Definitions**: Always define explicit `inputSchema` and `outputSchema` for tools and flows to ensure the LLM generates correctly structured arguments.
- **Environment Isolation**: Do not hardcode API keys. Use environment variables or secure credential storage.
- **Trace Observability**: Enable Genkit's trace observability in development to inspect agent decision trees and tool invocations.
- **Error Handling**: Wrap tool execution in standard `try-catch` blocks and return error details gracefully so the agent can self-correct.

---
name: flutter-fix-layout-issues
description: Diagnose and fix Flutter layout constraint violations (RenderFlex overflow, unbounded height/width, ParentData misuse). Use when encountering layout exceptions, yellow-black overflow stripes, or red error screens.
metadata:
    platforms: "flutter"
    languages: "dart"
    category: "debugging"
---

## Contents
- [Constraint Model](#constraint-model)
- [Error Signature Catalog](#error-signature-catalog)
- [Resolution Patterns](#resolution-patterns)
- [Workflow: Fixing Layout Issues](#workflow-fixing-layout-issues)
- [Examples](#examples)

## Constraint Model

Flutter layout operates on a strict negotiation rule:

> **Constraints go down. Sizes go up. Parent sets position.**

1.  A parent widget passes **constraints** (min/max width and height) to its child.
2.  The child determines its own **size** within those constraints.
3.  The parent decides the child's **position**.

Layout errors occur when this negotiation fails — typically when a parent provides **unbounded** constraints (infinite width or height) and the child attempts to expand infinitely.

## Error Signature Catalog

| Error Message | Root Cause | Quick Fix |
|---|---|---|
| `Vertical viewport was given unbounded height` | Scrollable (`ListView`, `GridView`) inside unconstrained vertical parent (`Column`) | Wrap in `Expanded` or `SizedBox(height: ...)` |
| `An InputDecorator...cannot have an unbounded width` | `TextField` inside unconstrained horizontal parent (`Row`) | Wrap in `Expanded` |
| `A RenderFlex overflowed by X pixels` | Child exceeds parent's allocated constraints | Wrap in `Expanded`, `Flexible`, or use `overflow: TextOverflow.ellipsis` |
| `Incorrect use of ParentData widget` | `Expanded` outside `Flex`, `Positioned` outside `Stack` | Move widget to be direct child of correct parent |
| `RenderBox was not laid out` | **Cascading error** — look upstream in stack trace | Fix the primary constraint error above it |

**Rule**: Always fix the **first** error in the stack trace. `RenderBox was not laid out` is almost always a cascading side effect.

## Resolution Patterns

### Decision Tree

```
Error detected
├── Contains "unbounded height"?
│   └── Wrap scrollable child in Expanded or SizedBox
├── Contains "unbounded width"?
│   └── Wrap TextField/InputDecorator in Expanded
├── Contains "RenderFlex overflowed"?
│   ├── Text overflow?
│   │   └── Add overflow: TextOverflow.ellipsis + Expanded wrapper
│   └── Widget overflow?
│       └── Wrap in Expanded or Flexible
├── Contains "ParentData"?
│   └── Ensure Expanded is direct child of Row/Column/Flex
│       Ensure Positioned is direct child of Stack
└── Contains "RenderBox was not laid out"?
    └── IGNORE — fix the error above this one
```

### Expanded vs Flexible vs SizedBox

| Widget | Behavior | Use When |
|---|---|---|
| `Expanded` | Forces child to fill ALL remaining space | Child should stretch to fill |
| `Flexible` | Allows child to be SMALLER than remaining space | Child has natural size but shouldn't overflow |
| `SizedBox` | Provides absolute fixed constraints | You know the exact dimension needed |
| `ConstrainedBox` | Sets min/max constraints | You need bounded flexibility |

## Workflow: Fixing Layout Issues

### Task Progress
- [ ] **Step 1**: Run app in debug mode — capture the exact exception in console.
- [ ] **Step 2**: Identify the **primary** error message (ignore cascading `RenderBox was not laid out`).
- [ ] **Step 3**: Match error against the Error Signature Catalog above.
- [ ] **Step 4**: Apply the conditional fix:
  - If `unbounded height` → wrap scrollable in `Expanded` or `SizedBox`
  - If `unbounded width` → wrap input in `Expanded`
  - If `RenderFlex overflowed` → wrap in `Expanded` or `Flexible`
  - If `ParentData` → restructure widget tree
- [ ] **Step 5**: Hot reload → verify the error is resolved.
- [ ] **Step 6**: If new layout errors appear → repeat from Step 2.

## Examples

### Fixing Unbounded Height (ListView in Column)

**Before (throws `Vertical viewport was given unbounded height`):**
```dart
Column(
  children: <Widget>[
    const Text('Header'),
    ListView(
      children: const <Widget>[
        ListTile(title: Text('Item 1')),
        ListTile(title: Text('Item 2')),
      ],
    ),
  ],
)
```

**After (resolved):**
```dart
Column(
  children: <Widget>[
    const Text('Header'),
    Expanded(
      child: ListView(
        children: const <Widget>[
          ListTile(title: Text('Item 1')),
          ListTile(title: Text('Item 2')),
        ],
      ),
    ),
  ],
)
```

### Fixing Unbounded Width (TextField in Row)

**Before (throws `An InputDecorator...cannot have an unbounded width`):**
```dart
Row(
  children: [
    const Icon(Icons.search),
    TextField(),
  ],
)
```

**After (resolved):**
```dart
Row(
  children: [
    const Icon(Icons.search),
    Expanded(
      child: TextField(),
    ),
  ],
)
```

### Fixing RenderFlex Overflow (Text in Row)

**Before (throws `A RenderFlex overflowed by X pixels on the right`):**
```dart
Row(
  children: [
    const Icon(Icons.info),
    Text('This is a very long text that will overflow the screen width'),
  ],
)
```

**After (resolved):**
```dart
Row(
  children: [
    const Icon(Icons.info),
    Expanded(
      child: Text(
        'This is a very long text that will overflow the screen width',
        overflow: TextOverflow.ellipsis,
      ),
    ),
  ],
)
```

### Fixing ParentData Misuse

**Before (throws `Incorrect use of ParentData widget`):**
```dart
// Expanded must be a DIRECT child of Row/Column/Flex
Container(
  child: Expanded(  // WRONG: Expanded not inside a Flex
    child: Text('Hello'),
  ),
)
```

**After (resolved):**
```dart
Row(
  children: [
    Expanded(  // OK: Direct child of Row (a Flex widget)
      child: Text('Hello'),
    ),
  ],
)
```

---
title: list
layout: default
parent: CLI Reference
nav_order: 5
---

# list command

List available transforms or sentence types.

```bash
malarky list <category> [options]
```

## Categories

| Category     | Description                           |
| ------------ | ------------------------------------- |
| `transforms` | List all registered output transforms |
| `types`      | List all sentence types               |

## Options

| Option   | Short | Description    |
| -------- | ----- | -------------- |
| `--json` |       | Output as JSON |
| `--help` | `-h`  | Show help      |

## Examples

### List transforms

```bash
malarky list transforms
```

Output:

```
Available transforms:
  pigLatin      - Classic Pig Latin
  ubbiDubbi     - Ubbi Dubbi language game
  leet          - Leetspeak character substitution
  uwu           - Cute speak (w-substitution, suffixes)
  pirate        - Pirate speak
  redact        - Redact/mask words
  emoji         - Add emoji replacements
  mockCase      - Random case alternation
  reverseWords  - Reverse word order
  bizJargon     - Business jargon patterns
```

### List sentence types

```bash
malarky list types
```

### JSON output

```bash
malarky list transforms --json
```

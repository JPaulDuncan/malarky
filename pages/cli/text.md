---
title: text
layout: default
parent: CLI Reference
nav_order: 3
---

# text command

Generate a text block (multiple paragraphs).

```bash
malarky text [options]
```

## Options

| Option                 | Short | Description                                    |
| ---------------------- | ----- | ---------------------------------------------- |
| `--paragraphs <n>`     |       | Exact number of paragraphs                     |
| `--min-paragraphs <n>` |       | Minimum paragraphs                             |
| `--max-paragraphs <n>` |       | Maximum paragraphs                             |
| `--hints <tags>`       |       | Comma-separated hint tags                      |
| `--seed <n>`           | `-s`  | RNG seed for deterministic output              |
| `--lexicon <path>`     | `-l`  | Path to a lexicon JSON file                    |
| `--archetype <name>`   | `-a`  | Archetype to activate                          |
| `--transform <id>`     | `-x`  | Output transform (repeatable, comma-separated) |
| `--trace`              | `-t`  | Output JSON trace to stderr                    |
| `--json`               | `-j`  | Output full result as JSON to stdout           |
| `--count <n>`          | `-n`  | Number of text blocks (default: 1)             |

## Examples

### Basic generation

```bash
# Random text block (1-3 paragraphs by default)
malarky text

# Exact paragraph count
malarky text --paragraphs 4

# Paragraph count range
malarky text --min-paragraphs 2 --max-paragraphs 6
```

### With a lexicon

```bash
malarky text --lexicon ./corp.json --archetype corporate --seed 42
```

### With transforms

```bash
malarky text --transform bizJargon --json
```

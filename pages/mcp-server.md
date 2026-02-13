---
title: MCP Server
layout: default
nav_order: 9
---

# MCP Server

The `malarky-mcp` package is an [MCP](https://modelcontextprotocol.io) (Model Context Protocol) server that lets LLMs generate nonsense text, apply morphology operations, and validate lexicons -- directly as tool calls.

It works with Claude Desktop, Claude Code, Cursor, and any other MCP-compatible client.

## Installation

```bash
npm install -g malarky-mcp
```

Or run without installing:

```bash
npx malarky-mcp
```

## Setup

### Claude Desktop

Add to your Claude Desktop config file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "malarky": {
      "command": "npx",
      "args": ["malarky-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add malarky -- npx malarky-mcp
```

### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "malarky": {
      "command": "npx",
      "args": ["malarky-mcp"]
    }
  }
}
```

## Tools

The server exposes seven tools. All parameters are optional unless marked **required**.

---

### `generate_sentence`

Generate one or more sentences of syntactically plausible English nonsense.

| Parameter    | Type   | Description                                                  |
| ------------ | ------ | ------------------------------------------------------------ |
| `seed`       | number | RNG seed for deterministic output                            |
| `type`       | string | Sentence structure (see [`list_sentence_types`](#list_sentence_types)) |
| `count`      | number | Number of sentences to generate (1--50, default: 1)          |
| `minWords`   | number | Minimum words per sentence                                   |
| `maxWords`   | number | Maximum words per sentence                                   |
| `hints`      | string | Comma-separated tags (e.g. `domain:tech,register:formal`)   |
| `transforms` | string | Comma-separated transform IDs (e.g. `pigLatin,leet`)        |
| `archetype`  | string | Archetype name to activate from the lexicon                  |
| `lexicon`    | string | Lexicon JSON string for domain-specific vocabulary           |

**Example prompt:** _"Generate 3 sentences in Pig Latin with seed 42"_

The LLM calls `generate_sentence` with `count: 3`, `seed: 42`, `transforms: "pigLatin"`.

---

### `generate_paragraph`

Generate one or more paragraphs.

| Parameter      | Type   | Description                                  |
| -------------- | ------ | -------------------------------------------- |
| `seed`         | number | RNG seed for deterministic output            |
| `count`        | number | Number of paragraphs (1--20, default: 1)     |
| `sentences`    | number | Fixed number of sentences per paragraph      |
| `minSentences` | number | Minimum sentences per paragraph              |
| `maxSentences` | number | Maximum sentences per paragraph              |
| `hints`        | string | Comma-separated tags                         |
| `transforms`   | string | Comma-separated transform IDs               |
| `archetype`    | string | Archetype name to activate from the lexicon  |
| `lexicon`      | string | Lexicon JSON string for custom vocabulary    |

---

### `generate_text`

Generate a text block (multiple paragraphs).

| Parameter       | Type   | Description                                  |
| --------------- | ------ | -------------------------------------------- |
| `seed`          | number | RNG seed for deterministic output            |
| `paragraphs`    | number | Fixed number of paragraphs                   |
| `minParagraphs` | number | Minimum paragraphs                           |
| `maxParagraphs` | number | Maximum paragraphs                           |
| `hints`         | string | Comma-separated tags                         |
| `transforms`    | string | Comma-separated transform IDs               |
| `archetype`     | string | Archetype name to activate from the lexicon  |
| `lexicon`       | string | Lexicon JSON string for custom vocabulary    |

---

### `morphology`

Apply English morphology operations to a word -- pluralize, conjugate verbs, get the indefinite article, and more.

| Parameter   | Type   |          | Description                |
| ----------- | ------ | -------- | -------------------------- |
| `word`      | string | **required** | The word to transform  |
| `operation` | string | **required** | The operation to apply |

**Operations:**

| Operation            | Example input | Example output |
| -------------------- | ------------- | -------------- |
| `pluralize`          | synergy       | synergies      |
| `singularize`        | stakeholders  | stakeholder    |
| `pastTense`          | go            | went           |
| `pastParticiple`     | run           | run            |
| `presentParticiple`  | leverage      | leveraging     |
| `thirdPerson`        | do            | does           |
| `indefiniteArticle`  | hour          | an             |

---

### `list_transforms`

List all available output transforms. No parameters.

Returns the 10 built-in transforms: `pigLatin`, `ubbiDubbi`, `leet`, `uwu`, `pirate`, `redact`, `emoji`, `mockCase`, `reverseWords`, `bizJargon`.

See [Output Transforms](transforms/) for detailed descriptions of each.

---

### `list_sentence_types`

List all available sentence structure types with descriptions. No parameters.

Returns the six types: `simpleDeclarative`, `compound`, `introAdverbial`, `subordinate`, `interjection`, `question`.

See [Guides > Sentence Types](guides/sentence-types) for examples of each.

---

### `validate_lexicon`

Validate a lexicon JSON string and report any errors or warnings.

| Parameter | Type   |          | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| `json`    | string | **required** | The lexicon JSON string to validate |

Returns validation status, a list of errors (if any), and warnings.

See [Lexicons](lexicons/) for the full schema reference and how to build custom lexicons.

## Using custom lexicons

Any of the generation tools accept a `lexicon` parameter with an inline JSON string. This lets an LLM generate domain-specific text on the fly.

**Example prompt:** _"Generate a startup-themed paragraph using this lexicon"_

The LLM passes the lexicon JSON as the `lexicon` parameter and sets `archetype: "startup"`:

```json
{
  "id": "lexicon.startup",
  "language": "en",
  "termSets": {
    "noun.startup": {
      "pos": "noun",
      "tags": ["domain:startup"],
      "terms": [
        { "value": "disruptor" },
        { "value": "unicorn" },
        { "value": "pivot" },
        { "value": "runway" }
      ]
    },
    "verb.startup": {
      "pos": "verb",
      "tags": ["domain:startup"],
      "terms": [
        { "value": "disrupt" },
        { "value": "scale" },
        { "value": "pivot" },
        { "value": "iterate" }
      ]
    }
  },
  "archetypes": {
    "startup": {
      "tags": ["domain:startup"]
    }
  }
}
```

## Deterministic output

Pass the same `seed` value to any generation tool to get reproducible results. This is useful when an LLM needs consistent placeholder text across multiple calls.

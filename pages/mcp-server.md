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

The server exposes eight tools. All parameters are optional unless marked **required**.

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
| `archetype`   | string | Archetype name to activate from the lexicon                 |
| `lexicon`     | string | Lexicon JSON string for domain-specific vocabulary          |
| `lexiconPath` | string | Absolute path to a lexicon JSON file on disk                |
| `config`      | string | Generator config JSON (see [`list_config`](#list_config))   |

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
| `lexiconPath`  | string | Absolute path to a lexicon JSON file on disk |
| `config`       | string | Generator config JSON (see [`list_config`](#list_config)) |

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
| `lexiconPath`   | string | Absolute path to a lexicon JSON file on disk |
| `config`        | string | Generator config JSON (see [`list_config`](#list_config)) |

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

### `list_config`

List all generator configuration options with their types and default values. No parameters.

Use this to discover what can be passed in the `config` parameter of the generation tools. See [Configuration](configuration) for full details on each option.

---

### `validate_lexicon`

Validate a lexicon JSON string or file and report any errors or warnings. Provide either `json` or `lexiconPath`.

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| `json`        | string | The lexicon JSON string to validate          |
| `lexiconPath` | string | Absolute path to a lexicon JSON file on disk |

Returns validation status, a list of errors (if any), and warnings.

See [Lexicons](lexicons/) for the full schema reference and how to build custom lexicons.

## Using custom lexicons

There are two ways to load a lexicon into any generation tool:

1. **By file path** -- pass `lexiconPath` with an absolute path to a `.json` file on disk. This is the easiest option when you already have a lexicon file.
2. **Inline JSON** -- pass `lexicon` with the full JSON string. Useful for one-off or dynamically constructed lexicons.

If both are provided, `lexiconPath` takes precedence.

**Example prompt:** _"Generate a startup-themed paragraph using the lexicon at /home/me/lexicons/startup.json"_

The LLM calls `generate_paragraph` with `lexiconPath: "/home/me/lexicons/startup.json"` and `archetype: "startup"`.

### Inline lexicon example

For quick, ad-hoc lexicons, an LLM can pass the JSON directly:

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

## Generator configuration

All generation tools accept a `config` parameter -- a JSON string with any [GeneratorConfig](configuration) overrides. This lets you tune sentence structure rates, word counts, complexity limits, and more.

**Example prompt:** _"Generate a paragraph with lots of questions and long sentences"_

The LLM calls `generate_paragraph` with:

```json
{
  "config": "{\"questionRate\":0.8,\"minWordsPerSentence\":15,\"maxWordsPerSentence\":30}"
}
```

Common config options:

| Option                     | Type         | Default | Description                          |
| -------------------------- | ------------ | ------- | ------------------------------------ |
| `minWordsPerSentence`      | number       | 5       | Minimum words per sentence           |
| `maxWordsPerSentence`      | number       | 25      | Maximum words per sentence           |
| `questionRate`             | number (0-1) | 0.10    | Rate of question sentences           |
| `compoundRate`             | number (0-1) | 0.15    | Rate of compound sentences           |
| `subordinateClauseRate`    | number (0-1) | 0.15    | Rate of subordinate clauses          |
| `maxAdjectivesPerNoun`     | number       | 2       | Maximum adjectives before a noun     |
| `maxAdverbsPerVerb`        | number       | 1       | Maximum adverbs per verb phrase      |
| `maxPPChain`               | number       | 2       | Maximum prepositional phrase chains  |
| `minSentencesPerParagraph` | number       | 2       | Minimum sentences per paragraph      |
| `maxSentencesPerParagraph` | number       | 7       | Maximum sentences per paragraph      |
| `sentenceTypeWeights`      | object       | --      | Weights for each sentence type       |

Call `list_config` to see the full list with defaults.

## Deterministic output

Pass the same `seed` value to any generation tool to get reproducible results. This is useful when an LLM needs consistent placeholder text across multiple calls.

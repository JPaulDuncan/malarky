# malarky-mcp

MCP server for [Malarky](https://github.com/JPaulDuncan/malarky) -- generate syntactically plausible English nonsense from any LLM.

Works with Claude Desktop, Claude Code, Cursor, and any other [MCP](https://modelcontextprotocol.io)-compatible client.

## Quick Start

```bash
npx malarky-mcp
```

### Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

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

## Tools

### `generate_sentence`

Generate one or more sentences of syntactically plausible English nonsense.

| Parameter   | Type   | Description                                      |
| ----------- | ------ | ------------------------------------------------ |
| `seed`      | number | RNG seed for deterministic output                |
| `type`      | string | Sentence structure (see `list_sentence_types`)   |
| `count`     | number | Number of sentences (1-50, default: 1)           |
| `minWords`  | number | Minimum words per sentence                       |
| `maxWords`  | number | Maximum words per sentence                       |
| `hints`     | string | Comma-separated tags (e.g. `domain:tech`)        |
| `transforms`| string | Comma-separated transform IDs (e.g. `pigLatin`)  |
| `archetype` | string | Archetype name from the lexicon                  |
| `lexicon`   | string | Lexicon JSON string for custom vocabulary        |

### `generate_paragraph`

Generate one or more paragraphs.

| Parameter      | Type   | Description                               |
| -------------- | ------ | ----------------------------------------- |
| `seed`         | number | RNG seed for deterministic output         |
| `count`        | number | Number of paragraphs (1-20, default: 1)   |
| `sentences`    | number | Fixed sentences per paragraph             |
| `minSentences` | number | Minimum sentences per paragraph           |
| `maxSentences` | number | Maximum sentences per paragraph           |
| `hints`        | string | Comma-separated tags                      |
| `transforms`   | string | Comma-separated transform IDs             |
| `archetype`    | string | Archetype name from the lexicon           |
| `lexicon`      | string | Lexicon JSON string for custom vocabulary |

### `generate_text`

Generate a text block (multiple paragraphs).

| Parameter       | Type   | Description                               |
| --------------- | ------ | ----------------------------------------- |
| `seed`          | number | RNG seed for deterministic output         |
| `paragraphs`    | number | Fixed number of paragraphs                |
| `minParagraphs` | number | Minimum paragraphs                        |
| `maxParagraphs` | number | Maximum paragraphs                        |
| `hints`         | string | Comma-separated tags                      |
| `transforms`    | string | Comma-separated transform IDs             |
| `archetype`     | string | Archetype name from the lexicon           |
| `lexicon`       | string | Lexicon JSON string for custom vocabulary |

### `morphology`

Apply English morphology operations to a word.

| Parameter   | Type   | Required | Description                                                                                           |
| ----------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `word`      | string | yes      | The word to transform                                                                                 |
| `operation` | string | yes      | One of: `pluralize`, `singularize`, `pastTense`, `pastParticiple`, `presentParticiple`, `thirdPerson`, `indefiniteArticle` |

Examples:

| Input                                    | Output       |
| ---------------------------------------- | ------------ |
| `word: "synergy", operation: "pluralize"` | `synergies`  |
| `word: "go", operation: "pastTense"`      | `went`       |
| `word: "run", operation: "presentParticiple"` | `running` |
| `word: "hour", operation: "indefiniteArticle"` | `an`     |

### `list_transforms`

List all available output transforms. No parameters.

Available transforms: `pigLatin`, `ubbiDubbi`, `leet`, `uwu`, `pirate`, `redact`, `emoji`, `mockCase`, `reverseWords`, `bizJargon`.

### `list_sentence_types`

List all available sentence structure types. No parameters.

Available types: `simpleDeclarative`, `compound`, `introAdverbial`, `subordinate`, `interjection`, `question`.

### `validate_lexicon`

Validate a lexicon JSON string and report errors or warnings.

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| `json`    | string | yes      | The lexicon JSON string to validate |

## Development

```bash
git clone https://github.com/JPaulDuncan/malarky.git
cd malarky/mcp-server
npm install
npm run build
```

## License

MIT

---
title: Getting Started
layout: default
nav_order: 2
---

# Getting Started

## Installation

Install from npm:

```bash
npm install malarky
```

Or from source:

```bash
git clone <repo>
cd malarky
npm install
npm run build
```

## Your first generator

The simplest setup requires only a faker adapter. The built-in `SimpleFakerAdapter` provides a fixed set of English words with no external dependencies.

```typescript
import { TextGenerator, SimpleFakerAdapter } from 'malarky';

const generator = new TextGenerator({
  fakerAdapter: new SimpleFakerAdapter(),
});

generator.setSeed(42);
```

### Generate a sentence

```typescript
console.log(generator.sentence());
// "Generally, the change called."
```

You can request a specific sentence type:

```typescript
generator.sentence({ type: 'question' });
// "Does the team deliver results?"

generator.sentence({ type: 'compound' });
// "The strategy evolved, and the metrics improved."
```

### Generate a paragraph

```typescript
console.log(generator.paragraph({ sentences: 3 }));
// Three sentences of plausible nonsense
```

### Generate a text block

```typescript
console.log(generator.textBlock({ paragraphs: 2 }));
// Two paragraphs of malarky
```

## CLI quick start

After installing globally (`npm install -g malarky`) or locally, the `malarky` command is available. With a local install, use `npx malarky` or `npm run cli --`.

```bash
# Generate a sentence
malarky sentence

# Generate a deterministic question
malarky sentence --seed 42 --type question

# Generate a paragraph with a corporate lexicon
malarky paragraph --sentences 5 --lexicon ./corp.json --archetype corporate

# Apply Pig Latin transform and output as JSON
malarky sentence --seed 42 --transform pigLatin --json
```

## What next?

- **[CLI Reference](cli/)** -- All commands, options, and examples
- **[Lexicons](lexicons/)** -- Steer generation with custom vocabularies
- **[Output Transforms](transforms/)** -- Modify output with Pig Latin, leet speak, pirate, and more
- **[API Reference](api/)** -- Full TypeScript API documentation
- **[Configuration](configuration)** -- Tune sentence lengths, type weights, and complexity

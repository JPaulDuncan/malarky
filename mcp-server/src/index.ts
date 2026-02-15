#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "node:fs";
import { z } from "zod";
import {
  TextGenerator,
  SimpleFakerAdapter,
  loadLexiconFromString,
  validateLexicon,
  createDefaultRegistry,
  DEFAULT_CONFIG,
  pluralize,
  singularize,
  getPastTense,
  getPastParticiple,
  getPresentParticiple,
  getThirdPersonSingular,
  getIndefiniteArticle,
} from "malarky";
import type {
  SentenceOptions,
  ParagraphOptions,
  TextBlockOptions,
  OutputTransformsConfig,
  GeneratorConfig,
  SentenceType,
} from "malarky";

const SENTENCE_TYPES: SentenceType[] = [
  "simpleDeclarative",
  "compound",
  "introAdverbial",
  "subordinate",
  "interjection",
  "question",
];

const server = new McpServer({
  name: "malarky",
  version: "1.0.0",
});

function loadLexicon(lexicon?: string, lexiconPath?: string) {
  if (lexiconPath) {
    const content = readFileSync(lexiconPath, "utf-8");
    return loadLexiconFromString(content);
  }
  if (lexicon) {
    return loadLexiconFromString(lexicon);
  }
  return undefined;
}

function parseConfig(configJson?: string): Partial<GeneratorConfig> | undefined {
  if (!configJson) return undefined;
  return JSON.parse(configJson) as Partial<GeneratorConfig>;
}

function buildGenerator(opts: {
  seed?: number;
  lexicon?: string;
  lexiconPath?: string;
  archetype?: string;
  config?: string;
}) {
  const initOptions: {
    fakerAdapter: SimpleFakerAdapter;
    lexicon?: ReturnType<typeof loadLexiconFromString>;
    config?: Partial<GeneratorConfig>;
  } = {
    fakerAdapter: new SimpleFakerAdapter(),
  };

  const lexicon = loadLexicon(opts.lexicon, opts.lexiconPath);
  if (lexicon) {
    initOptions.lexicon = lexicon;
  }

  const config = parseConfig(opts.config);
  if (config) {
    initOptions.config = config;
  }

  const generator = new TextGenerator(initOptions);

  if (opts.seed !== undefined) {
    generator.setSeed(opts.seed);
  }

  if (opts.archetype) {
    generator.setArchetype(opts.archetype);
  }

  return generator;
}

function buildTransformConfig(transforms: string): Partial<OutputTransformsConfig> {
  const ids = transforms.split(",").map((s) => s.trim()).filter(Boolean);
  return {
    enabled: true,
    pipeline: ids.map((id) => ({ id })),
  };
}

// --- Tool: generate_sentence ---

server.tool(
  "generate_sentence",
  "Generate one or more sentences of syntactically plausible English nonsense",
  {
    seed: z.number().optional().describe("RNG seed for deterministic output"),
    type: z.enum(["simpleDeclarative", "compound", "introAdverbial", "subordinate", "interjection", "question"]).optional().describe("Sentence structure type"),
    count: z.number().min(1).max(50).optional().describe("Number of sentences to generate (default: 1)"),
    minWords: z.number().min(1).optional().describe("Minimum words per sentence"),
    maxWords: z.number().min(1).optional().describe("Maximum words per sentence"),
    hints: z.string().optional().describe("Comma-separated tags to activate (e.g. 'domain:tech,register:formal')"),
    transforms: z.string().optional().describe("Comma-separated transform IDs to apply (e.g. 'pigLatin,leet')"),
    archetype: z.string().optional().describe("Archetype name to activate from the lexicon"),
    lexicon: z.string().optional().describe("Lexicon JSON string for domain-specific vocabulary"),
    lexiconPath: z.string().optional().describe("Absolute path to a lexicon JSON file on disk"),
    config: z.string().optional().describe("Generator config JSON (e.g. '{\"questionRate\":0.5,\"maxAdjectivesPerNoun\":3}'). Use list_config to see all options."),
  },
  async ({ seed, type, count = 1, minWords, maxWords, hints, transforms, archetype, lexicon, lexiconPath, config }) => {
    const generator = buildGenerator({ seed, lexicon, lexiconPath, archetype, config });
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const opts: SentenceOptions = {};
      if (type) opts.type = type;
      if (minWords) opts.minWords = minWords;
      if (maxWords) opts.maxWords = maxWords;
      if (hints) opts.hints = hints.split(",").map((s) => s.trim());
      if (transforms) opts.outputTransforms = buildTransformConfig(transforms);

      const result = generator.sentence(opts);
      results.push(typeof result === "string" ? result : result.text);
    }

    return { content: [{ type: "text", text: results.join("\n") }] };
  },
);

// --- Tool: generate_paragraph ---

server.tool(
  "generate_paragraph",
  "Generate one or more paragraphs of syntactically plausible English nonsense",
  {
    seed: z.number().optional().describe("RNG seed for deterministic output"),
    count: z.number().min(1).max(20).optional().describe("Number of paragraphs to generate (default: 1)"),
    sentences: z.number().min(1).optional().describe("Fixed number of sentences per paragraph"),
    minSentences: z.number().min(1).optional().describe("Minimum sentences per paragraph"),
    maxSentences: z.number().min(1).optional().describe("Maximum sentences per paragraph"),
    hints: z.string().optional().describe("Comma-separated tags to activate"),
    transforms: z.string().optional().describe("Comma-separated transform IDs to apply"),
    archetype: z.string().optional().describe("Archetype name to activate from the lexicon"),
    lexicon: z.string().optional().describe("Lexicon JSON string for domain-specific vocabulary"),
    lexiconPath: z.string().optional().describe("Absolute path to a lexicon JSON file on disk"),
    config: z.string().optional().describe("Generator config JSON (e.g. '{\"compoundRate\":0.4}'). Use list_config to see all options."),
  },
  async ({ seed, count = 1, sentences, minSentences, maxSentences, hints, transforms, archetype, lexicon, lexiconPath, config }) => {
    const generator = buildGenerator({ seed, lexicon, lexiconPath, archetype, config });
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const opts: ParagraphOptions = {};
      if (sentences) opts.sentences = sentences;
      if (minSentences) opts.minSentences = minSentences;
      if (maxSentences) opts.maxSentences = maxSentences;
      if (hints) opts.hints = hints.split(",").map((s) => s.trim());
      if (transforms) opts.outputTransforms = buildTransformConfig(transforms);

      const result = generator.paragraph(opts);
      results.push(typeof result === "string" ? result : result.text);
    }

    return { content: [{ type: "text", text: results.join("\n\n") }] };
  },
);

// --- Tool: generate_text ---

server.tool(
  "generate_text",
  "Generate a text block (multiple paragraphs) of syntactically plausible English nonsense",
  {
    seed: z.number().optional().describe("RNG seed for deterministic output"),
    paragraphs: z.number().min(1).optional().describe("Fixed number of paragraphs"),
    minParagraphs: z.number().min(1).optional().describe("Minimum number of paragraphs"),
    maxParagraphs: z.number().min(1).optional().describe("Maximum number of paragraphs"),
    hints: z.string().optional().describe("Comma-separated tags to activate"),
    transforms: z.string().optional().describe("Comma-separated transform IDs to apply"),
    archetype: z.string().optional().describe("Archetype name to activate from the lexicon"),
    lexicon: z.string().optional().describe("Lexicon JSON string for domain-specific vocabulary"),
    lexiconPath: z.string().optional().describe("Absolute path to a lexicon JSON file on disk"),
    config: z.string().optional().describe("Generator config JSON (e.g. '{\"minWordsPerSentence\":10}'). Use list_config to see all options."),
  },
  async ({ seed, paragraphs, minParagraphs, maxParagraphs, hints, transforms, archetype, lexicon, lexiconPath, config }) => {
    const generator = buildGenerator({ seed, lexicon, lexiconPath, archetype, config });

    const opts: TextBlockOptions = {};
    if (paragraphs) opts.paragraphs = paragraphs;
    if (minParagraphs) opts.minParagraphs = minParagraphs;
    if (maxParagraphs) opts.maxParagraphs = maxParagraphs;
    if (hints) opts.hints = hints.split(",").map((s) => s.trim());
    if (transforms) opts.outputTransforms = buildTransformConfig(transforms);

    const result = generator.textBlock(opts);
    const text = typeof result === "string" ? result : result.text;

    return { content: [{ type: "text", text }] };
  },
);

// --- Tool: morphology ---

server.tool(
  "morphology",
  "Apply English morphology operations to a word (pluralize, conjugate, get article, etc.)",
  {
    word: z.string().describe("The word to transform"),
    operation: z.enum([
      "pluralize",
      "singularize",
      "pastTense",
      "pastParticiple",
      "presentParticiple",
      "thirdPerson",
      "indefiniteArticle",
    ]).describe("The morphology operation to apply"),
  },
  async ({ word, operation }) => {
    const ops: Record<string, (w: string) => string> = {
      pluralize,
      singularize,
      pastTense: getPastTense,
      pastParticiple: getPastParticiple,
      presentParticiple: getPresentParticiple,
      thirdPerson: getThirdPersonSingular,
      indefiniteArticle: getIndefiniteArticle,
    };

    const result = ops[operation]!(word);
    return { content: [{ type: "text", text: result }] };
  },
);

// --- Tool: list_transforms ---

server.tool(
  "list_transforms",
  "List all available output transforms that can modify generated text",
  {},
  async () => {
    const registry = createDefaultRegistry();
    const transforms = registry.list();

    const lines = transforms.map((t) => {
      const caps = t.capabilities;
      return `- **${t.id}** (v${t.version}) — deterministic: ${caps.deterministic}, safe to stack: ${caps.safeToStack}`;
    });

    return { content: [{ type: "text", text: `Available transforms:\n\n${lines.join("\n")}` }] };
  },
);

// --- Tool: list_sentence_types ---

server.tool(
  "list_sentence_types",
  "List all available sentence structure types",
  {},
  async () => {
    const descriptions: Record<SentenceType, string> = {
      simpleDeclarative: "Simple declarative sentence (e.g. 'The system processes data.')",
      compound: "Two clauses joined by a coordinator (e.g. 'The strategy evolved, and the metrics improved.')",
      introAdverbial: "Opens with an adverb (e.g. 'Furthermore, the initiative drives innovation.')",
      subordinate: "Includes a subordinate clause (e.g. 'Because the pipeline scales, the throughput increases.')",
      interjection: "Opens with an interjection (e.g. 'Indeed, the team delivered results.')",
      question: "Question form (e.g. 'Does the team deliver results?')",
    };

    const lines = SENTENCE_TYPES.map((t) => `- **${t}**: ${descriptions[t]}`);
    return { content: [{ type: "text", text: `Available sentence types:\n\n${lines.join("\n")}` }] };
  },
);

// --- Tool: list_config ---

server.tool(
  "list_config",
  "List all generator configuration options with their types and defaults. Pass any of these as JSON in the config parameter of generation tools.",
  {},
  async () => {
    const configDescriptions: Record<string, { type: string; default: string; description: string }> = {
      "sentenceTypeWeights": { type: "object", default: JSON.stringify(DEFAULT_CONFIG.sentenceTypeWeights), description: "Weights for sentence type selection (keys: simpleDeclarative, compound, introAdverbial, subordinate, interjection, question)" },
      "minWordsPerSentence": { type: "number", default: String(DEFAULT_CONFIG.minWordsPerSentence), description: "Minimum words per sentence" },
      "maxWordsPerSentence": { type: "number", default: String(DEFAULT_CONFIG.maxWordsPerSentence), description: "Maximum words per sentence" },
      "avgSentenceLength": { type: "number", default: String(DEFAULT_CONFIG.avgSentenceLength), description: "Target average sentence length" },
      "minSentencesPerParagraph": { type: "number", default: String(DEFAULT_CONFIG.minSentencesPerParagraph), description: "Minimum sentences per paragraph" },
      "maxSentencesPerParagraph": { type: "number", default: String(DEFAULT_CONFIG.maxSentencesPerParagraph), description: "Maximum sentences per paragraph" },
      "interjectionRate": { type: "number (0-1)", default: String(DEFAULT_CONFIG.interjectionRate), description: "Rate of interjection sentences" },
      "subordinateClauseRate": { type: "number (0-1)", default: String(DEFAULT_CONFIG.subordinateClauseRate), description: "Rate of subordinate clauses" },
      "relativeClauseRate": { type: "number (0-1)", default: String(DEFAULT_CONFIG.relativeClauseRate), description: "Rate of relative clauses" },
      "questionRate": { type: "number (0-1)", default: String(DEFAULT_CONFIG.questionRate), description: "Rate of question sentences" },
      "compoundRate": { type: "number (0-1)", default: String(DEFAULT_CONFIG.compoundRate), description: "Rate of compound sentences" },
      "maxPPChain": { type: "number", default: String(DEFAULT_CONFIG.maxPPChain), description: "Maximum prepositional phrase chains" },
      "maxAdjectivesPerNoun": { type: "number", default: String(DEFAULT_CONFIG.maxAdjectivesPerNoun), description: "Maximum adjectives before a noun" },
      "maxAdverbsPerVerb": { type: "number", default: String(DEFAULT_CONFIG.maxAdverbsPerVerb), description: "Maximum adverbs per verb phrase" },
    };

    const lines = Object.entries(configDescriptions).map(
      ([key, { type, default: def, description }]) => `- **${key}** (${type}, default: ${def}) -- ${description}`,
    );

    return {
      content: [{
        type: "text",
        text: `Generator configuration options:\n\nPass as JSON string in the \`config\` parameter, e.g. \`{"questionRate": 0.5, "maxAdjectivesPerNoun": 3}\`\n\n${lines.join("\n")}`,
      }],
    };
  },
);

// --- Tool: validate_lexicon ---

server.tool(
  "validate_lexicon",
  "Validate a lexicon JSON string or file and report any errors or warnings",
  {
    json: z.string().optional().describe("The lexicon JSON string to validate"),
    lexiconPath: z.string().optional().describe("Absolute path to a lexicon JSON file to validate"),
  },
  async ({ json, lexiconPath }) => {
    let raw: string | undefined = json;
    if (lexiconPath) {
      try {
        raw = readFileSync(lexiconPath, "utf-8");
      } catch (e) {
        return { content: [{ type: "text", text: `Cannot read file: ${(e as Error).message}` }], isError: true };
      }
    }
    if (!raw) {
      return { content: [{ type: "text", text: "Provide either json or lexiconPath" }], isError: true };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return { content: [{ type: "text", text: `Invalid JSON: ${(e as Error).message}` }], isError: true };
    }

    const result = validateLexicon(parsed);

    const parts: string[] = [];
    parts.push(`Valid: ${result.valid}`);

    if (result.errors.length > 0) {
      parts.push(`\nErrors (${result.errors.length}):`);
      for (const err of result.errors) {
        parts.push(`  - [${err.path}] ${err.message}`);
      }
    }

    if (result.warnings.length > 0) {
      parts.push(`\nWarnings (${result.warnings.length}):`);
      for (const warn of result.warnings) {
        parts.push(`  - [${warn.path}] ${warn.message}`);
      }
    }

    if (result.valid && result.warnings.length === 0) {
      parts.push("\nLexicon is valid with no warnings.");
    }

    return { content: [{ type: "text", text: parts.join("\n") }] };
  },
);

// --- Start server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

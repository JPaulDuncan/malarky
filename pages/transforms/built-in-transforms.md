---
title: Built-in Transforms
layout: default
parent: Output Transforms
nav_order: 1
---

# Built-in Transforms

Malarky ships with 10 output transforms. All are deterministic and safe to chain.

---

## pigLatin

Classic Pig Latin. Consonant clusters at the start of a word move to the end, followed by "ay". Words starting with vowels get "yay" appended.

```bash
malarky sentence --seed 42 --transform pigLatin
# "Enerallygay, ethay angechay alledcay."
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'pigLatin' }] },
});
```

---

## ubbiDubbi

Ubbi Dubbi language game. Inserts "ub" before each vowel sound in a word.

```bash
malarky sentence --seed 42 --transform ubbiDubbi
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'ubbiDubbi' }] },
});
```

---

## leet

Leetspeak character substitution. Replaces letters with numbers and symbols (a->4, e->3, i->1, o->0, s->5, t->7, etc.).

```bash
malarky sentence --seed 42 --transform leet
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'leet' }] },
});
```

---

## uwu

Cute speak. Replaces r and l with w, inserts "nya" randomly, and adds cute suffixes.

```bash
malarky sentence --seed 42 --transform uwu
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'uwu' }] },
});
```

---

## pirate

Pirate speak. Substitutes common words and phrases with pirate equivalents (you -> ye, the -> th', hello -> ahoy, etc.).

```bash
malarky sentence --seed 42 --transform pirate
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'pirate' }] },
});
```

---

## redact

Redaction. Masks words with bracketed blocks, producing text that looks like a redacted document.

```bash
malarky sentence --seed 42 --transform redact
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'redact' }] },
});
```

---

## emoji

Emoji replacement. Replaces certain words with emoji equivalents where possible.

```bash
malarky sentence --seed 42 --transform emoji
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'emoji' }] },
});
```

---

## mockCase

Mock case. Alternates between upper and lower case characters: rAnDoM CaSe aLtErNaTiOn.

```bash
malarky sentence --seed 42 --transform mockCase
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'mockCase' }] },
});
```

---

## reverseWords

Reverse word order within sentences. Punctuation stays in place.

```bash
malarky sentence --seed 42 --transform reverseWords
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'reverseWords' }] },
});
```

---

## bizJargon

Business jargon. Applies business-speak patterns and substitutions to make text sound even more corporate.

```bash
malarky sentence --seed 42 --transform bizJargon
```

```typescript
generator.sentence({
  outputTransforms: { enabled: true, pipeline: [{ id: 'bizJargon' }] },
});
```

---

## Chaining transforms

Combine multiple transforms for creative effects:

```bash
# Pirate leet speak
malarky sentence --seed 42 --transform pirate,leet

# Business jargon in Pig Latin
malarky sentence --seed 42 --transform bizJargon,pigLatin

# Mock case pirate
malarky sentence --seed 42 -x pirate -x mockCase
```

See [Chaining & Configuration](chaining-and-config) for pipeline ordering, auto-ordering, and protection rules.

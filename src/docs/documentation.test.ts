import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

describe('documentation coverage for reviewed gaps', () => {
  it('documents CLI hints and transform registry access in the README', () => {
    const readme = readRepoFile('README.md');

    expect(readme).toContain('| `--hints <tags>`');
    expect(readme).toContain('generator.getTransformRegistry()');
  });

  it('documents runtime transform registration in the TextGenerator API page', () => {
    const textGeneratorDocs = readRepoFile('pages/api/text-generator.md');

    expect(textGeneratorDocs).toContain(
      'generator.getTransformRegistry().register(shoutTransform);'
    );
    expect(textGeneratorDocs).toContain(
      'Output Transforms > Custom Transforms'
    );
  });

  it('explains mergeMode semantics in the options reference', () => {
    const optionsDocs = readRepoFile('pages/api/options-types.md');

    expect(optionsDocs).toContain("| `'replace'` | Use only the per-call pipeline");
    expect(optionsDocs).toContain(
      "| `'append'`  | Add the per-call steps after the existing configured pipeline |"
    );
  });
});

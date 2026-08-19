import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));

async function runtimeSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') || ['node_modules', 'dist', 'test'].includes(entry.name)) {
      continue;
    }

    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...await runtimeSourceFiles(path));
    } else if (/\.(?:c?js|mjs|jsx|ts|tsx|html)$/.test(entry.name)) {
      files.push(path);
    }
  }

  return files;
}

test('the retired funnel contains no browser or server Meta tracking', async () => {
  const sourceFiles = [
    `${root}/client/index.html`,
    ...await runtimeSourceFiles(`${root}/client/src`),
    ...await runtimeSourceFiles(`${root}/api`),
  ];
  const source = (await Promise.all(sourceFiles.map((path) => readFile(path, 'utf8')))).join('\n');

  assert.doesNotMatch(
    source,
    /fbq|fbevents|facebook\.com\/tr|graph\.facebook\.com|META_(?:PIXEL|CAPI|TEST_EVENT)|sendLeadEvent|_fb[pc]/
  );

  await assert.rejects(access(`${root}/api/meta-capi.js`));
});

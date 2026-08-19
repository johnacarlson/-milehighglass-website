import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const configPath = fileURLToPath(new URL('../../vercel.json', import.meta.url));

test('the retired .co funnel permanently redirects every path to the Wix site', async () => {
  const config = JSON.parse(await readFile(configPath, 'utf8'));

  assert.deepEqual(Object.keys(config).sort(), [
    '$schema',
    'buildCommand',
    'functions',
    'outputDirectory',
    'redirects',
    'rewrites',
    'version',
  ]);
  assert.deepEqual(config.redirects, [
    {
      source: '/(.*)',
      destination: 'https://www.milehighglassdenver.com',
      statusCode: 301,
    },
  ]);
});

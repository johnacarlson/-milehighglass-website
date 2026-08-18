import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

import {
  buildLeadEventPayload,
  normalizePhone,
  sendLeadEvent,
  sha256,
} from '../meta-capi.js';

const originalFetch = globalThis.fetch;
const originalPixelId = process.env.META_PIXEL_ID;
const originalToken = process.env.META_CAPI_TOKEN;
const originalTestCode = process.env.META_TEST_EVENT_CODE;

beforeEach(() => {
  process.env.META_PIXEL_ID = '1924480254839146';
  process.env.META_CAPI_TOKEN = 'test-token-never-sent';
  delete process.env.META_TEST_EVENT_CODE;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  restoreEnv('META_PIXEL_ID', originalPixelId);
  restoreEnv('META_CAPI_TOKEN', originalToken);
  restoreEnv('META_TEST_EVENT_CODE', originalTestCode);
});

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function response(body, ok = true) {
  return {
    ok,
    async json() {
      return body;
    },
  };
}

test('builds a normalized Lead event with a shared event id', () => {
  const payload = buildLeadEventPayload({
    eventId: 'event-123',
    phone: '(303) 555-0199',
    firstName: '  Jane ',
    email: ' JANE@EXAMPLE.COM ',
    fbp: 'fb.1.browser',
    fbc: 'fb.1.click',
    ipAddress: '203.0.113.7',
    userAgent: 'Test Browser',
    sourceUrl: 'https://milehighglassdenver.co/',
  });

  const event = payload.data[0];
  assert.equal(event.event_name, 'Lead');
  assert.equal(event.event_id, 'event-123');
  assert.equal(event.action_source, 'website');
  assert.equal(event.user_data.ph[0], sha256('13035550199'));
  assert.equal(event.user_data.fn[0], sha256('jane'));
  assert.equal(event.user_data.em[0], sha256('jane@example.com'));
  assert.equal(event.user_data.client_ip_address, '203.0.113.7');
  assert.equal(event.user_data.client_user_agent, 'Test Browser');
});

test('omits unavailable customer fields instead of sending null values', () => {
  const payload = buildLeadEventPayload({ eventId: 'event-124' });
  assert.deepEqual(payload.data[0].user_data, {});
});

test('normalizes a Colorado ten-digit number with the US country code', () => {
  assert.equal(normalizePhone('303.555.0199'), '13035550199');
});

test('reports success only when Meta acknowledges one received event', async () => {
  globalThis.fetch = async () => response({ events_received: 1 });
  assert.equal(await sendLeadEvent({ eventId: 'event-125' }), true);
});

test('does not report success for an HTTP 200 that accepted zero events', async () => {
  globalThis.fetch = async () => response({ events_received: 0, messages: ['invalid event'] });
  assert.equal(await sendLeadEvent({ eventId: 'event-126' }), false);
});

test('does not call Meta when production credentials are missing', async () => {
  delete process.env.META_CAPI_TOKEN;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return response({ events_received: 1 });
  };

  assert.equal(await sendLeadEvent({ eventId: 'event-127' }), false);
  assert.equal(called, false);
});

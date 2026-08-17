// Covers the second half of the "undefined undefined" incident: the Resend adapter.
//
// resend.emails.send() does NOT throw when the API refuses a message — it resolves
// with { data: null, error: {...} }. The old code lived entirely inside a try/catch
// and returned true unconditionally, so a refused send was reported as delivered and
// the caller wrote email_sent = true for a lead nobody was ever told about.
//
// The `resend` package itself is mocked, so these tests send no mail and need no key.
//
// Run: node --test --experimental-test-module-mocks api/test/email-send.test.mjs

import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

let sendImpl = async () => ({ data: { id: 'msg_1' }, error: null });
const sendCalls = [];

mock.module('resend', {
  namedExports: {
    Resend: class {
      constructor() {
        this.emails = {
          send: async (opts) => {
            sendCalls.push(opts);
            return sendImpl(opts);
          },
        };
      }
    },
  },
});

const { initEmail, sendLeadEmail } = await import('../email.js');

initEmail('re_test_key_not_real');

const LEAD = {
  id: 64,
  first_name: 'Ron',
  last_name: 'Mungo',
  email: 'watvon7@aol.com',
  phone: '3034559552',
  zip_code: '80202',
  service: 'window-replacement',
  message: 'Foggy glass in two windows.',
};

beforeEach(() => {
  sendCalls.length = 0;
  sendImpl = async () => ({ data: { id: 'msg_1' }, error: null });
});

test('a delivered lead reports success', async () => {
  assert.equal(await sendLeadEmail(LEAD), true);
  assert.equal(sendCalls.length, 1);
});

test('a lead Resend REFUSES is reported as a failure, not a success', async () => {
  // The exact shape the SDK resolves with on rejection — no throw.
  sendImpl = async () => ({
    data: null,
    error: { statusCode: 403, name: 'validation_error', message: 'Domain is not verified' },
  });

  assert.equal(
    await sendLeadEmail(LEAD),
    false,
    'a refused send must return false so the caller never writes email_sent = true'
  );
});

test('a thrown transport error is reported as a failure', async () => {
  sendImpl = async () => {
    throw new Error('ECONNRESET');
  };

  assert.equal(await sendLeadEmail(LEAD), false);
});

test('the notification actually renders the lead, not "undefined"', async () => {
  await sendLeadEmail(LEAD);
  const { subject, html, to, replyTo } = sendCalls[0];

  assert.equal(subject, 'New Lead: Ron Mungo — Window Replacement');
  assert.doesNotMatch(subject, /undefined/);
  assert.doesNotMatch(html, /undefined/);
  for (const value of ['Ron', 'Mungo', 'watvon7@aol.com', '3034559552', '80202']) {
    assert.ok(html.includes(value), `email body is missing ${value}`);
  }
  assert.equal(replyTo, 'watvon7@aol.com', 'the client must be able to reply to the lead');
  assert.equal(to, process.env.LEAD_EMAIL || 'Admin@MileHighGlassDenver.com');
});

test('a test lead is diverted away from the client inbox and labelled', async () => {
  await sendLeadEmail(LEAD, { testMode: true });
  const { subject, to } = sendCalls[0];

  assert.match(subject, /^\[TEST — not a real lead\]/);
  assert.equal(to, process.env.TEST_LEAD_EMAIL || 'john.algot.carlson@gmail.com');
  assert.notEqual(to, 'Admin@MileHighGlassDenver.com');
});

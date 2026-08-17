// Regression test for the "New Lead: undefined undefined" incident.
//
// The lead email used to be built from whatever insertLead() returned. That query
// ended in `RETURNING id, created_at`, so on a SUCCESSFUL write the email template
// received undefined for the name, email, phone and service — and the notification
// only looked right when the database FAILED and the code fell back to the
// validated submission. Weeks of real leads reached the client blank.
//
// These tests pin the contract: the email payload comes from the submission, never
// from the insert's return shape, whether the write succeeds, returns a narrow row,
// or throws outright.
//
// Run: node --test --experimental-test-module-mocks api/test/leads-route.test.mjs

import { test, mock, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

const sentEmails = [];
const statusUpdates = [];
let insertBehaviour = () => ({ id: 99, created_at: new Date() });

mock.module('../db/schema.js', {
  namedExports: {
    insertLead: async (lead) => insertBehaviour(lead),
    updateLeadEmailStatus: async (id, sent) => {
      statusUpdates.push({ id, sent });
    },
  },
});

mock.module('../email.js', {
  namedExports: {
    sendLeadEmail: async (payload, options) => {
      sentEmails.push({ payload, options });
      return true;
    },
  },
});

mock.module('../init.js', {
  namedExports: { ensureInit: async () => {}, isDbReady: () => true },
});

const capiEvents = [];

mock.module('../meta-capi.js', {
  namedExports: {
    sendLeadEvent: async (args) => {
      capiEvents.push(args);
      return true;
    },
  },
});

const { default: leadsRouter } = await import('../routes/leads.js');

const app = express();
app.use(express.json());
app.use('/api/leads', leadsRouter);

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(() => server?.close());

const RON = {
  firstName: 'Ron',
  lastName: 'Mungo',
  email: 'watvon7@aol.com',
  phone: '3034559552',
  zipCode: '80202',
  service: 'window-replacement',
  message: 'Foggy glass in two windows.',
  // Shared with the browser pixel so Meta collapses the two Lead events into one.
  eventId: 'ffffffff-1111-2222-3333-444444444444',
};

async function submit(body) {
  sentEmails.length = 0;
  statusUpdates.length = 0;
  capiEvents.length = 0;
  const res = await fetch(`${baseUrl}/api/leads/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try { return { res, json: JSON.parse(text) }; } catch { console.log("RAW", res.status, text.slice(0,400)); throw new Error("non-JSON response"); }
}

function assertLeadIsLegible(payload) {
  assert.equal(payload.first_name, 'Ron');
  assert.equal(payload.last_name, 'Mungo');
  assert.equal(payload.email, 'watvon7@aol.com');
  assert.equal(payload.phone, '3034559552');
  assert.equal(payload.zip_code, '80202');
  assert.equal(payload.service, 'window-replacement');
  assert.equal(payload.message, 'Foggy glass in two windows.');
}

test('a saved lead is emailed with its details, not undefined', async () => {
  // The exact production shape: the insert succeeds but returns only these two
  // columns. This is the case that produced "New Lead: undefined undefined".
  insertBehaviour = () => ({ id: 64, created_at: new Date() });

  const { res, json } = await submit(RON);

  assert.equal(res.status, 200);
  assert.equal(json.success, true);
  assert.equal(json.leadId, 64);
  assert.equal(sentEmails.length, 1);
  assertLeadIsLegible(sentEmails[0].payload);
  assert.equal(sentEmails[0].payload.id, 64);
  assert.deepEqual(statusUpdates, [{ id: 64, sent: true }]);
});

test('a full returned row still emails the submitted values', async () => {
  insertBehaviour = (lead) => ({
    id: 65,
    created_at: new Date(),
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    zip_code: lead.zipCode,
    service: lead.service,
    message: lead.message,
  });

  const { json } = await submit(RON);

  assert.equal(json.leadId, 65);
  assertLeadIsLegible(sentEmails[0].payload);
});

test('a database outage still delivers a legible lead by email', async () => {
  insertBehaviour = () => {
    throw new Error('getaddrinfo ENOTFOUND db.supabase.co');
  };

  const { res, json } = await submit(RON);

  assert.equal(res.status, 200);
  assert.equal(json.success, true);
  assert.equal(json.leadId, null);
  assertLeadIsLegible(sentEmails[0].payload);
  assert.equal(sentEmails[0].payload.id, 'unsaved');
  assert.deepEqual(statusUpdates, [], 'nothing to update when no row exists');
});

test('a real lead fires one deduplicated Meta conversion', async () => {
  insertBehaviour = () => ({ id: 67, created_at: new Date() });

  await submit(RON);

  assert.equal(capiEvents.length, 1);
  assert.equal(
    capiEvents[0].eventId,
    RON.eventId,
    'the server event must carry the browser pixel eventId or Meta double-counts the lead'
  );
  assert.equal(capiEvents[0].email, RON.email);
  assert.equal(capiEvents[0].phone, RON.phone);
});

test('a TEST lead is diverted and never counted as a conversion', async () => {
  insertBehaviour = () => ({ id: 66, created_at: new Date() });

  await submit({ ...RON, firstName: 'TEST Ron' });

  assert.equal(sentEmails[0].options.testMode, true);
  assert.deepEqual(
    capiEvents,
    [],
    'a test submission must not fire a Lead event — it poisons the optimisation data'
  );
});

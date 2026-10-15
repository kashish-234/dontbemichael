'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) =>
  fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');

const modal = read('src/renderer/src/components/AddAgentModal.tsx');

const submitStart = modal.indexOf('const submitHire = async');
const submitEnd = modal.indexOf('\n  const stepIndex', submitStart);
const submit = modal.slice(submitStart, submitEnd);

test('the wizard validates before spawning', () => {
  assert.ok(submit.indexOf('roleReady()') >= 0);
  assert.ok(submit.indexOf('roleReady()') < submit.indexOf('spawnPty'));
});

test('the wizard validates work style before spawning', () => {
  assert.ok(submit.indexOf('!workStyle.trim()') >= 0);
  assert.ok(submit.indexOf('!workStyle.trim()') < submit.indexOf('spawnPty'));
});

test('the renderer does not add the agent before spawn succeeds', () => {
  assert.ok(submit.indexOf('spawnPty') >= 0);
  assert.ok(submit.indexOf('addAgent(agent)') > submit.indexOf('spawnPty'));
});

test('mailbox binding is applied before spawn', () => {
  const grant = submit.indexOf('mailSetCapabilities');
  const spawn = submit.indexOf('spawnPty');

  assert.ok(grant >= 0);
  assert.ok(spawn >= 0);
  assert.ok(grant < spawn);
});

test('connector binding is applied before spawn', () => {
  const grant = submit.indexOf('connectorsSetGrant');
  const spawn = submit.indexOf('spawnPty');

  assert.ok(grant >= 0);
  assert.ok(spawn >= 0);
  assert.ok(grant < spawn);
});

test('failed spawn rolls back capability bindings', () => {
  const spawnFailure = submit.indexOf('if (!spawnRes.ok)');
  const rollback = submit.indexOf('releaseBindingAccess');

  assert.ok(spawnFailure >= 0);
  assert.ok(rollback >= 0);
  assert.ok(rollback > spawnFailure);
});

test('starter jobs are seeded only after the agent is added', () => {
  const add = submit.indexOf('addAgent(agent)');
  const seed = submit.indexOf('seedStarterJobs');

  assert.ok(add >= 0);
  assert.ok(seed >= 0);
  assert.ok(seed > add);
});

test('imported hires are queued for review and do not spawn during import', () => {
  const importStart = modal.indexOf('const importHire = async');
  const importEnd = modal.indexOf('\n  const skipHire', importStart);
  const importFlow = modal.slice(importStart, importEnd);

  assert.match(importFlow, /enqueuePendingHires\(res\.manifests\)/);
  assert.doesNotMatch(importFlow, /spawnPty/);
});

test('a queued hire can be skipped without spawning', () => {
  const skipStart = modal.indexOf('const skipHire =');
  const skipEnd = modal.indexOf('\n\n  const nameTaken', skipStart);
  const skipFlow = modal.slice(skipStart, skipEnd);

  assert.match(skipFlow, /finishPendingHire\(\)/);
  assert.doesNotMatch(skipFlow, /spawnPty/);
});

test('a queued hire opens on the role review step', () => {
  assert.match(
    modal,
    /useState<Step>\(pendingHire \? 'role' : 'who'\)/
  );
});

test('a new hire opens on the capabilities tab after success', () => {
  assert.match(modal, /setSidebarTab\('capabilities'\)/);
});
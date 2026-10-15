'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) =>
  fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');

const panel = read('src/renderer/src/components/AgentDetailPanel.tsx');
const capabilities = read('src/renderer/src/components/CapabilitiesTab.tsx');
const edit = read('src/renderer/src/components/EditAgentModal.tsx');
const preload = read('src/preload/index.ts');

test('agent panels expose Profile and Capabilities tabs', () => {
  assert.match(panel, /sidebarTab === 'profile'/);
  assert.match(panel, /sidebarTab === 'capabilities'/);
  assert.match(panel, /<CapabilitiesTab agent=\{agent\} \/>/);
});

test('mailbox changes use the main process capability API', () => {
  assert.match(capabilities, /window\.cth\.mailSetCapabilities/);
  assert.match(capabilities, /window\.cth\.mailSetSendOnly/);
});

test('connector changes use the main process connector API', () => {
  assert.match(capabilities, /window\.cth\.connectorsSetGrant/);
});

test('connector changes can surface a pending restart', () => {
  assert.match(capabilities, /setPendingRestart\(agent\.id/);
  assert.match(capabilities, /reason: 'connectors'/);
});

test('mailbox changes can surface a pending restart', () => {
  assert.match(capabilities, /reason: 'email'/);
});

test('the configuration drawer exposes schedules', () => {
  assert.match(capabilities, /<AgentSchedules agentId=\{agent\.id\}/);
  assert.match(capabilities, /missionsFor\(missions, agent\.id, godId\)/);
});

test('editing an agent persists the role through the hive API', () => {
  assert.match(edit, /window\.cth\.hivePatchAgentRole/);
});

test('editing a name uses the rename API instead of changing the id', () => {
  assert.match(edit, /renameAgent\(agent\.id, trimmedName\)/);
  assert.doesNotMatch(edit, /id:\s*trimmedName/);
});

test('preload exposes the capability methods used by the drawer', () => {
  assert.match(preload, /mailSetCapabilities:/);
  assert.match(preload, /mailSetSendOnly:/);
  assert.match(preload, /connectorsSetGrant:/);
  assert.match(preload, /quickbooksSetAccess:/);
  assert.match(preload, /upsertMission:/);
});
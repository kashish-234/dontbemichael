'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const loadTs = require('./load-ts.cjs');

const H = loadTs('src/shared/hireTemplates.ts');

test('Unicode only names receive a safe agent id', () => {
  const id = H.hireAgentId('小王', 1234);

  assert.match(id, /^agent-[a-z0-9]+$/);
  assert.doesNotMatch(id, /^-/);
});

test('accented names are normalized before the id is created', () => {
  assert.equal(H.hireAgentId('Óscar', 1234), 'oscar-ya');
});

test('punctuation cannot make an id begin with a hyphen', () => {
  const id = H.hireAgentId('---', 1234);

  assert.match(id, /^agent-[a-z0-9]+$/);
  assert.doesNotMatch(id, /^-/);
});

test('folder names avoid existing folders and use stable suffixes', () => {
  const taken = new Set(['Admin', 'Admin_Erin', 'Admin_Erin_2']);

  assert.equal(
    H.hireFolderName('Admin', 'Erin', (name) => taken.has(name)),
    'Admin_Erin_3'
  );
});

test('folder names remove characters that are invalid on Windows', () => {
  const result = H.hireFolderName('Admin', 'Erin/:*?"<>|', () => false);

  assert.equal(result, 'Admin');
});

test('binding lines are added only once', () => {
  const binding = H.bindingLines('the support mailbox', 'Erin');

  const once = H.appendOnce('Pam sorts the inbox.', binding.others);
  const twice = H.appendOnce(once, binding.others);

  assert.equal(twice, once);
  assert.equal(
    twice,
    'Pam sorts the inbox. Not for the support mailbox; that goes to Erin.'
  );
});

test('releasing one hire does not remove another hire binding', () => {
  const creed = H.bindingLines('the data in HubSpot', 'Creed');
  const nick = H.bindingLines('the data in GitHub', 'Nick');

  const team = [
    {
      id: 'finance',
      description: `Finance: Books. ${creed.others} ${nick.others}`
    }
  ];

  assert.deepEqual(
    H.releaseBindings('Creed', team),
    [{
      id: 'finance',
      description: `Finance: Books. ${nick.others}`
    }]
  );
});

test('returning bindings are restored only for a returning hire', () => {
  const line = 'Not for orders over $1.5k; that goes to Creed.';

  const previous = {
    agents: [{ id: 'oscar' }],
    archived: [{ id: 'creed', releasedBindings: [{ id: 'oscar', line }] }],
    restorable: []
  };

  assert.deepEqual(
    H.returningBindings(previous, [
      { id: 'oscar' },
      { id: 'creed' }
    ]),
    [{
      id: 'creed',
      lines: [{ id: 'oscar', line }]
    }]
  );

  assert.deepEqual(
    H.returningBindings(previous, [
      { id: 'oscar' },
      { id: 'nick' }
    ]),
    []
  );
});

test('a title change does not make overlapping work distinct', () => {
  const existing = {
    name: 'Pam',
    title: 'Executive Admin',
    routing: 'Pam sorts the business inbox, supplier mail and customer orders.'
  };

  const renamed = {
    name: 'Erin',
    title: 'Head of Operations',
    routing: 'Erin sorts the business inbox, supplier mail and customer orders.'
  };

  assert.deepEqual(
    H.overlapsByRules(renamed, [existing]),
    ['Pam']
  );
});

test('invalid distinct check responses fail closed', () => {
  assert.equal(
    H.parseDistinctAnswer('not JSON', ['Pam']),
    null
  );

  assert.equal(
    H.parseDistinctAnswer(
      '{"distinct": true, "overlapsWith": ["Pam"]}',
      ['Pam']
    ).distinct,
    false
  );
});
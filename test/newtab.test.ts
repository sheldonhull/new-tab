import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
  mocksSetup, mocksTeardown, setup, sleep, teardown,
} from './utils';

test.before.each(setup);
test.before.each(mocksSetup);
test.after.each(mocksTeardown);
test.after.each(teardown);

let oldStorageLocalGet: typeof chrome.storage.local.get;

test.before(() => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  oldStorageLocalGet = global.chrome.storage.local.get;
  // @ts-expect-error - mock
  global.chrome.storage.local.get = (_keys, callback) => {
    if (callback) {
      callback({ t: '' });
    } else {
      return Promise.resolve({ t: '' });
    }
  };
});
test.after(() => {
  global.chrome.storage.local.get = oldStorageLocalGet;
});

test('renders entire newtab app', async () => {
  // eslint-disable-next-line global-require, import/extensions
  require('../dist/newtab.js');

  // Wait for async calls in the app to finish
  await sleep(10);

  // TODO: Better assertions
  assert.is(document.body.innerHTML.length > 1000, true, 'body has content');
  assert.ok(document.body.querySelector('#b')); // bookmarks bar
  assert.ok(document.body.querySelector('#s')); // search input
  assert.ok(document.body.querySelector('#m')); // menu wrapper
  assert.ok(document.body.querySelector('#d')); // menu dropdown

  // TODO: Check there is a h2 with text 'Open Tabs'

  await sleep(0);
});

test.run();

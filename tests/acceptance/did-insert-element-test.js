import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setup, visit as fastbootVisit } from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | did-insert-element', function(hooks) {
  setup(hooks);

  test('didInsertElement should not run during fastboot', async function(assert) {
    await fastbootVisit('/insert-element');

    assert.dom('[data-test-inserted-element]').doesNotContainText(/\w.+/g);
  });
});

module('Acceptance | insert element', function(hooks) {
  setupApplicationTest(hooks);

  test('didInsertElement should run outside of fastboot', async function(assert) {
    await visit('/insert-element');

    assert.dom('[data-test-inserted-element]').hasText(/\w.+/g);
  });
});

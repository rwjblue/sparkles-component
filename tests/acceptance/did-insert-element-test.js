import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setup, visit as fastbootVisit } from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | did-insert-element did-update-test', function(hooks) {
  setup(hooks);

  test('should not run during fastboot', async function(assert) {
    await fastbootVisit('/insert-element');

    assert.dom('[data-test-inserted-element]').doesNotContainText(/^$|.+/g);
    assert.dom('[data-test-updated-element]').doesNotContainText(/^$|.+/g);
  });
});

module('Acceptance | insert element', function(hooks) {
  setupApplicationTest(hooks);

  test('should run outside of fastboot', async function (assert) {
    await visit('/insert-element');

    assert.dom('[data-test-inserted-element]').hasText(/^$|.+/g);
    assert.dom('[data-test-updated-element]').hasText(/^$|.+/g);
  });
});

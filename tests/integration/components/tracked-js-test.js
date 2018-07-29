import SparklesComponent, { tracked } from 'sparkles-component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import 'qunit-dom';

module('tracked: js', function(hooks) {
  setupRenderingTest(hooks);

  test('class field with initializer', async function(assert) {
    this.owner.register('template:components/under-test', hbs`
      <div>
        <p>{{this.current}}</p>
        <button onclick={{action this.increment}}>++</button>
      </div>
    `);
    class UnderTest extends SparklesComponent {
      @tracked current = 0;

      increment() {
        this.current++;
      }
    }
    this.owner.register('component:under-test', UnderTest);

    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('0');

    await click('button');
    assert.dom('p').hasText('1');

    await click('button');
    assert.dom('p').hasText('2');

    await click('button');
    assert.dom('p').hasText('3');
  });

  test('class field without initializer', async function(assert) {
    this.owner.register('template:components/under-test', hbs`
      <div>
        <p>{{this.current}}</p>
        <button onclick={{action this.increment}}>++</button>
      </div>
    `);
    class UnderTest extends SparklesComponent {
      @tracked current;

      increment() {
        // silly, but whatever
        if (this.current === undefined) {
          this.current = 0;
        }
        this.current++;
      }
    }
    this.owner.register('component:under-test', UnderTest);

    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('');

    await click('button');
    assert.dom('p').hasText('1');

    await click('button');
    assert.dom('p').hasText('2');

    await click('button');
    assert.dom('p').hasText('3');
  });

  test('computed property without dependent keys', async function(assert) {
    this.owner.register('template:components/under-test', hbs`
      <div>
        <p>{{this.current}}</p>
        <button onclick={{action this.increment}}>++</button>
      </div>
    `);
    class UnderTest extends SparklesComponent {
      constructor() {
        super(...arguments);
        this._value = 0;
      }

      @tracked
      get current() {
        return this._value;
      }

      set current(value) {
        this._value = value;
      }

      increment() {
        this.current++;
      }
    }
    this.owner.register('component:under-test', UnderTest);

    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('0');

    await click('button');
    assert.dom('p').hasText('1');

    await click('button');
    assert.dom('p').hasText('2');

    await click('button');
    assert.dom('p').hasText('3');
  });

  test('computed property with dependent keys', async function(assert) {
    this.owner.register('template:components/under-test', hbs`
      <div>
        <p>{{this.display}}</p>
        <button onclick={{action this.increment}}>++</button>
      </div>
    `);
    class UnderTest extends SparklesComponent {
      @tracked current = 0;

      @tracked('current')
      get display() {
        return `Current: ${this.current}`;
      }

      increment() {
        this.current++;
      }
    }
    this.owner.register('component:under-test', UnderTest);

    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('Current: 0');

    await click('button');
    assert.dom('p').hasText('Current: 1');

    await click('button');
    assert.dom('p').hasText('Current: 2');

    await click('button');
    assert.dom('p').hasText('Current: 3');
  });
});

import SparklesComponent, { tracked } from 'sparkles-component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { getOwner } from '@ember/application';
import Service from '@ember/service';

module('Integration | Component | sparkles-component', function(hooks) {
  let InstrumentedComponent;

  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
    InstrumentedComponent = class extends SparklesComponent {
      constructor() {
        super(...arguments);
        assert.step('constructor');
      }

      didInsertElement() {
        assert.step('didInsertElement');
      }

      didUpdate() {
        assert.step('didUpdate');
      }

      destroy() {
        assert.step('destroy');
      }
    }
  });

  test('it can render with curlies (no args)', async function(assert) {
    this.owner.register('component:under-test', InstrumentedComponent);

    await render(hbs`{{under-test}}`);

    assert.verifySteps(['constructor', 'didInsertElement'], 'initial render steps');

    await clearRender();

    assert.verifySteps(['destroy'], 'post destroy steps');
  });

  test('it can render and update with curlies (args)', async function(assert) {
    this.owner.register('component:under-test', InstrumentedComponent);
    this.owner.register('template:components/under-test', hbs`<p>{{@text}}</p>`);

    this.set('text', 'hello!');
    await render(hbs`{{under-test text=this.text}}`);

    assert.dom('p').hasText('hello!');
    assert.verifySteps(['constructor', 'didInsertElement'], 'initial render steps');

    this.set('text', 'hello world!');

    assert.dom('p').hasText('hello world!');
    assert.verifySteps(['didUpdate'], 'rerender steps');

    this.set('text', 'hello!');

    assert.dom('p').hasText('hello!');
    assert.verifySteps(['didUpdate'], 'rerender steps');

    await clearRender();

    assert.verifySteps(['destroy'], 'post destroy steps');
  });

  test('it can render with angles (no args)', async function(assert) {
    this.owner.register('component:under-test', InstrumentedComponent);

    await render(hbs`<UnderTest />`);

    assert.verifySteps(['constructor', 'didInsertElement'], 'initial render steps');

    await clearRender();

    assert.verifySteps(['destroy'], 'post destroy steps');
  });

  test('it can render and update with angles (args)', async function(assert) {
    this.owner.register('component:under-test', InstrumentedComponent);
    this.owner.register('template:components/under-test', hbs`<p>{{@text}}</p>`);

    this.set('text', 'hello!');
    await render(hbs`<UnderTest @text={{this.text}} />`);

    assert.dom('p').hasText('hello!');
    assert.verifySteps(['constructor', 'didInsertElement'], 'initial render steps');

    this.set('text', 'hello world!');

    assert.dom('p').hasText('hello world!');
    assert.verifySteps(['didUpdate'], 'rerender steps');

    this.set('text', 'hello!');

    assert.dom('p').hasText('hello!');
    assert.verifySteps(['didUpdate'], 'rerender steps');

    await clearRender();

    assert.verifySteps(['destroy'], 'post destroy steps');
  });

  test('it can use args in component', async function(assert) {
    this.owner.register('component:under-test', class extends SparklesComponent {
      get text() {
        return this.args.text.toUpperCase();
      }
    });
    this.owner.register('template:components/under-test', hbs`<p>{{this.text}}</p>`);

    this.set('text', 'hello!');
    await render(hbs`<UnderTest @text={{this.text}} />`);
    assert.dom('p').hasText('HELLO!');
  });

  test('it can access injections in constructor', async function(assert) {
    this.owner.register('service:something', Service.extend({
      someMethod() { return 'it works!'; }
    }));
    class ComponentUnderTest extends SparklesComponent {
      constructor() {
        super(...arguments);

        let owner = getOwner(this);
        let something = owner.lookup('service:something');
        this.text = something.someMethod();
      }
    }
    this.owner.register('component:under-test', ComponentUnderTest);
    this.owner.register('template:components/under-test', hbs`<p>{{this.text}}</p>`);

    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('it works!');
  });

  test('it can use tracked to recompute when args change', async function(assert) {
    this.owner.register('component:under-test', class extends SparklesComponent {
      @tracked('args')
      get text() {
        return this.args.text.toUpperCase();
      }
    });
    this.owner.register('template:components/under-test', hbs`<p>{{this.text}}</p>`);

    this.set('text', 'hello!');
    await render(hbs`<UnderTest @text={{this.text}} />`);
    assert.dom('p').hasText('HELLO!');

    this.set('text', 'hello world!');
    assert.dom('p').hasText('HELLO WORLD!');

    this.set('text', 'hello!');
    assert.dom('p').hasText('HELLO!');
  });

  test('it can use tracked to recompute for changes', async function(assert) {
    this.owner.register('component:under-test', class extends SparklesComponent {
      constructor() {
        super(...arguments);

        this._count = 0;
      }

      @tracked
      get count() {
        return this._count;
      }

      set count(value) {
        this._count = value;
      }

      increment() {
        this.count++;
      }
    });
    this.owner.register(
      'template:components/under-test',
      hbs`<p>Count: {{this.count}}</p><button data-test="increment" onclick={{action this.increment}}>Increment</button>`
    );

    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('Count: 0');

    await click('button[data-test=increment]');
    assert.dom('p').hasText('Count: 1');

    await click('button[data-test=increment]');
    assert.dom('p').hasText('Count: 2');
  });

  test('does not update for non-tracked property changes', async function(assert) {
    this.owner.register('component:under-test', class extends SparklesComponent {
      constructor() {
        super(...arguments);

        this._count = 0;
      }

      get count() {
        return this._count;
      }

      set count(value) {
        this._count = value;
      }

      increment() {
        this.count++;
      }
    });
    this.owner.register(
      'template:components/under-test',
      hbs`<p>Count: {{this.count}}</p><button data-test="increment" onclick={{action this.increment}}>Increment</button>`
    );

    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('Count: 0');

    await click('button[data-test=increment]');
    assert.dom('p').hasText('Count: 0');

    await click('button[data-test=increment]');
    assert.dom('p').hasText('Count: 0');
  });

  test('it has an owner', async function(assert) {
    this.owner.register('component:under-test', class extends SparklesComponent {
      get environment() {
        return getOwner(this).resolveRegistration("config:environment").environment;
      }
    });
    this.owner.register(
      'template:components/under-test',
      hbs`<p>Environment: {{this.environment}}</p>`
    );
    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('Environment: test');
  });

  test('not calling super with all arguments issues deprecation', async function(assert) {
    this.owner.register('component:under-test', class UnderTest extends SparklesComponent {
      constructor(args) {
        super(args);
      }
      get environment() {
        return getOwner(this).resolveRegistration("config:environment").environment;
      }
    });
    this.owner.register(
      'template:components/under-test',
      hbs`<p>Environment: {{this.environment}}</p>`
    );
    await render(hbs`<UnderTest />`);
    assert.dom('p').hasText('Environment: test');

    assert.deprecationsInclude(`must call super with all arguments in the constructor for UnderTest`);
  });
});

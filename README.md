sparkles-component
==============================================================================

![R. Sparkles](https://media.giphy.com/media/NwkYPLmQSLmhy/giphy.gif)

Addon used to experiment with `@glimmer/component` style APIs in Ember apps via
existing public APIs.

Installation
------------------------------------------------------------------------------

```
ember install sparkles-component
```


Usage
------------------------------------------------------------------------------

The `sparkles-component` API supports most of the `@glimmer/component` API, including:

* Lifecycle hooks
  * `constructor` - will be called when the component is needed, passed the evaluated named arguments for the component
  * `didInsertElement` - will be called after the component has been rendered the first time, after the whole top-down rendering process is completed
  * `didUpdate` - will be called after the component has been updated, after the whole top-down rendering process is completed
  * `destroy` - will be called when the component is no longer needed
* Tracked properties
  * Support for setting local properties (triggering a rerender of that property)
  * Support for setting up dependent keys to cause a properties getter to be invoked again
  * Support for tracking class fields
* Decorator Support
  * Support for consuming with Babel 6 (just install `@ember-decorators/babel-transform`)
  * Support consuming via TypeScript (enable via `experimentalDecorators` compiler option in `tsconfig.json`)

Missing features from `@glimmer/component`:

* Access to `this.bounds` within the component. At the moment there is no access available at all to the rendered DOM. The easiest work around for now would be to use an attribute in your template along with `document.querySelector`.
* Access to `this.debugName` within the component. This was largely only present for debugging purposes, but is not possible to access in the Ember APIs at the moment.

### Example

Comprehensive example (nearly **exactly** the same as the [the glimmer.js guides](https://glimmerjs.com/guides/components-and-actions)):

```js
// app/components/conference-speakers.js (.ts would also work)
import Component, { tracked } from "sparkles-component";

export default class ConferenceSpeakers extends Component {
  @tracked current = 0;
  speakers = ['Tom', 'Yehuda', 'Ed'];

  @tracked('current')
  get currentlySpeaking() {
    return this.speakers[this.current];
  }

  @tracked('current')
  get moreSpeakers() {
    return (this.speakers.length - 1) > this.current;
  }

  next() {
    this.current = this.current + 1;
  }
}
```

```hbs
{{!-- app/templates/components/conference-speakers.hbs --}}

<div>
  <p>Speaking: {{currentlySpeaking}}</p>
  <ul>
    {{#each speakers key="@index" as |speaker|}}
      <li>{{speaker}}</li>
    {{/each}}
  </ul>

  {{#if moreSpeakers}}
    <button onclick={{action next}}>Next</button>
  {{else}}
    <p>All finished!</p>
  {{/if}}
</div>
```


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd sparkles-component`
* `yarn install`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

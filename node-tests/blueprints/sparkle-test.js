'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const { emberGenerateDestroy } = blueprintHelpers;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Classic App Layout: ember generate and destroy a sparkle component', function() {
  setupTestHooks(this);

  it('ember g sparkle x-foo', function() {
    // pass any additional command line options in the arguments array
    return emberNew().then(() =>
      emberGenerateDestroy(['sparkles-component', 'x-foo'], file => {
        expect(file('app/components/x-foo.js')).to.eq(
          `import Component from 'sparkles-component';

export default class XFoo extends Component {

}
`
        );
        expect(file('app/templates/components/x-foo.hbs')).to.eq(
          `{{yield}}
`
        );
      })
    );
  });
  it('ember g sparkle x-foo --lang ts', function() {
    // pass any additional command line options in the arguments array
    return emberNew().then(() =>
      emberGenerateDestroy(
        ['sparkles-component', 'x-foo', '--lang', 'ts'],
        file => {
          expect(file('app/components/x-foo.ts')).to.eq(
            `import Component from 'sparkles-component';

export default class XFoo extends Component {

}
`
          );
          expect(file('app/templates/components/x-foo.hbs')).to.eq(
            `{{yield}}
`
          );
        }
      )
    );
  });
  it('ember g sparkle x-foo --lang js', function() {
    // pass any additional command line options in the arguments array
    return emberNew().then(() =>
      emberGenerateDestroy(
        ['sparkles-component', 'x-foo', '--lang', 'js'],
        file => {
          expect(file('app/components/x-foo.js')).to.eq(
            `import Component from 'sparkles-component';

export default class XFoo extends Component {

}
`
          );
          expect(file('app/templates/components/x-foo.hbs')).to.eq(
            `{{yield}}
`
          );
        }
      )
    );
  });
});

describe('Classic Addon Layout: ember generate and destroy a sparkle component', function() {
  setupTestHooks(this);

  it('ember g sparkle x-boz', function() {
    // pass any additional command line options in the arguments array
    return emberNew({ target: 'addon' }).then(() =>
      emberGenerateDestroy(['sparkles-component', 'x-boz'], file => {
        expect(file('addon/components/x-boz.js')).to.eq(
          `import Component from 'sparkles-component';

export default class XBoz extends Component {

}
`
        );
        expect(file('addon/templates/components/x-boz.hbs')).to.eq(
          `{{yield}}
`
        );
        expect(file('app/components/x-boz.js')).to.eq(
          `export { default } from 'my-addon/components/x-boz';
`
        );
        expect(file('app/templates/components/x-boz.js')).to.eq(
          `export { default } from 'my-addon/templates/components/x-boz';
`
        );
      })
    );
  });
  it('ember g sparkle x-baz --lang js', function() {
    // pass any additional command line options in the arguments array
    return emberNew({ target: 'addon' }).then(() =>
      emberGenerateDestroy(
        ['sparkles-component', 'x-baz', '--lang', 'js'],
        file => {
          expect(file('addon/components/x-baz.js')).to.eq(
            `import Component from 'sparkles-component';

export default class XBaz extends Component {

}
`
          );
          expect(file('addon/templates/components/x-baz.hbs')).to.eq(
            `{{yield}}
`
          );
          expect(file('app/components/x-baz.js')).to.eq(
            `export { default } from 'my-addon/components/x-baz';
`
          );
          expect(file('app/templates/components/x-baz.js')).to.eq(
            `export { default } from 'my-addon/templates/components/x-baz';
`
          );
        }
      )
    );
  });
  it('ember g sparkle x-biz --lang ts', function() {
    // pass any additional command line options in the arguments array
    return emberNew({ target: 'addon' }).then(() =>
      emberGenerateDestroy(
        ['sparkles-component', 'x-biz', '--lang', 'ts'],
        file => {
          expect(file('addon/components/x-biz.ts')).to.eq(
            `import Component from 'sparkles-component';

export default class XBiz extends Component {

}
`
          );
          expect(file('addon/templates/components/x-biz.hbs')).to.eq(
            `{{yield}}
`
          );
          expect(file('app/components/x-biz.js')).to.eq(
            `export { default } from 'my-addon/components/x-biz';
`
          );
          expect(file('app/templates/components/x-biz.js')).to.eq(
            `export { default } from 'my-addon/templates/components/x-biz';
`
          );
        }
      )
    );
  });
});

describe('MU App Layout: ember generate and destroy a sparkle component', function() {
  setupTestHooks(this);

  it('ember g sparkle x-foo', function() {
    // pass any additional command line options in the arguments array
    return emberNew({ isModuleUnification: true }).then(() =>
      emberGenerateDestroy(
        ['sparkles-component', 'x-foo'],
        file => {
          expect(file('src/ui/components/x-foo/component.js')).to.eq(
            `import Component from 'sparkles-component';

export default class XFoo extends Component {

}
`
          );
          expect(file('src/ui/components/x-foo/template.hbs')).to.eq(
            `{{yield}}
`
          );
        },
        { isModuleUnification: true }
      )
    );
  });
  it('ember g sparkle x-foo --lang js', function() {
    // pass any additional command line options in the arguments array
    return emberNew({ isModuleUnification: true }).then(() =>
      emberGenerateDestroy(
        ['sparkles-component', 'x-foo', '--lang', 'js'],
        file => {
          expect(file('src/ui/components/x-foo/component.js')).to.eq(
            `import Component from 'sparkles-component';

export default class XFoo extends Component {

}
`
          );
          expect(file('src/ui/components/x-foo/template.hbs')).to.eq(
            `{{yield}}
`
          );
        },
        { isModuleUnification: true }
      )
    );
  });
  it('ember g sparkle x-foo --lang ts', function() {
    // pass any additional command line options in the arguments array
    return emberNew({ isModuleUnification: true }).then(() =>
      emberGenerateDestroy(
        ['sparkles-component', 'x-foo', '--lang', 'ts'],
        file => {
          expect(file('src/ui/components/x-foo/component.ts')).to.eq(
            `import Component from 'sparkles-component';

export default class XFoo extends Component {

}
`
          );
          expect(file('src/ui/components/x-foo/template.hbs')).to.eq(
            `{{yield}}
`
          );
        },
        { isModuleUnification: true }
      )
    );
  });
});

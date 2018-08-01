import { inject as service } from "@ember/service";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";
import SparklesComponent from "sparkles-component";

module('Unit | Component | sparkles component', function (hooks) {
  setupTest(hooks);
  test('injecting service', async function (assert) {
    const RoutingComponent = class extends SparklesComponent {
      router = service();
    }
    const comp = new RoutingComponent();
    assert.ok(comp.router.currentRouteName);
  });
});

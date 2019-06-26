import Component, { tracked } from "sparkles-component";

export default class InsertElement extends Component {
  @tracked
  insertedElement = null;

  didInsertElement() {
    super.didInsertElement();

    this.insertedElement = "inserted the element";
  }
}

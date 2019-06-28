import Component, { tracked } from "sparkles-component";

export default class InsertElement extends Component {
  @tracked insertedElement = null;

  @tracked updateElement = null;

  didInsertElement() {
    super.didInsertElement();

    this.insertedElement = "inserted the element";
  }

  didUpdateElement() {
    super.didUpdateElement();

    this.updateElement = "updated the element";
  }
}

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

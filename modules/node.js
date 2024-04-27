export default class Node {
  constructor(ctx) {
    this.ctx = ctx;
    this.childNodes = [];
    this.isAlive = true;
  }

  update() {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      const item = this.childNodes[i];
      if (item.isAlive) {
        item.update();
      } else {
        this.childNodes.splice(i, 1);
      }
    }
  }

  render() {
    this.childNodes.filter((x) => x.isAlive).forEach((c) => c.render());
  }

  kill() {
    this.isAlive = false;
  }
}

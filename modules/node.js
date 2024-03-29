export default class Node {
  constructor(ctx) {
    this.ctx = ctx;
    this.childNodes = [];
    this.isAlive = true;
  }

  update(){
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
        const item = this.childNodes[i];
    
        if (item.isAlive) {
            // Call the update method if the item is alive
            item.update();
        } else {
            // Remove the item from the list if it's not alive
            this.childNodes.splice(i, 1);
        }
    }
  }

  render() {
    this.childNodes.filter(x => x.isAlive).forEach((c) => c.render()); 
    // capaz falla el splice?
    // el filter por isAlive no debería necesitarlo :/
  }

  kill() {
    this.isAlive = false;
  }


  // player crea un rayo por frame
  // rayo se crea en un update con un life de 1.
  // rayo se dibuja en ese frame
  // en el proximo update, el rayo se va a marcar con life de 0
  // el update lo puedo hacer desde abajo hacia arriba, entonces el update del padre va a borrarlo de la lista, y luego no se va a ver el rayo?
}

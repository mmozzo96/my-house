import { Screen } from "./elements/screen";
import { Desk } from "./elements/desk";
import { Viewport } from "./viewport";
import * as THREE from "three";
import { Keyboard } from "./elements/keyboard";
import { Chair } from "./elements/chair";
import { Book } from "./elements/book";

export class Visualization {
  vpt: Viewport;

  constructor(vpt: Viewport) {
    this.vpt = vpt;
  }

  public AddElements() {
    const assets = [];

    const table = new Desk(this.vpt);

    const screen = new Screen(this.vpt);
    screen.element.position.add(
      new THREE.Vector3(0, table.height, -table.depth / 6)
    );

    const keyboard = new Keyboard(this.vpt);
    keyboard.element.position.add(
      new THREE.Vector3(0, table.height, table.depth / 4)
    );

    const chair = new Chair(this.vpt);
    chair.element.rotateY(Math.PI);
    chair.element.position.add(new THREE.Vector3(0, 0, table.depth / 2));

    const book = new Book(this.vpt);

    /* assets.push(table.element);
    assets.push(screen.element);
    assets.push(keyboard.element);
    assets.push(chair.element); */
    assets.push(book.element);

    assets.forEach((element) => this.vpt.scene.add(element));
  }
}

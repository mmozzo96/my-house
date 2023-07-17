import { Screen } from "./elements/screen";
import { Desk } from "./elements/desk";
import { Viewport } from "./viewport";
import * as THREE from "three";
import { Keyboard } from "./elements/keyboard";
import { Chair } from "./elements/chair";

export class Visualization {
  vpt: Viewport;

  constructor(vpt: Viewport) {
    this.vpt = vpt;
  }

  public AddElements() {
    const assets = [];

    const table = new Desk(this.vpt);
    assets.push(table.element);

    const screen = new Screen(this.vpt);
    screen.element.position.add(
      new THREE.Vector3(0, table.height, -table.depth / 6)
    );
    assets.push(screen.element);

    const keyboard = new Keyboard(this.vpt);
    keyboard.element.position.add(
      new THREE.Vector3(0, table.height, table.depth / 4)
    );
    assets.push(keyboard.element);

    const chair = new Chair(this.vpt);
    chair.element.rotateY(Math.PI);
    chair.element.position.add(new THREE.Vector3(0, 0, table.depth / 2));
    assets.push(chair.element);

    assets.forEach((element) => this.vpt.scene.add(element));
  }
}

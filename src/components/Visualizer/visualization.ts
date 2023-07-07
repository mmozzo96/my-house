import { Screen } from "./elements/screen";
import { Desk } from "./elements/desk";
import { Viewport } from "./viewport";
import * as THREE from "three";
import { Keyboard } from "./elements/keyboard";

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
      new THREE.Vector3(0, table.heigth, -table.depth / 6)
    );
    assets.push(screen.element);

    const keyboard = new Keyboard(this.vpt);
    keyboard.element.position.add(
      new THREE.Vector3(0, table.heigth, table.depth / 4)
    );
    assets.push(keyboard.element);

    assets.forEach((element) => this.vpt.scene.add(element));
  }
}

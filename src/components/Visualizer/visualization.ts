import { Screen } from "./elements/screen";
import { Desk } from "./elements/desk";
import { Viewport } from "./viewport";
import * as THREE from "three";

export class Visualization {
  vpt: Viewport;

  constructor(vpt: Viewport) {
    this.vpt = vpt;
  }

  public AddElements() {
    const table = new Desk(this.vpt);
    const pc = new Screen(this.vpt);

    const assets = [table.element, pc.element];
    pc.element.position.add(
      new THREE.Vector3(0, table.heigth, -table.depth / 6)
    );

    assets.forEach((element) => this.vpt.scene.add(element));
  }
}

import { Viewport } from "../viewport";
import * as THREE from "three";

export type ElementType = {
  heigth: number;
  width: number;
  depth: number;
  CreateElement: () => void;
};

export class Element3D {
  vpt!: Viewport;
  element!: THREE.Group;

  constructor(vpt: Viewport) {
    this.vpt = vpt;
    this.element = new THREE.Group();
  }

  public AddElement() {
    this.vpt.scene.add(this.element);
  }
}

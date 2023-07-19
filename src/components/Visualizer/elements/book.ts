import { Viewport } from "../viewport";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";

export class Book extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();

    this.ScaleForDebugging(5);
  }

  public CreateElement() {
    const width = 1;
    const height = 0.15;
    const depth = 0.65;
    const geometry = new THREE.BoxGeometry(width, height, depth, 20, 100, 20);

    const vertices = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      if (v3.z > depth / 2 - 0.03 && Math.abs(v3.y) < height / 2 - 0.01) {
        v3.z = depth / 2 - 0.03;
      }
      if (
        v3.x > width / 2 - 0.02 &&
        Math.abs(v3.y) < height / 2 - 0.01 &&
        v3.z > -depth / 2 + 0.00001
      ) {
        v3.x = width / 2 - 0.02;
      }
      if (
        v3.x < -width / 2 + 0.02 &&
        Math.abs(v3.y) < height / 2 - 0.01 &&
        v3.z > -depth / 2 + 0.00001
      ) {
        v3.x = -width / 2 + 0.02;
      }
      if (v3.z < -depth / 2 + 0.00001) {
        v3.z =
          -(((height / 2) ** 2 - (Math.abs(v3.y) - 0.001) ** 2) ** (1 / 2)) -
          depth / 2;
      }
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    const mesh = new THREE.Mesh(geometry, this.vpt.material);

    this.element.add(mesh);
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

import { Viewport } from "../viewport";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";
import { RoundedBox } from "./geometries/RoundedBox";

export class RoomWalls extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    const material = this.vpt.material.clone();
    material.color.set(0xaaaaaa);
    material.roughness = 1;

    const floorGeom = RoundedBox({
      width: 8,
      height: 0.5,
      depth: 8,
    });
    const floor = new THREE.Mesh(floorGeom, material);
    floor.position.set(3.5, -0.25, 3.5);

    this.vpt.scene.add(floor);

    const wallXGeom = RoundedBox({
      width: 8,
      height: 8,
      depth: 0.5,
    });
    const wallX = new THREE.Mesh(wallXGeom, material);
    wallX.position.set(3.5, 3.5, -0.25);

    this.vpt.scene.add(wallX);

    const wallZGeom = RoundedBox({
      width: 0.5,
      height: 8,
      depth: 8,
    });
    const wallZ = new THREE.Mesh(wallZGeom, material);
    wallZ.position.set(-0.25, 3.5, 3.5);

    this.vpt.scene.add(wallZ);
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

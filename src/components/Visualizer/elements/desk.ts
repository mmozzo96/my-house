import { Viewport } from "../viewport";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";

export class Desk extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    const flatHeight = 0.3;
    const flatWidth = 5;
    this.width = flatWidth;
    const flatDepth = 2.5;
    this.depth = flatDepth;
    const flatGeometry = new THREE.BoxGeometry(
      flatWidth,
      flatHeight,
      flatDepth
    );
    const flatMaterial = this.vpt.material.clone();
    flatMaterial.color = new THREE.Color(0xdddddd);
    const flat = new THREE.Mesh(flatGeometry, flatMaterial);
    flat.position.y = flatHeight / 2;

    this.element.add(flat);

    const legHeight = 2.5;
    this.heigth = flatHeight + legHeight;
    const halfLegHeight = legHeight / 2;

    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, legHeight + 2, 16);

    const innerAngle = (10 * Math.PI) / 180;
    const legsGeometries = [
      legGeometry.clone().rotateZ(innerAngle).rotateY(innerAngle),
      legGeometry.clone().rotateZ(innerAngle).rotateY(-innerAngle),
      legGeometry.clone().rotateZ(-innerAngle).rotateY(innerAngle),
      legGeometry.clone().rotateZ(-innerAngle).rotateY(-innerAngle),
    ];
    const legs: THREE.Mesh[] = [];

    legsGeometries.forEach((geometry) => {
      const vertices = geometry.attributes.position;

      const v3 = new THREE.Vector3();
      for (let i = 0; i < vertices.count; i++) {
        v3.fromBufferAttribute(vertices, i);
        v3.y =
          v3.y > halfLegHeight
            ? halfLegHeight
            : v3.y < -halfLegHeight
            ? -halfLegHeight
            : v3.y;
        vertices.setY(i, v3.y);
      }
      const leg = new THREE.Mesh(geometry, this.vpt.material);
      leg.position.add(new THREE.Vector3(0, -halfLegHeight, 0));
      legs.push(leg.clone());
    });

    const legXShift = 2;
    const legZShift = 0.75;
    legs[0].position.add(new THREE.Vector3(legXShift, 0, -legZShift));
    legs[1].position.add(new THREE.Vector3(legXShift, 0, legZShift));
    legs[2].position.add(new THREE.Vector3(-legXShift, 0, legZShift));
    legs[3].position.add(new THREE.Vector3(-legXShift, 0, -legZShift));

    legs.forEach((leg) => this.element.add(leg));

    this.element.position.add(new THREE.Vector3(0, legHeight, 0));
  }
}

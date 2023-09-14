import { Viewport } from "../../viewport";
import { Element3D, ElementType } from "../element";
import * as THREE from "three";

export class Hat extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    this.CreateHat();
    // this.CreateString();
  }

  private CreateHat() {
    this.height = 0;
    this.width = 0;
    this.depth = 0;

    const cylRadius = 0.35;
    const cylHeight = 0.3;
    this.height += cylHeight;

    const cylinderGeom = new THREE.CylinderGeometry(
      cylRadius,
      cylRadius,
      cylHeight,
      20,
      1,
      true
    );

    const material = this.vpt.material.clone();
    material.side = THREE.DoubleSide;
    material.opacity = 1;
    material.color = new THREE.Color(0x444444);
    const cylinder = new THREE.Mesh(cylinderGeom, material);
    cylinder.translateY(cylHeight / 2);

    this.element.add(cylinder);

    const flatSide = 0.9;
    this.width = flatSide;
    this.depth = flatSide;
    const flatHeight = 0.01;
    this.height += flatHeight;

    const flatGeom = new THREE.BoxGeometry(flatSide, flatHeight, flatSide);

    const flatSurface = new THREE.Mesh(flatGeom, material);
    flatSurface.translateY(cylHeight + flatHeight / 2);

    this.element.add(flatSurface);
  }

  private CreateString() {
    const stringRadius = 0.005;
    const stringLength = this.depth / 2 - stringRadius;

    const stringGeom = new THREE.CylinderGeometry(
      stringRadius,
      stringRadius,
      stringLength
    );
    stringGeom.rotateX(Math.PI / 2);
    stringGeom.translate(
      0,
      this.height + stringRadius,
      stringRadius + stringLength / 2
    );

    const string = new THREE.Mesh(stringGeom, this.vpt.material);

    this.element.add(string);
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

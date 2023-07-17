import { Viewport } from "../viewport";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";
import { RoundedBox } from "./geometries/RoundedBox";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

export class Keyboard extends Element3D implements ElementType {
  steepness!: number;
  buttonSize!: number;

  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    this.width = 1.3;
    this.height = 0.1;
    this.depth = 0.5;
    const geometry = RoundedBox({
      width: this.width,
      height: this.height,
      depth: this.depth,
    });

    const vertices = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    const inclineFactor = 4;
    this.steepness = this.height / (this.depth * inclineFactor);
    const heightOffset =
      (this.height * (inclineFactor - 2)) / (2 * inclineFactor);
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      v3.y =
        v3.y > -v3.z * this.steepness + heightOffset
          ? ((v3.y * 2) / this.height) * (-v3.z * this.steepness + heightOffset)
          : v3.y;
      vertices.setY(i, v3.y);
    }

    const mesh = new THREE.Mesh(geometry, this.vpt.material);

    this.element.add(mesh);

    const { geometry: buttonsRowGeom, size: buttonsSize } = this.ButtonsRow();
    const buttonsRow = new THREE.Mesh(buttonsRowGeom, this.vpt.material);
    buttonsRow.position.set(0, heightOffset, 0);
    const rowsStep = buttonsSize * 1.5;

    for (let i = 0; i < 5; i++) {
      const row = buttonsRow.clone();
      row.position.set(
        0,
        (i - 2) * rowsStep * this.steepness + heightOffset,
        (2 - i) * rowsStep
      );
      this.element.add(row);
    }

    this.element.position.set(0, this.height / 2, 0);
  }

  private Button() {
    const size = 0.05;
    this.buttonSize = size;
    const height = 0.04;
    const geometry = new THREE.BoxGeometry(size, height, size);
    geometry.translate(0, height / 2, -size / 2);

    const vertices = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      v3.y = v3.y > -v3.z * this.steepness ? v3.y : -v3.z * this.steepness;
      vertices.setY(i, v3.y);
    }

    geometry.translate(0, (-size * this.steepness) / 2, size / 2);

    return { geometry: geometry.clone(), size };
  }

  private ButtonsRow() {
    const buttons: THREE.BufferGeometry[] = [];
    const rowSize = 17;
    let buttonSize = 0;

    for (let i = 0; i < rowSize; i++) {
      const { geometry, size } = this.Button();
      buttonSize = size;
      const step = size * 1.35;
      geometry.translate(step * (i - Math.floor(rowSize / 2)), 0, 0);

      buttons.push(geometry);
    }

    const buttonsRowGeom = BufferGeometryUtils.mergeGeometries(buttons);

    return { geometry: buttonsRowGeom, size: buttonSize };
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

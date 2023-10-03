import { Viewport } from "../../viewport";
import { Element3D, ElementType } from "../element";
import * as THREE from "three";

export class Frame extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    const height = 0.4;
    const width = 0.7;
    const depth = 0.02;

    [this.height, this.width] = [height, width];

    const frameGeom = new THREE.BoxGeometry(
      width,
      height,
      depth,
      200,
      200,
      100
    );

    const vertices = frameGeom.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);

      v3.z =
        v3.z > 0 &&
        (Math.abs(v3.y) > height / 2 - 0.05 ||
          Math.abs(v3.x) > width / 2 - 0.05)
          ? v3.z + 0.01
          : v3.z;

      vertices.setZ(i, v3.z);
    }
    frameGeom.translate(0, height / 2, depth / 2 + 0.07);

    const frame = new THREE.Mesh(frameGeom, this.vpt.material);
    frame.rotateX(-(Math.PI * 15) / 180);

    this.element.add(frame);

    const pictureGeom = new THREE.PlaneGeometry(width - 0.05, height - 0.05);
    pictureGeom.translate(0, height / 2 - 0.025, depth / 2);
    const pictureMaterial = this.vpt.material.clone();
    pictureMaterial.color = new THREE.Color(0xffff00);
    const picture = new THREE.Mesh(pictureGeom, pictureMaterial);
    picture.position.set(0, 0.05, 0.084);
    picture.rotateX(-(Math.PI * 15) / 180);

    this.element.add(picture);

    this.CreateStand();
  }

  private CreateStand() {
    const standGeom = new THREE.BoxGeometry(0.1, 0.3, 0.01, 100, 100);
    standGeom.translate(0, 0.15, 0);

    const vertices = standGeom.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);

      v3.y =
        v3.y > 0.1 && v3.y > -8 * Math.abs(v3.x) + 0.5
          ? -8 * Math.abs(v3.x) + 0.5
          : v3.y < 0.1 && v3.y < Math.abs(v3.x)
          ? Math.abs(v3.x)
          : v3.y;

      vertices.setY(i, v3.y);
    }

    const stand = new THREE.Mesh(standGeom, this.vpt.material);
    stand.rotateX((Math.PI * 20) / 180);

    stand.position.set(0, 0, -0.3 * Math.sin((Math.PI * 20) / 180));

    this.element.add(stand);
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

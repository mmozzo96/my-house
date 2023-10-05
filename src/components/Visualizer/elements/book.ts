import { Viewport } from "../viewport";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";

export class Book extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    const width = 1;
    const height = 0.15;
    const depth = 0.65;
    const geometry = new THREE.BoxGeometry(width, height, depth, 10, 20, 10);

    const vertices = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      if (v3.z > depth / 2 - 0.03 && Math.abs(v3.y) < height / 2 - 0.01) {
        v3.z = 0;
      }
      if (
        v3.x > width / 2 - 0.02 &&
        Math.abs(v3.y) < height / 2 - 0.01 &&
        v3.z > -depth / 2 + 0.00001
      ) {
        v3.x = 0;
      }
      if (
        v3.x < -width / 2 + 0.02 &&
        Math.abs(v3.y) < height / 2 - 0.01 &&
        v3.z > -depth / 2 + 0.0001
      ) {
        v3.x = 0;
      }
      if (v3.z < -depth / 2 + 0.00001) {
        v3.z =
          -(((height / 2) ** 2 - (Math.abs(v3.y) - 0.001) ** 2) ** (1 / 2)) -
          depth / 2;
      }
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    const material = this.vpt.material.clone();
    material.color = new THREE.Color(0x00ff00);
    material.opacity = 1;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "cover";

    this.element.add(mesh);

    const pageMaterial = this.vpt.material.clone();
    pageMaterial.color = new THREE.Color(0xffffff);
    pageMaterial.opacity = 1;

    const page1Geometry = new THREE.PlaneGeometry(width - 0.04, height - 0.02);
    page1Geometry.translate(0, 0, depth / 2 - 0.0299);
    const page1 = new THREE.Mesh(page1Geometry, pageMaterial);

    this.element.add(page1);

    const page2Geometry = new THREE.PlaneGeometry(
      height / 2 + depth - 0.03,
      height - 0.02,
      100,
      10
    );
    page2Geometry.rotateY(Math.PI / 2);
    page2Geometry.translate(width / 2 - 0.0199, 0, -(height / 4 + 0.015));
    const p2Vertices = page2Geometry.attributes.position;
    const p2V3 = new THREE.Vector3();
    for (let i = 0; i < p2Vertices.count; i++) {
      p2V3.fromBufferAttribute(p2Vertices, i);
      if (
        p2V3.z < -depth / 2 &&
        (p2V3.z + depth / 2) ** 2 + p2V3.y ** 2 > (height / 2) ** 2
      ) {
        p2V3.z =
          -(((height / 2) ** 2 - (Math.abs(v3.y) - 0.001) ** 2) ** (1 / 2)) -
          depth / 2;
      }
      p2Vertices.setZ(i, p2V3.z);
    }
    const page2 = new THREE.Mesh(page2Geometry, pageMaterial);

    this.element.add(page2);

    const page3Geometry = page2Geometry.clone();
    page3Geometry.rotateZ(Math.PI);
    const page3 = new THREE.Mesh(page3Geometry, pageMaterial);

    this.element.add(page3);

    this.element.position.set(0, height / 2, 0);

    this.width = width;
    this.height = height;
    this.depth = depth + height / 2;
  }

  public SetColor(color: THREE.ColorRepresentation) {
    const cover = this.element.children.find(
      (o) => o.name === "cover"
    ) as THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
    cover.material.color = new THREE.Color(color);
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

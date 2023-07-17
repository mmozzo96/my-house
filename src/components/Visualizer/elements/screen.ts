import { Viewport } from "../viewport";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";
import { RoundedBox } from "./geometries/RoundedBox";

export class Screen extends Element3D implements ElementType {
  baseHeight!: number;
  standHeight!: number;
  standZshifth!: number;
  screenStandDepth!: number;

  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    this.CreateBase();
    this.CreateStand();
    this.CreateScreenStand();
    this.CreateScreen();
  }

  private CreateBase() {
    const height = 0.1;
    this.baseHeight = height;
    const radius = 0.3;
    this.depth = radius;

    const geometry = new THREE.CylinderGeometry(radius, radius, height, 16);

    const vertices = geometry.attributes.position;

    const v3 = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      v3.x = v3.x * 1.4;
      vertices.setX(i, v3.x);
    }

    const base = new THREE.Mesh(geometry, this.vpt.material);
    base.position.add(new THREE.Vector3(0, height / 2, 0));

    this.element.add(base);
  }

  private CreateStand() {
    const height = 0.75;
    this.standHeight = height;
    this.standZshifth = -0.1;

    const geometry = new THREE.CylinderGeometry(0.05, 0.05, height, 16);

    const stand = new THREE.Mesh(geometry, this.vpt.material);
    stand.position.add(
      new THREE.Vector3(0, this.baseHeight + height / 2, this.standZshifth)
    );

    this.element.add(stand);
  }

  private CreateScreenStand() {
    const width = 0.3;
    const height = 0.15;
    const depth = 0.025;
    this.screenStandDepth = depth;
    const geometry = new THREE.BoxGeometry(width, height, depth, 20, 20, 20);

    const vertices = geometry.attributes.position;

    const v3 = new THREE.Vector3();
    const parabola = (x: number) => 0.1 * x * x - depth / 2;
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      v3.z = v3.z < parabola(v3.x / width) ? parabola(v3.x / width) : v3.z;
      v3.z = v3.z < parabola(v3.y / height) ? parabola(v3.y / height) : v3.z;
      vertices.setZ(i, v3.z);
    }

    const screenStand = new THREE.Mesh(geometry, this.vpt.material);
    screenStand.position.add(
      new THREE.Vector3(
        0,
        this.baseHeight + this.standHeight,
        depth / 2 + this.standZshifth
      )
    );

    this.element.add(screenStand);
  }

  private CreateScreen() {
    const width = 1.5;
    this.width = width;
    const height = 0.75;
    const depth = 0.1;
    const geometry = new THREE.BoxGeometry(width, height, depth, 20, 20, 20);

    const vertices = geometry.attributes.position;

    const v3 = new THREE.Vector3();
    const parabola = (x: number) => 0.3 * x * x - depth / 2;
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      v3.z = v3.z < parabola(v3.x / width) ? parabola(v3.x / width) : v3.z;
      v3.z = v3.z < parabola(v3.y / height) ? parabola(v3.y / height) : v3.z;
      vertices.setZ(i, v3.z);
    }

    const screenCase = new THREE.Mesh(geometry, this.vpt.material);
    screenCase.position.set(
      0,
      this.baseHeight + this.standHeight,
      depth / 2 + this.standZshifth + this.screenStandDepth
    );

    const screenGeometry = new THREE.PlaneGeometry(width - 0.1, height - 0.1);
    const screen = new THREE.Mesh(
      screenGeometry,
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    screen.position.set(
      0,
      this.baseHeight + this.standHeight,
      depth + 0.0001 + this.standZshifth + this.screenStandDepth
    );
    screen.name = "screen";

    this.element.add(screenCase);
    this.element.add(screen);

    this.height = this.baseHeight + this.standHeight + height / 2;
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

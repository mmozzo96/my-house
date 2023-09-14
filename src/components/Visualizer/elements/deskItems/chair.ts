import { Viewport } from "../../viewport";
import { Element3D, ElementType } from "../element";
import * as THREE from "three";
import { RoundedBox } from "../geometries/RoundedBox";
import { CylinderGeometry } from "three";

export class Chair extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();
  }

  public CreateElement() {
    const { LegsHeight } = this.CreateLegs();
    const { SeatWidth, SeatHeight, SeatDepth } = this.CreateSeat(LegsHeight);
    this.CreateBack(LegsHeight + SeatHeight);
  }

  private CreateLegs() {
    const radius = 0.1;
    const height = 1.6;

    const tetha = (10 * Math.PI) / 180;
    const phi = Math.PI / 4;

    const geometry = new CylinderGeometry(radius, radius, height + 0.1, 16);
    geometry.rotateZ(tetha);
    geometry.rotateY(-phi);
    const vertices = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < vertices.count; i++) {
      v3.fromBufferAttribute(vertices, i);
      v3.y =
        v3.y > height / 2
          ? height / 2
          : v3.y < -height / 2
          ? -height / 2
          : v3.y;
      vertices.setY(i, v3.y);
    }

    const FLGeometry = geometry.clone();
    FLGeometry.translate(0.65, height / 2, 0.5);

    const FLLeg = new THREE.Mesh(FLGeometry, this.vpt.material);

    this.element.add(FLLeg);

    const FRGeometry = geometry.clone();
    FRGeometry.rotateY(Math.PI / 2);
    FRGeometry.translate(0.65, height / 2, -0.5);

    const FRLeg = new THREE.Mesh(FRGeometry, this.vpt.material);

    this.element.add(FRLeg);

    const BLGeometry = geometry.clone();
    BLGeometry.rotateY(-Math.PI / 2);
    BLGeometry.translate(-0.65, height / 2, 0.5);

    const BLLeg = new THREE.Mesh(BLGeometry, this.vpt.material);

    this.element.add(BLLeg);

    const BRGeometry = geometry.clone();
    BRGeometry.rotateY(Math.PI);
    BRGeometry.translate(-0.65, height / 2, -0.5);

    const BRLeg = new THREE.Mesh(BRGeometry, this.vpt.material);

    this.element.add(BRLeg);

    return { LegsHeight: height };
  }

  private CreateSeat(LegsHeight: number) {
    const width = 1.8;
    this.width = width;
    const depth = 1.5;
    this.depth = depth;
    const height = 0.2;

    const geometry = RoundedBox({
      width,
      depth,
      height,
      widthSegments: 30,
      depthSegments: 30,
    });

    const mesh = new THREE.Mesh(geometry, this.vpt.material);
    mesh.position.set(0, LegsHeight + height / 2, 0);

    this.element.add(mesh);

    return { SeatWidth: width, SeatHeight: height, SeatDepth: depth };
  }

  private CreateBack(RestHeight: number) {
    const cylinderRadius = 0.03;
    const cylinderHeight = 1.4;

    const cylinderGeometry = new CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      cylinderHeight + 0.1
    );
    cylinderGeometry.rotateX(-(5 * Math.PI) / 180);
    const cylinderVertices = cylinderGeometry.attributes.position;
    const cylinderV3 = new THREE.Vector3();
    for (let i = 0; i < cylinderVertices.count; i++) {
      cylinderV3.fromBufferAttribute(cylinderVertices, i);
      cylinderV3.y =
        cylinderV3.y > cylinderHeight / 2
          ? cylinderHeight / 2
          : cylinderV3.y < -cylinderHeight / 2
          ? -cylinderHeight / 2
          : cylinderV3.y;
      cylinderVertices.setY(i, cylinderV3.y);
    }
    cylinderGeometry.translate(0, RestHeight + cylinderHeight / 2, -0.6);

    const cylinder = new THREE.Mesh(cylinderGeometry, this.vpt.material);

    this.element.add(cylinder);

    const cylinderBack = cylinder.clone();
    cylinderBack.translateX(-0.6);

    this.element.add(cylinderBack);

    const cylinderFront = cylinder.clone();
    cylinderFront.translateX(0.6);

    this.element.add(cylinderFront);

    const backGeometry = RoundedBox({ width: 1.8, height: 0.7, depth: 0.1 });
    backGeometry.rotateX(-(5 * Math.PI) / 180);

    const back = new THREE.Mesh(backGeometry, this.vpt.material);
    back.position.set(0, RestHeight + cylinderHeight, -0.6);

    this.element.add(back);
  }

  private ScaleForDebugging(scale: number) {
    this.element.scale.set(scale, scale, scale);
  }
}

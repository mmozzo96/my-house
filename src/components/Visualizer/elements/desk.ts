import { Viewport } from "../viewport";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";

import { Screen } from "./deskItems/screen";
import { Keyboard } from "./deskItems/keyboard";
import { Chair } from "./deskItems/chair";
import { Book } from "./book";

export class Desk extends Element3D implements ElementType {
  flatHeight: number = 0;
  legsHeight: number = 0;

  constructor(vpt: Viewport) {
    super(vpt);
    this.CreateElement();

    this.AddScreens();
    this.AddKeyboard();
    this.AddChair();
    this.AddBooks();
  }

  public CreateElement() {
    const flatHeight = 0.15;
    this.flatHeight = flatHeight;
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
    this.legsHeight = legHeight;
    this.height = flatHeight + legHeight;
    const halfLegHeight = legHeight / 2;

    const legRadius = 0.15;
    const legGeometry = new THREE.CylinderGeometry(
      legRadius,
      legRadius,
      legHeight + 2,
      16
    );

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

  private AddScreens() {
    const screens = new THREE.Group();
    screens.name = "screens";

    const screen1 = new Screen(this.vpt);
    screen1.element.rotateY((15 * Math.PI) / 180);
    screen1.element.position.set(
      -this.width / 10,
      this.flatHeight,
      -this.depth / 5
    );

    screens.add(screen1.element);

    const screen2 = new Screen(this.vpt);
    screen2.element.rotateY(-(25 * Math.PI) / 180);
    screen2.element.position.set(
      this.width / 5,
      this.flatHeight,
      -this.depth / 7
    );

    screens.add(screen2.element);

    const bBox = new THREE.Box3().setFromObject(screens);
    const bBoxGeom = new THREE.BoxGeometry(
      bBox.max.x - bBox.min.x,
      bBox.max.y - bBox.min.y,
      bBox.max.z - bBox.min.z
    );
    const bBoxMesh = new THREE.Mesh(
      bBoxGeom,
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        visible: false,
      })
    );
    bBoxMesh.position.set(
      (bBox.max.x + bBox.min.x) / 2,
      (bBox.max.y + bBox.min.y) / 2,
      (bBox.max.z + bBox.min.z) / 2
    );

    screens.add(bBoxMesh);

    this.element.add(screens);
  }

  private AddKeyboard() {
    const keyboard = new Keyboard(this.vpt);
    keyboard.element.position.add(
      new THREE.Vector3(this.width / 20, this.flatHeight, this.depth / 4)
    );

    this.element.add(keyboard.element);
  }

  private AddBooks() {
    const book1 = new Book(this.vpt);
    book1.element.rotateY((70 * Math.PI) / 180);
    book1.element.position.add(
      new THREE.Vector3((-2 * this.width) / 6, this.flatHeight, -this.depth / 8)
    );

    this.element.add(book1.element);

    const book2 = new Book(this.vpt);
    book2.element.rotateY((85 * Math.PI) / 180);
    book2.element.position.add(
      new THREE.Vector3(
        (-2 * this.width) / 6,
        this.flatHeight + book1.height,
        -this.depth / 8
      )
    );

    this.element.add(book2.element);
  }

  private AddChair() {
    const chair = new Chair(this.vpt);
    chair.element.rotateY(Math.PI);
    chair.element.position.add(
      new THREE.Vector3(this.width / 20, -this.legsHeight, this.depth / 2)
    );

    this.element.add(chair.element);
  }
}

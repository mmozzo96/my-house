import { Viewport } from "../viewport";
import { Book } from "./book";
import { BookStack } from "./bookshelfItems/bookStack";
import { Hat } from "./bookshelfItems/hat";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";
import { Football } from "./bookshelfItems/football";
import { Frame } from "./bookshelfItems/frame";

export class Bookshelf extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);

    this.CreateElement();

    this.AddBookStacks();
    this.AddHat();
    this.AddFootball();
    this.AddFrame();
    this.AddElementsLastShelf();
  }

  public CreateElement() {
    const height = 6;
    this.height = height;
    const width = 3;
    this.width = width;
    const depth = 1;
    this.depth = depth;

    const sideGeom = new THREE.BoxGeometry(0.1, height, depth);
    const side1Geom = sideGeom.clone();
    side1Geom.translate(width / 2 + 0.05, height / 2, 0);
    const side2Geom = sideGeom.clone();
    side2Geom.translate(-width / 2 - 0.05, height / 2, 0);

    const side1 = new THREE.Mesh(side1Geom, this.vpt.material);
    const side2 = new THREE.Mesh(side2Geom, this.vpt.material);

    this.element.add(side1);
    this.element.add(side2);

    const shelfGeom = new THREE.BoxGeometry(3, 0.1, depth);
    shelfGeom.translate(0, 0.05, 0);

    for (let i = 0; i < 6; i++) {
      const shelf = new THREE.Mesh(shelfGeom, this.vpt.material);
      shelf.translateY((height / 5) * i);
      shelf.name = "shelf" + i;
      if (i === 5) shelf.translateY(-0.1);

      this.element.add(shelf);
    }
  }

  private AddBookStacks() {
    const bookStack1 = new BookStack(this.vpt, 15);
    bookStack1.element.rotateY(Math.PI);
    bookStack1.element.rotateZ(Math.PI / 2);
    bookStack1.element.position.add(
      new THREE.Vector3(
        -bookStack1.height + this.width / 2,
        bookStack1.width / 2 + 0.1 + (this.height * 2) / 5,
        0
      )
    );
    bookStack1.SetColor([0x00ff00]);

    this.element.add(bookStack1.element);

    const book1 = new Book(this.vpt);
    book1.element.rotateY(Math.PI);
    book1.element.rotateZ((105 * Math.PI) / 180);
    book1.element.position.add(
      new THREE.Vector3(
        -book1.height / 2 + this.width / 2 - bookStack1.height - 0.128,
        book1.width / 2 - book1.height / 2 + 0.1 + (this.height * 2) / 5,
        0
      )
    );
    book1.SetColor(0x00ff00);

    this.element.add(book1.element);

    const bookStack2 = new BookStack(this.vpt, 15);
    bookStack2.element.rotateY(Math.PI);
    bookStack2.element.rotateZ(Math.PI / 2);
    bookStack2.element.position.add(
      new THREE.Vector3(
        -this.width / 2,
        bookStack2.width / 2 + 0.1 + (this.height * 1) / 5,
        0
      )
    );
    bookStack2.SetColor([0x00ff00]);

    this.element.add(bookStack2.element);

    const book2 = new Book(this.vpt);
    book2.element.rotateY(Math.PI);
    book2.element.rotateZ((75 * Math.PI) / 180);
    book2.element.position.add(
      new THREE.Vector3(
        -book2.height / 2 - this.width / 2 + bookStack2.height + 0.27,
        book2.width / 2 - book2.height / 2 + 0.1 + (this.height * 1) / 5,
        0
      )
    );
    book2.SetColor(0x00ff00);

    this.element.add(book2.element);
  }

  private AddHat() {
    const hatGroup = new THREE.Group();
    hatGroup.name = "hat";

    const hat = new Hat(this.vpt);
    hat.element.rotateY((20 * Math.PI) / 180);
    hat.element.position.set(-0.9, (this.height * 3) / 5 + 0.1, 0);
    hatGroup.add(hat.element);

    const bBox = new THREE.Box3().setFromObject(hat.element);
    const bBoxGeom = new THREE.BoxGeometry(
      bBox.max.x - bBox.min.x,
      bBox.max.y - bBox.min.y,
      bBox.max.z - bBox.min.z
    );
    const bBoxMesh = new THREE.Mesh(
      bBoxGeom,
      new THREE.MeshBasicMaterial({ visible: false })
    );
    bBoxMesh.position.set(
      (bBox.max.x + bBox.min.x) / 2,
      (bBox.max.y + bBox.min.y) / 2,
      (bBox.max.z + bBox.min.z) / 2
    );

    hatGroup.add(bBoxMesh);

    this.element.add(hatGroup);
  }

  private AddFootball() {
    const footballGroup = new THREE.Group();
    footballGroup.name = "football";

    const football = new Football(this.vpt);
    football.element.position.set(0.3, (this.height * 0) / 5 + 0.1, 0);

    footballGroup.add(football.element);

    this.element.add(footballGroup);
  }

  private AddFrame() {
    const frame1 = new Frame(this.vpt);
    frame1.element.scale.set(1.2, 1.2, 1.2);
    frame1.element.rotateY((10 * Math.PI) / 180);
    frame1.element.position.set(0.25, (this.height * 3) / 5 + 0.1, -0.05);

    this.element.add(frame1.element);

    const frame2 = new Frame(this.vpt);
    frame2.element.rotateY(-(10 * Math.PI) / 180);
    frame2.element.position.set(1, (this.height * 3) / 5 + 0.1, +0.1);

    this.element.add(frame2.element);
  }

  private AddElementsLastShelf() {
    const frame1 = new Frame(this.vpt);
    frame1.element.scale.set(1.2, 1.2, 1.2);
    frame1.element.rotateY((10 * Math.PI) / 180);
    frame1.element.position.set(-1, (this.height * 4) / 5 + 0.1, -0.05);

    this.element.add(frame1.element);

    const bookstack1 = new BookStack(this.vpt, 4);
    bookstack1.element.rotateY(Math.PI);
    bookstack1.element.position.set(0.91, (this.height * 4) / 5 + 0.1, 0);

    this.element.add(bookstack1.element);

    const bookstack2 = new BookStack(this.vpt, 2);
    bookstack2.element.rotateY(Math.PI);
    bookstack2.element.rotateZ(Math.PI / 2);
    bookstack2.element.position.set(
      0.1,
      (this.height * 4) / 5 + 0 + bookstack2.width / 2,
      0
    );

    this.element.add(bookstack2.element);
  }
}

import { Viewport } from "../viewport";
import { Book } from "./book";
import { BookStack } from "./bookshelfItems/bookStack";
import { Hat } from "./bookshelfItems/hat";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";
import { Football } from "./bookshelfItems/football";

export class Bookshelf extends Element3D implements ElementType {
  constructor(vpt: Viewport) {
    super(vpt);

    this.CreateElement();

    this.AddBooksOnLowestShelf();
    this.AddHat();
    this.AddFootball();
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

  private AddBooksOnLowestShelf() {
    const bookStack = new BookStack(this.vpt, 15);
    bookStack.element.rotateY(Math.PI);
    bookStack.element.rotateZ(Math.PI / 2);
    bookStack.element.position.add(
      new THREE.Vector3(
        -bookStack.height + this.width / 2,
        bookStack.width / 2 + 0.1 + (this.height * 2) / 5,
        0
      )
    );
    bookStack.SetColor([0x00ff00]);

    this.element.add(bookStack.element);

    const book = new Book(this.vpt);
    book.element.rotateY(Math.PI);
    book.element.rotateZ((105 * Math.PI) / 180);
    book.element.position.add(
      new THREE.Vector3(
        -book.height / 2 + this.width / 2 - bookStack.height - 0.128,
        book.width / 2 - book.height / 2 + 0.1 + (this.height * 2) / 5,
        0
      )
    );
    book.SetColor(0x00ff00);

    this.element.add(book.element);
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

    const football = new Football(this.vpt);
    football.element.position.set(0.3, (this.height * 0) / 5 + 0.1, 0);

    this.element.add(football.element);
  }
}

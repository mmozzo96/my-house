import { Viewport } from "../viewport";
import { Book } from "./book";
import { BookStack } from "./bookshelfItems/bookStack";
import { Hat } from "./bookshelfItems/hat";
import { Element3D, ElementType } from "./element";
import * as THREE from "three";

export class Bookshelf extends Element3D implements ElementType {
    constructor(vpt: Viewport) {
        super(vpt);
        this.element.name = "bookshelf";

        this.CreateElement();
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
            if (i === 5) shelf.translateY(-0.1);

            this.element.add(shelf);
        }

        this.AddBooksOnLowestShelf();
        this.AddHat();
    }

    private AddBooksOnLowestShelf() {
        const bookStack = new BookStack(this.vpt, 15);
        bookStack.element.rotateY(Math.PI);
        bookStack.element.rotateZ(Math.PI / 2);
        bookStack.element.position.add(
            new THREE.Vector3(
                -bookStack.height + this.width / 2,
                bookStack.width / 2 + 0.1,
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
                book.width / 2 - book.height / 2 + 0.1,
                0
            )
        );
        book.SetColor(0x00ff00);

        this.element.add(book.element);
    }

    private AddHat() {
        const hat = new Hat(this.vpt);
        hat.element.rotateY((20 * Math.PI) / 180);
        hat.element.position.add(
            new THREE.Vector3(-0.9, (this.height * 3) / 5 + 0.1, 0)
        );

        this.element.add(hat.element);
    }
}

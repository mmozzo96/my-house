import { Screen } from "./elements/screen";
import { Desk } from "./elements/desk";
import { Viewport } from "./viewport";
import * as THREE from "three";
import { Keyboard } from "./elements/keyboard";
import { Chair } from "./elements/chair";
import { Book } from "./elements/book";

export class Visualization {
    vpt: Viewport;

    constructor(vpt: Viewport) {
        this.vpt = vpt;
    }

    public AddElements() {
        const assets: THREE.Group[] = [];

        const table = new Desk(this.vpt);

        const screen1 = new Screen(this.vpt);
        screen1.element.rotateY((15 * Math.PI) / 180);
        screen1.element.position.add(
            new THREE.Vector3(-table.width / 10, table.height, -table.depth / 5)
        );

        const screen2 = new Screen(this.vpt);
        screen2.element.rotateY(-(25 * Math.PI) / 180);
        screen2.element.position.add(
            new THREE.Vector3(table.width / 4, table.height, -table.depth / 7)
        );

        const keyboard = new Keyboard(this.vpt);
        keyboard.element.position.add(
            new THREE.Vector3(table.width / 15, table.height, table.depth / 4)
        );

        const chair = new Chair(this.vpt);
        chair.element.rotateY(Math.PI);
        chair.element.position.add(
            new THREE.Vector3(table.width / 15, 0, table.depth / 2)
        );

        const book = new Book(this.vpt);
        book.element.rotateY((70 * Math.PI) / 180);
        book.element.position.add(
            new THREE.Vector3(
                (-2 * table.width) / 6,
                table.height,
                -table.depth / 8
            )
        );

        assets.push(table.element);
        assets.push(screen1.element);
        assets.push(screen2.element);
        assets.push(keyboard.element);
        assets.push(chair.element);
        assets.push(book.element);

        assets.forEach((element) => this.vpt.scene.add(element));
    }
}

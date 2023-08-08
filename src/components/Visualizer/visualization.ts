import { Screen } from "./elements/screen";
import { Desk } from "./elements/desk";
import { Viewport } from "./viewport";
import * as THREE from "three";
import { Keyboard } from "./elements/keyboard";
import { Chair } from "./elements/chair";
import { Book } from "./elements/book";
import { Bookshelf } from "./elements/bookshelf";

export class Visualization {
    vpt: Viewport;
    principalElements!: THREE.Group[];

    constructor(vpt: Viewport) {
        this.vpt = vpt;
        this.principalElements = [];
    }

    public AddElements() {
        const assets: THREE.Group[] = [];

        const deskGroup = new THREE.Group();
        deskGroup.name = "deskGroup";

        const desk = new Desk(this.vpt);
        deskGroup.add(desk.element);

        const screens = new THREE.Group();
        screens.name = "screens";

        const screen1 = new Screen(this.vpt);
        screen1.element.rotateY((15 * Math.PI) / 180);
        screen1.element.position.add(
            new THREE.Vector3(-desk.width / 10, desk.height, -desk.depth / 5)
        );
        // deskGroup.add(screen1.element);
        screens.add(screen1.element);

        const screen2 = new Screen(this.vpt);
        screen2.element.rotateY(-(25 * Math.PI) / 180);
        screen2.element.position.add(
            new THREE.Vector3(desk.width / 5, desk.height, -desk.depth / 7)
        );
        // deskGroup.add(screen2.element);
        screens.add(screen2.element);

        this.principalElements.push(deskGroup);

        deskGroup.add(screens);

        const keyboard = new Keyboard(this.vpt);
        keyboard.element.position.add(
            new THREE.Vector3(desk.width / 20, desk.height, desk.depth / 4)
        );
        deskGroup.add(keyboard.element);

        const chair = new Chair(this.vpt);
        chair.element.rotateY(Math.PI);
        chair.element.position.add(
            new THREE.Vector3(desk.width / 20, 0, desk.depth / 2)
        );
        deskGroup.add(chair.element);

        const book = new Book(this.vpt);
        book.element.rotateY((70 * Math.PI) / 180);
        book.element.position.add(
            new THREE.Vector3(
                (-2 * desk.width) / 6,
                desk.height,
                -desk.depth / 8
            )
        );
        deskGroup.add(book.element);

        deskGroup.rotateY(Math.PI / 2);
        deskGroup.translateX(-desk.width / 2 - 2);
        deskGroup.translateZ(desk.depth / 2);

        const bookshelf = new Bookshelf(this.vpt);
        this.principalElements.push(bookshelf.element);

        bookshelf.element.translateZ(bookshelf.depth / 2);
        bookshelf.element.translateX(desk.depth + 1 + bookshelf.width / 2);

        assets.push(deskGroup);
        assets.push(bookshelf.element);

        assets.forEach((element) => this.vpt.scene.add(element));
    }

    public ShowPrincipalGroups() {
        this.principalElements.forEach((group) => {
            this.vpt.IsIntersecting(group.name)
                ? group.scale.set(1.1, 1.1, 1.1)
                : group.scale.set(1, 1, 1);
        });
    }
}

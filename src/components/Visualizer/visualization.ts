import { Screen } from "./elements/screen";
import { Desk } from "./elements/desk";
import { Viewport } from "./viewport";
import * as THREE from "three";
import { Keyboard } from "./elements/keyboard";
import { Chair } from "./elements/chair";
import { Book } from "./elements/book";
import { Bookshelf } from "./elements/bookshelf";
import { ObjectSpaceNormalMap } from "three";
import { group } from "console";

type PopUpDown = "pop-up" | "downsize";

export class Visualization {
  vpt: Viewport;
  principalElements!: { [PrincipalGroupName: string]: THREE.Group };

  constructor(vpt: Viewport) {
    this.vpt = vpt;
    this.principalElements = {};
  }

  public AddElements() {
    const assets: THREE.Group[] = [];

    const desk = new Desk(this.vpt);
    this.principalElements.desk = desk.element;

    desk.element.rotateY(Math.PI / 2);
    desk.element.translateX(-desk.width / 2 - 2);
    desk.element.translateZ(desk.depth / 2);

    const bookshelf = new Bookshelf(this.vpt);
    this.principalElements.bookshelf = bookshelf.element;

    bookshelf.element.translateZ(bookshelf.depth / 2);
    bookshelf.element.translateX(desk.depth + 1 + bookshelf.width / 2);

    assets.push(desk.element);
    assets.push(bookshelf.element);

    assets.forEach((element) => this.vpt.scene.add(element));
  }

  public PopUp() {
    let group: THREE.Group = new THREE.Group();

    this.vpt
      .FirstIntersection()
      ?.traverseAncestors((obj) =>
        obj.name && obj.type === "Group" ? (group = obj as THREE.Group) : null
      );

    switch (group.name) {
      case "screens":
        this.PopUpScreens(group, "pop-up");
        break;
      default:
        this.PopDown();
        break;
    }
  }

  private PopDown() {
    this.vpt.scene.traverse((obj) => {
      switch (obj.name) {
        case "screens":
          this.PopUpScreens(obj as THREE.Group, "downsize");
          break;
      }
    });
  }

  private PopUpScreens(group: THREE.Group, action: PopUpDown) {
    if (action === "pop-up") group.scale.set(1.1, 1.1, 1.1);
    else group.scale.set(1, 1, 1);
  }
}

import { Viewport } from "../../viewport";
import { Book } from "../book";
import { Element3D, ElementType } from "../element";
import * as THREE from "three";

export class BookStack extends Element3D implements ElementType {
    books!: Book[];
    bookNumber!: number;
    constructor(vpt: Viewport, bookNumber: number) {
        super(vpt);
        this.books = [];
        this.bookNumber = bookNumber;
        this.CreateElement();
    }

    public CreateElement() {
        for (let i = 0; i < this.bookNumber; i++) {
            const book = new Book(this.vpt);
            const element = book.element;
            element.position.add(new THREE.Vector3(0, book.height * i, 0));
            this.element.add(element);
            this.books.push(book);

            this.width = book.width;
            this.height = book.height * this.bookNumber;
            this.depth = book.depth;
        }
    }

    public SetColor(colors: THREE.ColorRepresentation[]) {
        if (colors.length < this.bookNumber) {
            const rep = Math.ceil(this.bookNumber / colors.length);
            const complete: THREE.ColorRepresentation[] = [];
            for (let i = 0; i < rep; i++) {
                complete.push(...colors);
            }
            colors = complete.slice(0, this.bookNumber);
        }

        this.books.forEach((book, idx) =>
            book.SetColor(colors[idx] ?? 0xffffff)
        );
    }
}

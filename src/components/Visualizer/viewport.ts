import * as THREE from "three";
import { AmbientLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class Viewport {
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;
    control!: OrbitControls;
    material = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 0.9,
        roughness: 0.1,
        opacity: 1,
        transparent: true,
        transmission: 0,
        reflectivity: 1,
    });
    /* material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 1,
    transparent: true,
  }); */
    raycaster!: THREE.Raycaster;
    pointer!: THREE.Vector2;

    constructor(element: HTMLDivElement) {
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0x888888);
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);

        this.scene.add(new THREE.AxesHelper(5));
        this.scene.add(new AmbientLight());
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(100, 1000, 100);

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        this.scene.add(spotLight);

        element.appendChild(this.renderer.domElement);

        this.control = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(10, 10, 10);
        this.control.update();

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.Animate();
    }

    public setSize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.domElement.width = width;
        this.renderer.domElement.height = height;
    }

    private Animate() {
        requestAnimationFrame(() => {
            this.Animate();
        });
        this.renderer.render(this.scene, this.camera);
        this.control.update();

        this.raycaster.setFromCamera(this.pointer, this.camera);
    }

    public OnPointerMove(e: PointerEvent) {
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    public IsIntersecting(groupName: string) {
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        let isInGroup = false;

        if (intersects.length !== 0) {
            intersects[0].object.traverseAncestors(
                (o) => (isInGroup = isInGroup || o.name === groupName)
            );
        }

        return isInGroup;
    }
}

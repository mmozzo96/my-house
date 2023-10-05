import * as THREE from "three";
import { AmbientLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

const stats = new Stats();
document.body.appendChild(stats.dom);

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
  raycaster!: THREE.Raycaster;
  pointer!: THREE.Vector2;

  constructor(element: HTMLDivElement) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8be891);
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene.add(new THREE.AxesHelper(5));
    this.scene.add(new AmbientLight(0xffffff, 1));
    const spotLight = new THREE.DirectionalLight(0xffffff, 6);
    spotLight.position.set(10, 100, 10);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 500;

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

    stats.update();
  }

  public OnPointerMove(e: PointerEvent) {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  public FirstIntersection(): THREE.Object3D | undefined {
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length !== 0) {
      return intersects[0].object;
    }

    return undefined;
  }
}

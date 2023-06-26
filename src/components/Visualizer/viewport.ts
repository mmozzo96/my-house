import * as THREE from "three";

export class Viewport {
  scene!: THREE.Scene;
  camera!: THREE.Camera;
  renderer!: THREE.WebGLRenderer;

  constructor(element: HTMLDivElement) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    this.scene.add(new THREE.AxesHelper(5));

    // document.body.appendChild(this.renderer.domElement);
    element.appendChild(this.renderer.domElement);

    this.Animate();
  }

  public CreateCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.camera.position.z = 5;
  }

  private Animate() {
    requestAnimationFrame(() => {
      this.Animate();
    });
    this.renderer.render(this.scene, this.camera);
  }
}

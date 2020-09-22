import * as THREE from 'three/build/three.module';
import ScrollFade from './scrollFade';
// import MobileNav from './mobileNav';
import StartAnime from './startAnime';
import { uA } from './helpers';
import { Scene } from './scene/scene.js';

export default class App {

  setup() {
    this.breakPoint = 1024;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  createScene() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(new THREE.Color(0x000000), 0.0);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.wrapper = document.getElementById('WebGL-output').appendChild(this.renderer.domElement);
  }

  draw() {
    this._scene.update();
  }

  init() {
    this.setup();
    this.addEvent();
    if (uA.isValid()) {
      this.startThreejs(new Scene());
    }
    this.setDomUI();
  }

  startThreejs(sceneInstance) {
    this.frame = 0;
    this._scene = sceneInstance;
    this.createScene();
    this.animate();
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
    // window.addEventListener('keyup', this.onKeyEvent.bind(this));
  }

  addEvent() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    this.scrollFade.scrollFadeIn();
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.domElement.setAttribute('width', String(this.width));
    this.renderer.domElement.setAttribute('height', String(this.height));

    this.renderer.setPixelRatio(window.devicePixelRatio || 1.0);
    this.renderer.setSize(this.width, this.height);
    this._scene.camera.aspect = this.width / this.height;
    this._scene.camera.updateProjectionMatrix();
  }

  animate() {
    this.draw();
    this.renderer.autoClear = true;
    this.renderer.render(this._scene, this._scene.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  setDomUI() {
    this.startAnime = new StartAnime();
    this.startAnime.init();
    this.scrollFade = new ScrollFade(this.width, this.height);
    this.scrollFade.init();
  }

}

import * as THREE from '../../libs/three.module.js';

export default class Camera extends THREE.PerspectiveCamera{
  constructor() {
    super(90, window.innerWidth / window.innerHeight, 1, 1000);
    this.camPos = new THREE.Vector3(0, 20, 150);
    this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);
  }
}
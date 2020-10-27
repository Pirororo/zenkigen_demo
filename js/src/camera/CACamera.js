// import * as THREE from '../../libs/three.module.js';

export default class Camera extends THREE.PerspectiveCamera{
    /**
     * コンストラクターです。
     * @constructor
     */
    constructor() {
  
      
      // super(45, window.innerWidth / window.innerHeight, 10, 500);
      super(90, window.innerWidth / window.innerHeight, 1, 1000);//fov広い方が遠近感出る
  
      // this._easing = this._easing.bind(this);
  
      this.camPos = new THREE.Vector3(0, 20, 150);
      // this.camPos = new THREE.Vector3(-14, -16, 443);//真後ろひき
      // this.camPos = new THREE.Vector3(88, -123, 467);//右後方ひき
      // this.camPos = new THREE.Vector3(-184, -84, 39);//左横ひき
      // this.camPos = new THREE.Vector3(11, -78, 86);//下アップ
      // this.camPos = new THREE.Vector3(37, -78, 16);//上アップ
  
      this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);
  
  
      this.frame =0;
  
      this.camPos = new THREE.Vector3(-14, 16, 443);
      this.camTarget = new THREE.Vector3(-88, 123, 467);
  
    }
  
  
  
    /**
     * 毎フレームの更新をかけます。
     */
    update(currentPoint, centerPoint) {
  
  
      this.frame += 1;
  
      // // 原点に注目
      // // this.lookAt(new THREE.Vector3(-50, -50, 0));//これ大事！！！！
      // this.lookAt(railCenterPoint);//これ大事！！！！
  
      this.lookAt(new THREE.Vector3(
        0,
        0,
        centerPoint.z
      ));//これ大事！！！！
  
      if(this.frame == 1){
  
        this.camTarget = new THREE.Vector3(
          // (2*Math.random()-1)*100,
          // (Math.random())*100,
          // Maf.randomInRange( 400, 700)
          0,
          300,
          centerPoint.z-0 
        );
  
        this.camPos = new THREE.Vector3(this.position.x, this.position.y-100, this.position.z);
        // this.camPos = currentPoint;
        console.log(currentPoint.x);
      }
  
      this.camPos.x += (this.camTarget.x - this.camPos.x)*0.02;
      this.camPos.y += (this.camTarget.y - this.camPos.y)*0.02;
      this.camPos.z += (this.camTarget.z - this.camPos.z)*0.02;
  
      this.position.set(this.camPos.x,this.camPos.y,this.camPos.z);
  
  
  
    }
  }
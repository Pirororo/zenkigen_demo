// import * as THREE from '../../libs/three.module.js';
// import { convertCSVtoArray2D, loadCSV } from "../utils/AssetsLoader.js";


/**
 *カークラスです。
 */
export default class Ring extends THREE.Object3D {
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    super();

    this.frame = 0;


    // var material = new THREE.LineBasicMaterial({
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent:true,
      opacity:0.5,
      // blending:THREE.AdditiveBlending
    });
    
    this.points = [];
    // this.points.push( new THREE.Vector3( - 100, 0, 0 ) );
    // this.points.push( new THREE.Vector3( 0, 100, 0 ) );
    // this.points.push( new THREE.Vector3( 100, 0, 0 ) );
    // this.geometry = new THREE.BufferGeometry().setFromPoints( this.points );
    // this.geometry = new THREE.Geometry();
    this.geometry = new THREE.PlaneGeometry(150,150,200);
    // this.geometry.setFromPoints(this.points);
    // this.mesh = new THREE.Line( this.geometry, material );
    this.mesh = new THREE.Mesh( this.geometry, material );
    // this.mesh.geometry.verticesNeedUpdate=true;
    // this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.verticesNeedUpdate = true;
    this.add( this.mesh );


    this.noise_seed_list = [];
    this.noise_param_list = [];
    for (let i = 0; i < 6; i++) {
      this.noise_seed_list.push(Math.random(1000));
      this.noise_param_list.push(0);
    }


    this.simplexNoise = new SimplexNoise;


  
  }





    /**
     * フレーム毎の更新をします。
     */
  update() {

    
    for(let i =0; i <this.points.length; i++){
        this.remove(this.points[i]);
    }
    this.points = [];
 
    let radius = 200;
    this.frame += 1;
    // let radius = 50 * Math.sin(this.frame *1 * Math.PI/180) +150;
    // if(this.frame >360){this.frame =0;}
    // console.log(this.frame);

    let span = 28;

    function THREEmap(value, start1, end1, start2, end2) {
      return start2 + (end2 - start2) * ((value - start1) / (end1 - start1));
    }
   
    for (let i = 0; i < this.noise_seed_list.length; i++) {
      for (let deg = 0; deg < 360; deg += 3) {
        let noise_location = new THREE.Vector2(
          radius * Math.cos(deg * Math.PI/180 )+this.frame*0.5, 
          radius * Math.sin(deg * Math.PI/180 )+this.frame*0.5
        )
        // auto noise_location = vec2(radius * cos(deg * DEG_TO_RAD), radius * sin(deg * DEG_TO_RAD));
        let noise_param = THREEmap(this.simplexNoise.noise(this.noise_seed_list[i], noise_location.x * 0.005, noise_location.y * 0.005, this.noise_param_list[i]), 0, 1, 0.5, 1.2);

        // auto noise_param = ofMap(ofNoise(this->noise_seed_list[i], noise_location.x * 0.005, noise_location.y * 0.005, this->noise_param_list[i]), 0, 1, 0.5, 1);

        this.points.push( new THREE.Vector3(
            radius * noise_param * Math.cos(deg * Math.PI/180),
            radius * noise_param * Math.sin(deg * Math.PI/180), 
            0) 
        );


        // this.mesh.geometry(glm::vec3(radius * noise_param * cos(deg * DEG_TO_RAD), radius * noise_param * sin(deg * DEG_TO_RAD), 0));
      }
      this.noise_param_list[i] += 0.002;
    }

    // console.log(this.points.length);//720

    // for(let i =0; i <this.points.length ; i++){
    //   this.mesh.geometry[3*i] = (this.points[i].x);
    //   this.mesh.geometry[3*i+1] = (this.points[i].y);
    //   this.mesh.geometry[3*i+2] = (this.points[i].z);
    // }

    // this.mesh.geometry.verticesNeedUpdate = true;
    // this.mesh.geometry.verticesNeedUpdate=true;
    // this.mesh.geometry.setFromPoints(this.points);
    // this.mesh.geometry.attributes.position.needsUpdate = true;


    // console.log(this.points[100]);
    // for ( let i = 0; i < this.geometry.vertices.length; i++ ) {
      // this.geometry.vertices[ i ] = this.points[i];
      this.geometry.vertices = this.points;
    // }
    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;


   
    for (let i = 0; i < this.points.length; i++) {
      for (let k = i + 1; k < this.points.length; k++) {
    
    // for (let i = 0; i < this->mesh.getNumVertices(); i++) {
    //   for (let k = i + 1; k < this->mesh.getNumVertices(); k++) {
      let distance = this.points[i].distanceTo ( this.points[k]); 
      // let distance = glm::distance(this->mesh.getVertex(i), this->mesh.getVertex(k));
        if (distance < span) {
          let alpha = distance < span * 0.25 ? 255 : THREEmap(distance, span * 0.25, span, 255, 0);
   
          // if (this.mesh.getColor(i).a < alpha) {
   
          //   this.mesh.setColor(i, ofColor(this->mesh.getColor(i), alpha));
          // }
   
          // if (this.mesh.getColor(k).a < alpha) {
   
          //   this.mesh.setColor(k, ofColor(this->mesh.getColor(k), alpha));
          // }
   
          // this.mesh.addIndex(i);
          // this.mesh.addIndex(k);
        }
      }
    }
  
    

  }

  draw(){
    
    // this.mesh.drawWireframe();
  }
}

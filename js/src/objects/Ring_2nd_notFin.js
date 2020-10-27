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
      // transparent:true,
      // opacity:0.5,
      // blending:THREE.AdditiveBlending
    });

    let MAX_POINTS = 720;
    this.newValue = 720;
    // this.newValue = 0;
    
    // this.points = [];
    // this.index = [];
    // this.points.push( new THREE.Vector3( - 100, 0, 0 ) );
    // this.points.push( new THREE.Vector3( 0, 100, 0 ) );
    // this.points.push( new THREE.Vector3( 100, 0, 0 ) );
    // this.geometry = new THREE.Geometry();
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point

    // this.indices = new Uint16Array([
    //   0, 1, 2,//一つ目のポリゴン
    //   2, 3, 0 //二つ目のポリゴン
    // ]);
    // this.indices = new Uint16Array( MAX_POINTS * MAX_POINTS *2);
    // for (let i = 0; i < this.positions.length; i++) {
    //   this.positions.add(0);
    // }
    
    // this.indices = [];
    this.indices = new Uint16Array( 500000);
    // for (let i = 0; i < 10; i++) {
    //   this.indices.push(0);
    // }



    this.geometry.setIndex(new THREE.BufferAttribute(this.indices,1));
    // this.geometry.setIndex( this.indices );
    this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );

    this.geometry.setDrawRange( 0, this.newValue );
    // this.geometry.setDrawRange( 0, this.indices.length );
    // this.geometry.setDrawRange( 0, MAX_POINTS );



    // this.mesh = new THREE.Line( this.geometry,  material );
    this.mesh = new THREE.Mesh( this.geometry, material );
    
 
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

    // for(let i =0; i <this.points.length; i++){
    //     this.remove(this.points[i]);
    // }
    // for(let i =0; i <this.index.length; i++){
    //     this.remove(this.index[i]);
    // }
    // this.points = [];
    // this.index = [];

    let posNum = 0;
    let idxNum = 0;
 
    let radius = 50;
    this.frame += 1;
    // let radius = 50 * Math.sin(this.frame *1 * Math.PI/180) +150;
    // if(this.frame >360){this.frame =0;}
    // console.log(this.frame);

    let span = 6;//28

    function THREEmap(value, start1, end1, start2, end2) {
      return start2 + (end2 - start2) * ((value - start1) / (end1 - start1));
    }
   
    for (let i = 0; i < this.noise_seed_list.length; i++) {
      for (let deg = 0; deg < 360; deg += 3) {
        let noise_location = new THREE.Vector2(
          radius * Math.cos(deg * Math.PI/180 )+this.frame*0.5, 
          radius * Math.sin(deg * Math.PI/180 )+this.frame*0.5
          // radius * Math.cos(deg * Math.PI/180 ), 
          // radius * Math.sin(deg * Math.PI/180 )
        )
        // auto noise_location = vec2(radius * cos(deg * DEG_TO_RAD), radius * sin(deg * DEG_TO_RAD));
        let noise_param = THREEmap(this.simplexNoise.noise(this.noise_seed_list[i], noise_location.x * 0.005, noise_location.y * 0.005, this.noise_param_list[i]), 0, 1, 0.5, 1.2);

        // auto noise_param = ofMap(ofNoise(this->noise_seed_list[i], noise_location.x * 0.005, noise_location.y * 0.005, this->noise_param_list[i]), 0, 1, 0.5, 1);

        // this.points.push( new THREE.Vector3(
        //     radius * noise_param * Math.cos(deg * Math.PI/180),
        //     radius * noise_param * Math.sin(deg * Math.PI/180), 
        //     0) 
        // );

        this.positions[posNum] = radius * noise_param * Math.cos(deg * Math.PI/180);
        posNum +=1;
        this.positions[posNum] = radius * noise_param * Math.sin(deg * Math.PI/180);
        posNum +=1;
        this.positions[posNum] = 0;
        posNum +=1;


        // this.mesh.geometry(glm::vec3(radius * noise_param * cos(deg * DEG_TO_RAD), radius * noise_param * sin(deg * DEG_TO_RAD), 0));
      }
      this.noise_param_list[i] += 0.002;
    }

    // console.log(posNum);//2160

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





    for (let i = 0; i < this.positions.length; i+=3) {
      for (let k = i + 3; k < this.positions.length-1; k+=3) {

    // for (let i = 0; i < this->mesh.getNumVertices(); i++) {
    //   for (let k = i + 1; k < this->mesh.getNumVertices(); k++) {
      let startPoint = new THREE.Vector3(
        this.positions[i+ 0],
        this.positions[i+ 1],
        this.positions[i+ 2]
      );
      let endPoint = new THREE.Vector3(
        this.positions[ k+ 0],
        this.positions[ k+ 1],
        this.positions[ k+ 2]
      );
      let distance = startPoint.distanceTo (endPoint); 
      // let distance = this.points[i].distanceTo ( this.points[k]); 
      // let distance = glm::distance(this->mesh.getVertex(i), this->mesh.getVertex(k));
        if (distance < span) {
          let alpha = distance < span * 0.25 ? 255 : THREEmap(distance, span * 0.25, span, 255, 0);

          // if (this.mesh.getColor(i).a < alpha) {
          //   this.mesh.setColor(i, ofColor(this->mesh.getColor(i), alpha));
          // }

          // if (this.mesh.getColor(k).a < alpha) {
          //   this.mesh.setColor(k, ofColor(this->mesh.getColor(k), alpha));
          // }

          // this.index.push( new THREE.Vector3(i,k,i));
          // this.geometry.faces[i] = new THREE.Face3( i, k, i );

          // console.log(i);
          this.indices[idxNum] = i/3;
          idxNum +=1;
          this.indices[idxNum] = k/3; 
          idxNum +=1;

          // this.indices.array[idxNum] = i;
          // idxNum +=1;
          // this.indices.array[idxNum] = k; 
          // idxNum +=1;

          // this.geometry.index.array[idxNum] = i;
          // idxNum +=1;
          // this.geometry.index.array[idxNum] = k; 
          // idxNum +=1;

          // console.log(this.geometry.index.array[idxNum]);
          // console.log(this.indices[idxNum]);

          // geometry.attributes.position.setXYZ( index, x, y, z );

          // this.mesh.addIndex(i);
          // this.mesh.addIndex(k);
        }
      }
    }

    // console.log(idxNum);
    console.log(this.indices[idxNum]);//0とかunidetyになる
    this.newValue = idxNum;
    // this.geometry.vertices = this.points;
    // this.geometry.verticesNeedUpdate = true;
    // // this.geometry.faces.push( new THREE.Face3( i, k, i ) );//麺じゃないからなぁ
    // this.geometry.faces = this.index;
    // this.geometry.elementsNeedUpdate = true;




    this.geometry.index.needsUpdate = true; //ここはsetIndex(new THREE.BufferAttribute(this.indices,1)だときいてる
    // this.geometry.setIndex( this.indices );
    this.geometry.attributes.position.needsUpdate = true;
    // this.geometry.attributes.normal.needsUpdate = true;

    // this.geometry.computeVertexNormals();

    this.geometry.setDrawRange( 0, this.newValue );//これ必要
  }

  draw(){
    // this.mesh.drawWireframe();
  }
}

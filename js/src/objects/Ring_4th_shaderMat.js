// import * as THREE from '../../libs/three.module.js';
// import { convertCSVtoArray2D, loadCSV } from "../utils/AssetsLoader.js";

export default class Ring extends THREE.Object3D {
  
  constructor() {
    super();
    // var material = new THREE.MeshBasicMaterial({
    //   // color: 0xffffff,
    //   vertexColors: THREE.VertexColors,//これをかくとrgb送れる！ただしアルファは送れない。。。
    //   wireframe: true,
    //   transparent:true,
    //   opacity:0.6,
    //   // blending:THREE.AdditiveBlending
    // });

    var material = new THREE.ShaderMaterial({
      wireframe: true,//gl_Linesになる！
      // wireframeLinewidth: 0.1,
      transparent:true,//これ、gl_FragColorのアルファ設定に必要！！！！！！！！！！！１
      // vertexColors: THREE.VertexColors,//これは送れない。。。
      defaultAttributeValues:{
        'alpha': this.alphas
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });

    let MAX_POINTS = 360;
    this.newValue = MAX_POINTS;//DrawRangeに使う

    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array( MAX_POINTS * 3 ); 
    this.alphas = new Float32Array( MAX_POINTS * 1); //ここ4つにしても遅れるのは3つだけ。。。
    this.indices = new Uint16Array( MAX_POINTS * MAX_POINTS);
    this.geometry.setIndex(new THREE.BufferAttribute(this.indices,1));
    this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
    this.geometry.setAttribute( 'alpha', new THREE.BufferAttribute( this.alphas, 1) );
    this.geometry.setDrawRange( 0, this.newValue );//このthis.newValueを更新させていく

    this.mesh = new THREE.Mesh( this.geometry, material );
    this.add( this.mesh );

    this.noise_seed_list = [];
    this.noise_param_list = [];
    for (let i = 0; i < 3; i++) {
      this.noise_seed_list.push(Math.random(1000));
      this.noise_param_list.push(0);
    }

    this.simplexNoise = new SimplexNoise;
  }


  update() {
    let posNum = 0;//this.positionsの数、毎回0から更新していく →数は普遍
    let idxNum = 0;//this.indicesの数、毎回0から更新していく   →距離によって毎回数はかわる。
    let radius = 150;
    // console.log(this.frame);
    let span = 16;//28

    for (let i = 0; i < this.alphas.length; i++) {
      this.alphas[i] = 1.0;
    }

    function THREEmap(value, start1, end1, start2, end2) {
      return start2 + (end2 - start2) * ((value - start1) / (end1 - start1));
    }
   
    for (let i = 0; i < this.noise_seed_list.length; i++) {
      for (let deg = 0; deg < 360; deg += 3) {

        let noise_location = new THREE.Vector2(
          radius * Math.cos(deg * Math.PI/180), 
          radius * Math.sin(deg * Math.PI/180)
        )
        let noise_param = THREEmap(this.simplexNoise.noise4d(
          this.noise_seed_list[i], 
          noise_location.x * 0.005, 
          noise_location.y * 0.005, 
          this.noise_param_list[i]), 0, 1, 0.7, 1.0);

        this.positions[posNum] = radius * noise_param * Math.cos(deg * Math.PI/180);
        posNum +=1;
        this.positions[posNum] = radius * noise_param * Math.sin(deg * Math.PI/180);
        posNum +=1;
        this.positions[posNum] = 0;
        posNum +=1;

      }
      this.noise_param_list[i] += 0.005;
    }

    for (let i = 0; i < this.positions.length-3; i+=3) {
      for (let k = i + 3; k < this.positions.length; k+=3) {
        // for (let i = 0; i < 360*3 -3; i+=3) {
        //   for (let k = i + 3; k < 360*3; k+=3) {

        let startPoint = new THREE.Vector3(
          this.positions[i+ 0],
          this.positions[i+ 1],
          this.positions[i+ 2]
        );
        let endPoint = new THREE.Vector3(
          this.positions[k+ 0],
          this.positions[k+ 1],
          this.positions[k+ 2]
        );
        let distance = startPoint.distanceTo (endPoint); 
        if (distance < span && distance >0) {
          let alpha = distance < span * 0.25 ? 255 : THREEmap(distance, span * 0.25, span, 255, -50)/50;

          this.alphas[i] = alpha;
          // this.alphas[k] = alpha;

          this.geometry.index.array[idxNum] = i/3;
          idxNum +=1;
          this.geometry.index.array[idxNum] = k/3; 
          idxNum +=1;
        }
      }
    }

    this.geometry.index.needsUpdate = true; //indexはTHREE.Bufferattributeの必要あり
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.alpha.needsUpdate = true;

    //draw
    this.newValue = idxNum-1;
    this.geometry.setDrawRange( 0, this.newValue );//毎回設定し直す必要あり
  }
}

const vertex= `
  attribute float alpha;
  varying float vAlpha;
  void main(){
      vAlpha = alpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      // gl_Position = vec4( position, 1.0 );
  }
`;

const fragment = `
  varying float vAlpha;
  void main(){
      gl_FragColor = vec4( vec3(1.0), vAlpha*0.5);
      // gl_FragColor = vec4( vec3(0.2), 0.02 );
  }
`;

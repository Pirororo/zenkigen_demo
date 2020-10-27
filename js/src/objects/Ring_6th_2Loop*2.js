//https://threejs.org/examples/#webgl_rtt
//Three.jsの公式のshaderMaterialに色々サンプルあるよ

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
    this.radius = 130*2;
    this.span = 16*1;//28

    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array( MAX_POINTS * 3 ); 
    this.alphas = new Float32Array( MAX_POINTS * 1); //ここ4つにしても遅れるのは3つだけ。。。
    this.indices = new Uint16Array( MAX_POINTS * MAX_POINTS);
    this.geometry.setIndex(new THREE.BufferAttribute(this.indices,1));
    this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
    this.geometry.setAttribute( 'alpha', new THREE.BufferAttribute( this.alphas, 1) );
    this.geometry.setDrawRange( 0, this.newValue );//このthis.newValueを更新させていく

    this.mesh = new THREE.Mesh( this.geometry, material );
    this.mesh2 = new THREE.Mesh( this.geometry, material );
    this.mesh3 = new THREE.Mesh( this.geometry, material );
    // this.add( this.mesh );
    this.meshList = new THREE.Group();
    this.meshList.add(this.mesh);
    this.mesh2.rotateZ(120);
    this.meshList.add(this.mesh2);
    this.mesh3.rotateZ(240);
    this.meshList.add(this.mesh3);
    this.add(this.meshList);

    this.noise_seed_list = [];
    this.noise_param_list = [];
    for (let i = 0; i < 2; i++) {
      // this.noise_seed_list.push(Math.random(1000));
      this.noise_seed_list.push(300*i);
      this.noise_param_list.push(0);
    }
    this.simplexNoise = new SimplexNoise;



    // //meshリング
    // this.frame = 0;
    // this.planeGeometry = new THREE.PlaneGeometry(800, 100, 360, 1);
    // this.planeMesh = new THREE.Mesh(
    //     this.planeGeometry,
    //     new THREE.MeshBasicMaterial({
    //     // new THREE.MeshPhongMaterial({
    //         color: 0xffffff,
    //         side: THREE.DoubleSide,
    //         wireframe: true
    //     })
    // );
    // // for ( let i = 0; i < this.planeGeometry.vertices.length; i++ ) {
    // //     var planeVertex = this.planeGeometry.vertices[ i ];
    // //     planeVertex.z = 20 *Math.sin( (i%(16+1)) *30*Math.PI/180)+5*this.simplexNoise.noise( planeVertex.x / 10, planeVertex.y / 10 );
    // // }
    // // console.log(this.geometry.vertices);//4425
    // this.planeMesh.position.set(0,0,0);
    // // this.planeMesh.receiveShadow = true;
    // this.add(this.planeMesh);

  }


  update() {
    let posNum = 0;//this.positionsの数、毎回0から更新していく →数は普遍
    let idxNum = 0;//this.indicesの数、毎回0から更新していく   →距離によって毎回数はかわる。

    for (let i = 0; i < this.alphas.length; i++) {
      this.alphas[i] = 1.0;
    }

    function THREEmap(value, start1, end1, start2, end2) {
      return start2 + (end2 - start2) * ((value - start1) / (end1 - start1));
    }
   
    for (let i = 0; i < this.noise_seed_list.length; i++) {
      for (let deg = 0; deg < 360; deg += 3) {

        let noise_location = new THREE.Vector2(
          this.radius * Math.cos(deg * Math.PI/180), 
          this.radius * Math.sin(deg * Math.PI/180)
        )
        let noise_param = THREEmap(this.simplexNoise.noise4d(
          this.noise_seed_list[i], 
          noise_location.x * 0.005, 
          noise_location.y * 0.005, 
          this.noise_param_list[i]), 0, 1, 0.7, 0.8);

        this.positions[posNum] = this.radius * noise_param * Math.cos(deg * Math.PI/180);
        posNum +=1;
        this.positions[posNum] = this.radius * noise_param * Math.sin(deg * Math.PI/180);
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
        if (distance < this.span && distance >0) {
          let alpha = distance < this.span * 0.25 ? 255 : THREEmap(distance, this.span * 0.25, this.span, 0.8, 0);

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



    // //meshリング
    // this.frame += 0.01;
    // if(this.frame > 130){this.frame = 0;} 
    // // let tau = 360/ (this.planeGeometry.vertices.length-100);
    // let tau = 360/ 360;
    // for ( let i = 0; i < this.planeGeometry.vertices.length; i++ ) {
    //     var planeVertex = this.planeGeometry.vertices[ i ];
    //     planeVertex.x = 
    //       20 *Math.sin((i*tau +(this.frame*0.1))*5 *Math.PI/180)
    //       + (10 *this.simplexNoise.noise( planeVertex.x / 5, planeVertex.y / 5 )*0.2)
    //       + (150 *Math.sin((i*tau)*Math.PI/180));
    //     planeVertex.y = 
    //       20 *Math.cos((i*tau +(this.frame*0.1))*5 *Math.PI/180)
    //       + (10*this.simplexNoise.noise( planeVertex.x / 5, planeVertex.y / 5 )*0.2)
    //       + (150 *Math.cos((i*tau)*Math.PI/180));
    // }
    // this.planeGeometry.verticesNeedUpdate = true;
    // // this.planeMesh.geometry.attributes.position.needsUpdate = true;
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
      gl_FragColor = vec4( vec3(0.5), vAlpha*0.5);
      // gl_FragColor = vec4( vec3(0.2), 0.02 );
  }
`;

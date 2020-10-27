// import * as THREE from '../../libs/three.module.js';
// import { convertCSVtoArray2D, loadCSV } from "../utils/AssetsLoader.js";


export default class Ring extends THREE.Object3D {
  
  constructor() {

    super();

    var material = new THREE.MeshBasicMaterial({
      // color: 0xffffff,
      vertexColors: THREE.VertexColors,//これをかくとrgb送れる！ただしアルファは送れない。。。
      wireframe: true,
      transparent:true,
      opacity:0.6,
      // blending:THREE.AdditiveBlending
    });

    let MAX_POINTS = 360;
    this.newValue = MAX_POINTS;//DrawRangeに使う

    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array( MAX_POINTS * 3 ); 
    this.colors = new Float32Array( MAX_POINTS * 3 ); //ここ4つにしても遅れるのは3つだけ。。。

    ////bufferArrayの書き方//可変長ではない、のでremoveもできない
    this.indices = new Uint16Array( MAX_POINTS * MAX_POINTS);
    // this.indices = new Uint16Array([
    //   0, 1, 2,//一つ目のポリゴン
    //   2, 3, 0 //二つ目のポリゴン
    // ]);
    // this.indices = new Int16Array( MAX_POINTS*10);
    // for (let k = 0; k < 10; k++) {
    //   for (let i = 0; i < MAX_POINTS; i++) {
    //     this.indices[MAX_POINTS *k + i] = i;
    //   }
    // }

    ////普通のArrayの書き方//可変長できる！
    // this.indices = [];
    // for (let i = 0; i < 360; i++) {
    //   this.indices.push(i);//頂点にひとつめから順番につけたので頂点の数まで。
    // }

    ////bufferArrayつかう書き方。index.needsUpdateのindexはTHREE.BufferAttributeではないとだめ
    this.geometry.setIndex(new THREE.BufferAttribute(this.indices,1));
    // this.geometry.setIndex(new THREE.Uint16BufferAttribute(this.indices,1));
    ////普通のArrayの書き方。index.needsUpdate効かない。
    // this.geometry.setIndex( this.indices );

    this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
    this.geometry.setAttribute( 'color', new THREE.BufferAttribute( this.colors, 3) );
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

    // console.log(this.noise_param_list[0]);//
    // console.log(posNum);//2160//1080(360)
    // console.log(this.positions.length);//1080(360)

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
          let alpha = distance < span * 0.25 ? 255 : THREEmap(distance, span * 0.25, span, 255, 0)/50;
          // let alpha = THREEmap(distance, 15, 20, 0, 1);
          // let alpha = distance;

          // if (this.geometry.getColor(i).a < alpha) {
          //   this->mesh.setColor(i, ofColor(this->mesh.getColor(i), alpha));
          // }
          // if (this->mesh.getColor(k).a < alpha) {
          //   this->mesh.setColor(k, ofColor(this->mesh.getColor(k), alpha));
          // }

          // if (this.colors[i/3*4 +3] < alpha) {
            this.colors[i+0] = alpha;
            this.colors[i+1] = alpha;
            this.colors[i+2] = alpha;
          // }
          // if (this.colors[k/3*4 +3] < alpha) {
            this.colors[k+0] = alpha;
            this.colors[k+1] = alpha;
            this.colors[k+2] = alpha;
          // }
          // if (this->mesh.getColor(k).a < alpha) {
          //   this->mesh.setColor(k, ofColor(this->mesh.getColor(k), alpha));
          // }

          // //こっちでもいける
          // this.indices[idxNum] = i/3;//ここ ただのi になってた、、、、（涙）
          // idxNum +=1;
          // this.indices[idxNum] = k/3; 
          // idxNum +=1;

          // //エラーないが描画されない。
          // this.geometry.index[idxNum] = i/3;
          // idxNum +=1;
          // this.geometry.index[idxNum] = k/3; 
          // idxNum +=1;

          // //直接indexをかき換える
          this.geometry.index.array[idxNum] = i/3;
          idxNum +=1;
          this.geometry.index.array[idxNum] = k/3; 
          idxNum +=1;
        }
      }
    }

    // console.log(idxNum-1);
    // console.log(this.geometry.index.array[idxNum-1]);//359(360)noidentifyはUint16Arrayの数が不足していると起こる。
    // console.log(this.colors[0]);//0
    // console.log(this.colors[1]);//0
    // console.log(this.colors[2]);//0
    // console.log(this.colors[3]);//255

    this.geometry.index.needsUpdate = true; //indexはTHREE.Bufferattributeの必要あり
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    // this.geometry.setIndex( this.indices );//配列をsetし直すことはできない。上記のように中身をひとつずつ書き換える必要あり


    //draw
    this.newValue = idxNum-1;
    this.geometry.setDrawRange( 0, this.newValue );//毎回設定し直す必要あり
  }

}

import * as THREE from '../../../libs/three.module.js';
import {RoomN1,RoomN2} from './eachRoom/roomN1.js';

/**
 *　レールクラスです。
 */
export default class RoomBasic extends THREE.Object3D {


    // /**
    //  * コンストラクターです。
    //  * @constructor
    //  */
    constructor() {
      super();

        const floorsize = 40;
        const geometry = new THREE.BoxBufferGeometry(floorsize, 0.2, floorsize);
        // const material = new THREE.MeshPhongMaterial({ color: 0x0fffff,opacity:0.5 });

        this.meshList = [];
        const xMax = 7;
        // const zMax = 4;
        let k = 0;

        for (let i = 0; i < xMax; i++) {
            // for (let j = 0; j < zMax; j++) {

                // const geometry = new THREE.BoxBufferGeometry(floorsize, 1, floorsize);
                const material = new THREE.MeshPhongMaterial({ 
                    color: 0xff00ff, 
                    opacity: 0.5,
                    transparent: true
                 });


                ////もとのやつ//////////////////////////////////

                // const floorPos = floorsize +5;
                // const mesh = new THREE.Mesh(geometry, material);
                // mesh.position.x = floorPos *i - ((floorPos*xMax)/2);
                // mesh.position.y = 0;
                // mesh.position.z = floorPos* j - ((floorPos*zMax)/2);
                // // mesh.rotation.x = Math.random() * 2 * Math.PI;
                // // this._scene.add(mesh);//app.jsにいたため、下の行に書き換え
                // this.add(mesh);

                // // 配列に保存
                // this.meshList.push(mesh);



                ////ok/////////////////////////////////

                this.roomList = [ 
                    new RoomN1(), new RoomN2(), new RoomN1(), new RoomN1(),
                    new RoomN1(), new RoomN1(), new RoomN1()
                ];


                // // this.roomList[k] = new RoomN1();
                // // this.meshList[k]= roomN1.maru;//roomN1.maruはmesh

                // this.box = new THREE.Mesh(geometry, material);
                // this.meshList[k]= this.box;////////////////////
                // this.meshList[k].add(this.roomList[k].maru);//roomN1.maruはmesh

                // const floorPos = floorsize +5;
                // this.meshList[k].position.x = floorPos *i - ((floorPos*(xMax-1))/2);
                // this.meshList[k].position.y = 0;
                // this.meshList[k].position.z = floorPos* j - ((floorPos*(zMax-1))/2);

                // this.add(this.meshList[k]);

                // k++;//だいじ


                ////ok/////////////////////////////////
                //this.meshの１つ下の階層にthis.roomList[k].maruがくる→this.boxもthis.roomList[k].maruもmeshListには入るが、raycasterでmeshとしてよびだされるのはthis.boxのみ


                this.mesh = new THREE.Mesh();
                this.box = new THREE.Mesh(geometry, material);
                // this.mesh.add(this.box);
                this.mesh = this.box;//this.meshとthis.boxは同等になる
                this.mesh.add(this.roomList[k].maru);

                // const floorPos = floorsize +5;

                this.mesh.position.x = 40 * Math.sin(50*i*Math.PI/180);
                this.mesh.position.y = i*15 -(xMax*15/2);
                this.mesh.position.z = 40 * Math.cos(50*i*Math.PI/180);
                this.add(this.mesh);

                // 配列に保存
                this.meshList.push(this.mesh);

                k++;


                ////だめ/////////////////////////////////
                //meshListには入るが、raycasterで認識されない


                // const mesh = new THREE.Mesh(new THREE.Mesh(geometry, material));
                
                // mesh.add(box);
                // mesh.add(this.roomList[k].maru);

                // const floorPos = floorsize +5;
                
                // mesh.position.x = floorPos *i - ((floorPos*(xMax-1))/2);
                // mesh.position.y = 0;
                // mesh.position.z = floorPos* j - ((floorPos*(zMax-1))/2);
                // this.add(mesh);

                // // 配列に保存
                // this.meshList.push(mesh);

                // k++;
                

            // }
        }
    }
  
    /**
     * フレーム毎の更新をします。
     */
    update() {}

  }
  
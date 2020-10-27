// import * as THREE from '../../libs/three.module.js';
// import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';
import {Camera} from '../camera/camera.js';
import Rail from '../objects/rail_List2.js';
import Wall from '../objects/Wall.js';

/**
 * シーンクラス：カメラとライト
 */
export class Scene extends THREE.Scene {

    constructor(){

        super();

        this.camera = new Camera();

        this.scene2 = new Scene2();
        this.add(this.scene2);

        this.scene = 0;

    }

    update(){

        this.currentPoint = new THREE.Vector3(
            this.scene2._rail.mesh.geo[3*5+0],
            this.scene2._rail.mesh.geo[3*5+1]+10,
            this.scene2._rail.mesh.geo[3*5+2]
        );


        if(this.scene == 0){
            this.nextPoint = new THREE.Vector3(
                this.scene2._rail.mesh.geo[3*15+0],
                this.scene2._rail.mesh.geo[3*15+1]+10,
                this.scene2._rail.mesh.geo[3*15+2]
            );

            this.camera.position.copy(this.currentPoint);
            this.camera.lookAt(this.nextPoint);

            if(this.camera.frame != 0){this.camera.frame = 0;}//this.scene == 1用
        }

        if(this.scene == 1){
            this.centerPoint = new THREE.Vector3(
                this.scene2._rail.mesh.geo[3*200+0],
                this.scene2._rail.mesh.geo[3*200+1],
                this.scene2._rail.mesh.geo[3*200+2]
            );
            
            this.camera.update(this.currentPoint, this.centerPoint);//lookAtで中心みてる
        }


        // this.scene1.update();
        this.scene2.update();
    }

}

export class Scene1 extends THREE.Scene {

    constructor(){

        super();
    }
    
    update(){
    }

}

export class Scene2 extends THREE.Scene {

    constructor(){

        super();

        //レール
        // this._rail = [];
        // this._railNum = 1;

        // for(let i = 0; i< this._railNum; i++){
        //     this._rail[i] = new Rail();
        //     // this._rail[i].position.set(Maf.randomInRange(-50, 50),0,-300);
        //     if(i ==0 ){
        //         this._rail[i].position.set(0,0,0);
        //     }else {
        //         this._rail[i].position.set(
        //             Maf.randomInRange(-20, 20),
        //             Maf.randomInRange(-10, 3),
        //             Maf.randomInRange(-10, 10),
        //         );
        //     }
        //     this._rail[i].visible = false;
        //     this.add(this._rail[i]);
        // }
        this._rail = new Rail();
        this.add(this._rail);

        // //壁
        // this._wall = new Wall();
        // this._wall.position.set(0,0,-500);
        // this.add(this._wall);

    }

    update(){
        // if(this._wall.visible == false){
        //     this.visibleFalse();
        //     this._wall.visible = true;
        // }
        // this._wall.update();

        // if(this._rail[0].visible == false){
        //     for(let i = 0; i< this._railNum; i++){
        //         this._rail[i].visible = true;
        //     }
        // }
        // for(let i = 0; i< this._railNum; i++){
        //     this._rail[i].update();
        // }


        this._rail.update();


    }



}
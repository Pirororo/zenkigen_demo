// import * as THREE from '../../libs/three.module.js';
// import {Camera, RoomCamera, MoveCamera} from '../camera/camera.js';
import persCamera from '../camera/persCamera.js';
import CACamera from '../camera/CACamera.js';
import ManyLine from '../objects/ManyLine.js';
import Triangle from '../objects/Triangle.js';
import FewLine from '../objects/FewLine.js';
// import FewLine from '../objects/FewLine_confuse.js';
import MiniTriangle from '../objects/MiniTriangle.js';
import Wave from '../objects/Wave.js';
import Rail from '../objects/rail_beforeList.js';
import Circle from '../objects/Circle.js';
import Sea from '../objects/Sea.js';
import SeaData from '../objects/SeaData.js';
import WaveLine from '../objects/waveLine.js';
import CArails from '../objects/CArails.js';
import PictWaver from '../objects/PictWaver.js';
import Ring_5th from '../objects/Ring.js';
import Ring_6th from '../objects/Ring_6th_2Loop*2.js';
import Ring_7th from '../objects/Ring_7th_normLine.js';

/**
 * シーンクラス：カメラとライト
 */
export class Scene extends THREE.Scene {

    constructor(){

        super();

        //カメラ
        this._persCamera = new persCamera();//thisにする
        this._orthoCamera = new THREE.OrthographicCamera( innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / - 2, 1, 1000 );
        this._caCamera = new CACamera();//thisにする
        this.camera = this._persCamera; //初期値


        // 環境光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        // ambientLight.castShadow = true;//これいれちゃだめ
        this.add(ambientLight);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        // directionalLight.castShadow = true;
        this.add(directionalLight);

        //スポットライト
        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.castShadow = true;
        spotLight.position.set(0, 250, 250);
        spotLight.intensity = 0.6;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        // spotLight.shadow.camera.fov = 120;
        // spotLight.shadow.camera.near = 1;
        // spotLight.shadow.camera.far = 1000;
        this.add(spotLight);

        //シェーダーのエフェクトをマスクするためシーン２種類にわけた
        // this.scene1 = new Scene1();
        // this.add(this.scene1);

        this.scene2 = new Scene2();
        this.scene2.add(ambientLight);
        // this.scene2.add(directionalLight);
        // this.scene2.add(spotLight);
        this.add(this.scene2);

        

    }

    update(){
        // TWEEN.update();
        if(this.camera == this._persCamera){
            this.camera.update();//lookAtで中心みてる
        }
        if(this.camera == this._caCamera){
            // this.camera.update();//lookAtで中心みてる
            this.currentPoint = new THREE.Vector3(
                this.scene2._rails.mesh.geo[3*5+0],
                this.scene2._rails.mesh.geo[3*5+1]+10,
                this.scene2._rails.mesh.geo[3*5+2]
            );

            this.nextPoint = new THREE.Vector3(
                this.scene2._rails.mesh.geo[3*15+0],
                this.scene2._rails.mesh.geo[3*15+1]+10,
                this.scene2._rails.mesh.geo[3*15+2]
            );

            this.camera.position.copy(this.currentPoint);
            this.camera.lookAt(this.nextPoint);  
        }
        // this.scene1.update();
        this.scene2.update();
    }

}

export class Scene1 extends THREE.Scene {

    constructor(){

        super();

        // //ライン
        // this._line = new Line();
        // this._line.position.set(0,0,0);
        // this.add(this._line);


        // //BOX
        // this.body = new THREE.Mesh(
        // new THREE.BoxGeometry(10, 10, 10),
        // new THREE.MeshLambertMaterial({
        //     color: 0xff0000,
        // })
        // );
        // this.body.position.set(0,0,0);
        // this.add(this.body);

    }
    
    update(){
        // this._line.update();
    }

}

export class Scene2 extends THREE.Scene {

    constructor(){

        super();

        // // ステージ
        // let stageMesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(500, 0.1, 500),
        //     new THREE.MeshPhongMaterial({
        //         color: 0x98EAFF,
        //         side: THREE.DoubleSide,
        //         specular: 0x000000 
        //     })
        // );
        // stageMesh.position.set(0,-100,0);
        // stageMesh.receiveShadow = true;
        // this.add(stageMesh);

        // //BOX
        // this.body = new THREE.Mesh(
        // new THREE.BoxGeometry(10, 10, 10),
        // new THREE.MeshLambertMaterial({
        //     color: 0xff0000,
        // })
        // );
        // this.body.position.set(0,0,0);
        // this.body.castShadow = true;
        // this.add(this.body);

        //複数線
        this._manyLine = new ManyLine();
        // this._manyLine.rotation.z = 45 * Math.PI/180;
        this._manyLine.visible = false;
        this._manyLine.castShadow = true;
        this.add(this._manyLine);

        //三角形
        this._triangle = new Triangle();
        // this._triangle.rotation.x = 90 * Math.PI/180;
        this._triangle.visible = false;
        this.add(this._triangle);

        //少量線
        this._fewLine = new FewLine();
        this._fewLine.position.set(0,0,30);
        this._fewLine.rotation.z = -45 * Math.PI/180;
        this._fewLine.visible = false;
        this.add(this._fewLine);

        //ちび三角
        this._miniTriangle = new MiniTriangle();
        // this._miniTriangle.position.set(0,30,0);
        this._miniTriangle.visible = false;
        this.add(this._miniTriangle);

        //波
        this._wave = new Wave();
        this._wave.rotation.x = 90 * Math.PI/180;
        this._wave.visible = false;
        this.add(this._wave);

        //レール
        this._rail = new Rail();
        this._rail.position.set(-100,0,0);;
        this._rail.visible = false;
        this.add(this._rail);


        //円
        this._circle = new Circle();
        // this._triangle.rotation.x = 90 * Math.PI/180;
        this._circle.visible = false;
        this.add(this._circle);

        //メッシュの海
        this._sea = new Sea();
        this._sea.position.z = -1000;
        this._sea.position.y = 100;
        this._sea.rotation.y = 0 * Math.PI/180;
        this._sea.rotation.x = 15 * Math.PI/180;
        this._sea.visible = false;
        this.add(this._sea);

        //メッシュの海（NIIデータ）
        this._seaData = new SeaData();
        this._seaData.position.z = -1000;
        this._seaData.position.y = 100;
        this._seaData.rotation.y = 0 * Math.PI/180;
        this._seaData.rotation.x = 15 * Math.PI/180;
        this._seaData.visible = false;
        this.add(this._seaData);

        //波の線(NIIデータ)
        this._waveLine = new WaveLine();
        this._waveLine.position.set(0,0,0);;
        this._waveLine.visible = false;
        this.add(this._waveLine);

        //CAのレール
        this._rails = new CArails();
        this._rails.position.set(0,0,0);;
        this._rails.visible = false;
        this.add(this._rails);

        //画像ゆらゆら
        this._pictWaver = new PictWaver();
        this._pictWaver.position.set(0,0,0);;
        this._pictWaver.visible = false;
        this.add(this._pictWaver);

        //ふわリング
        this._ring5 = new Ring_5th();
        this._ring5.position.set(0,0,0);;
        this._ring5.visible = false;
        this.add(this._ring5);

        //ふわリング
        this._ring6 = new Ring_6th();
        this._ring6.position.set(0,0,0);;
        this._ring6.visible = false;
        this.add(this._ring6);

        //ふわリング
        this._ring7 = new Ring_7th();
        this._ring7.position.set(0,0,0);;
        this._ring7.visible = false;
        this.add(this._ring7);

        //グリッチ

        this.scene = 0;

    }

    update(){

        this.visibleFalse = function(){
            this._manyLine.visible = false;
            this._triangle.visible = false;
            this._fewLine.visible = false;
            this._fewLine.frame = 0;
            this._miniTriangle.visible = false;
            this._wave.visible = false;
            this._rail.visible = false;
            this._circle.visible = false;
            this._sea.visible = false;
            this._seaData.visible = false;
            this._waveLine.visible = false;
            this._rails.visible = false;
            this._pictWaver.visible = false;
            this._ring5.visible = false;
            this._ring6.visible = false;
            this._ring7.visible = false;
        }
        

        if(this.scene == 1){
            if(this._manyLine.visible == false){
                this.visibleFalse();
                this._manyLine.visible = true;
            }
            this._manyLine.update();
        }
        if(this.scene == 2){
            if(this._triangle.visible == false){
                this.visibleFalse();
                this._triangle.visible = true;
            }
            this._triangle.update();
        }
        if(this.scene == 3){
            if(this._fewLine.visible == false){
                this.visibleFalse();
                this._fewLine.visible = true;
            }
            this._fewLine.update();
        }
        if(this.scene == 4){
            if(this._miniTriangle.visible == false){
                this.visibleFalse();
                this._miniTriangle.visible = true;
            }
            this._miniTriangle.update();
        }

        if(this.scene == 5){
            if(this._wave.visible == false){
                this.visibleFalse();
                this._wave.visible = true;
            }
            this._wave.update();
        }

        if(this.scene == 6){
            if(this._rail.visible == false){
                this.visibleFalse();
                this._rail.visible = true;
            }
            this._rail.update();
        }

        if(this.scene == 7){
            if(this._circle.visible == false){
                this.visibleFalse();
                this._circle.visible = true;
            }
            this._circle.update();
        }

        if(this.scene == 8){
            if(this._sea.visible == false){
                this.visibleFalse();
                this._sea.visible = true;
            }
            this._sea.update();
        }

        if(this.scene == 9){
            if(this._seaData.visible == false){
                this.visibleFalse();
                this._seaData.visible = true;
            }
            this._seaData.update();
        }

        if(this.scene == 10){
            if(this._waveLine.visible == false){
                this.visibleFalse();
                this._waveLine.visible = true;
            }
            this._waveLine.update();
        }
        
        if(this.scene == 11){
            if(this._rails.visible == false){
                this.visibleFalse();
                this._rails.visible = true;
            }
            this._rails.update();
        }

        if(this.scene == 12){
            if(this._pictWaver.visible == false){
                this.visibleFalse();
                this._pictWaver.visible = true;
            }
            this._pictWaver.update();
        }


        if(this.scene == 13){
            if(this._ring5.visible == false){
                this.visibleFalse();
                this._ring5.visible = true;
            }
            this._ring5.update();
        }

        if(this.scene == 15){
            if(this._ring6.visible == false){
                this.visibleFalse();
                this._ring6.visible = true;
            }
            this._ring6.update();
        }

        if(this.scene == 16){
            if(this._ring7.visible == false){
                this.visibleFalse();
                this._ring7.visible = true;
            }
            this._ring7.update();
        }



    }



}
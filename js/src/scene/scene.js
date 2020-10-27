import * as THREE from '../../libs/three.module.js';
import persCamera from '../camera/persCamera.js';
import Sea from '../objects/Sea.js';
import SeaData from '../objects/SeaData.js';

export class Scene extends THREE.Scene {

    constructor(){

        super();
        this.scene = 0;

        //カメラ
        this._persCamera = new persCamera();//thisにする
        this.camera = this._persCamera; //初期値

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

    }

    update(){

        this.visibleFalse = function(){
            this._sea.visible = false;
            this._seaData.visible = false;
        }

        if(this.scene == 0){
            if(this._sea.visible == false){
                this.visibleFalse();
                this._sea.visible = true;
            }
            this._sea.update();
        }

        if(this.scene == 1){
            if(this._seaData.visible == false){
                this.visibleFalse();
                this._seaData.visible = true;
            }
            this._seaData.update();
        }

    }

}
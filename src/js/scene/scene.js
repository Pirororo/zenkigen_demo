import * as THREE from 'three/build/three.module';
import Rail from '../objects/rail_List2.js';
/**
 * シーンクラス：カメラとライト
 */
export class Scene extends THREE.Scene {

    constructor() {
        super();

        this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 1000);

        this._rail = new Rail();
        this._rail .position.set(0, -10, 0);
        this.add(this._rail);

        this.frame = 0;
    }

    update() {
        if(this.frame > 10){this.frame = 0;}
        this.frame += 1;

        if(this.frame % 2 == 0){
            this.currentPoint = new THREE.Vector3(
                this._rail.meshList[0].geo[3*15+0],
                this._rail.meshList[0].geo[3*15+1]+22,
                this._rail.meshList[0].geo[3*15+2]
            );
            this.nextPoint = new THREE.Vector3(
                this._rail.meshList[0].geo[3*18+0],
                this._rail.meshList[0].geo[3*18+1]+22,
                this._rail.meshList[0].geo[3*18+2]
            );

            this.camera.position.copy(this.currentPoint);
            this.camera.lookAt(this.nextPoint);

            this._rail.update();
        }
    }
}

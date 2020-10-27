import * as THREE from '../../../../libs/three.module.js';

/**
 *　カークラスです。
 */
// export default class RoomN1 extends THREE.Object3D {
export class RoomN1 extends THREE.Object3D {
    /**
     * コンストラクターです。
     * @constructor
     */
    constructor() {
      super();
  
      // maru
      this.maru = new THREE.Mesh(
        new THREE.BoxGeometry(8,5,0.2),
        new THREE.MeshPhongMaterial({
          color: 0xff00ff,
          opacity: 1.0
        })
      );

      this.maru.position.x = -2;
      this.maru.position.y = 5;
      this.maru.position.z = -3;

      this.maru.rotation.x = 5 * Math.PI/180;
      this.maru.rotation.y = 30 * Math.PI/180;
      this.add(this.maru);

    }
  
    /**
     * フレーム毎の更新をします。
     */
    update() {}
  }

export class RoomN2 extends THREE.Object3D {
    /**
    * コンストラクターです。
    * @constructor
    */
    constructor() {
        super();

        // maru
        this.maru = new THREE.Mesh(
            new THREE.SphereGeometry(2,8,8),
            new THREE.MeshPhongMaterial({
              color: 0x0000ff,
            })
        );

        this.maru.position.y = 0;
        this.add(this.maru);

    }
  
    /**
     * フレーム毎の更新をします。
     */
    update() {}
}
  
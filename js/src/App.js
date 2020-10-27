// import * as THREE from '../libs/three.module.js';

/**
 * メインアプリクラスです。
 */
export class App{
      /**
     * @constructor
     * @param sceneInstance
     */
    constructor(sceneInstance){
      this._update = this._update.bind(this);
      this._resize = this._resize.bind(this);
      // this._keyEvent = this._keyEvent.bind(this);

      // シーン
      this._scene = sceneInstance;
  
      //レンダラー
      this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this._renderer.setClearColor(new THREE.Color(0xffffff), 1.0);//C7FFE4//C7FF73//A4F917
      this._renderer.setSize(window.innerWidth, window.innerHeight);
      this._renderer.setPixelRatio(1);
      this._renderer.shadowMap.enabled = true;//影に必要
  
      // DOMを追加
      this._wrapper = document.getElementById('WebGL-output').appendChild(this._renderer.domElement);

      //オービットカメラ
      this.control = new THREE.OrbitControls(this._scene.camera);
  
      // リサイズ
      this._resize();
      window.addEventListener('resize', this._resize);
      window.addEventListener('keyup', this._keyEvent);

      //マウス
      window.addEventListener('mousemove', e => {
        this._scene.scene2._pictWaver.mouseMoved(e.clientX, e.clientY);
      });

      
      // フレーム毎の更新
      this._update();

      this.frame = 0;
      this.sceneNUM = 2;
  
    }

    // _keyEvent(event){
    //   // if (event.isComposing || event.keyCode === 229) {
    //   //   return;
    //   // }
    //   // // 何かをする
      
    //   if (event.key === 'a') {
    //     this._scene.scene2.scene = 1;//_keyEventをbindしないと_sceneの中身を参照できない！
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 's') {
    //     this._scene.scene2.scene = 2;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'd') {
    //     this._scene.scene2.scene = 3;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'f') {
    //     this._scene.scene2.scene = 4;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'g') {
    //     this._scene.scene2.scene = 5;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'h') {
    //     this._scene.scene2.scene = 6;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'j') {
    //     this._scene.scene2.scene = 7;
    //     this._scene.camera = this._scene._orthoCamera;
    //   }
    //   if (event.key === 'k') {
    //     this._scene.scene2.scene = 8;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'l') {
    //     this._scene.scene2.scene = 9;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'z') {
    //     this._scene.scene2.scene = 10;
    //     this._scene.camera = this._scene._persCamera
    //   }
    //   if (event.key === 'x') {
    //     this._scene.scene2.scene = 11;
    //     this._scene.camera = this._scene._caCamera;
    //   }
    //   if (event.key === 'c') {
    //     this._scene.scene2.scene = 12;
    //     this._scene.camera = this._scene._orthoCamera;
    //   }

    // }


    /**
    * フレーム毎の更新をします。
    */
    _update() {
  
      this._renderer.autoClear = true;//これ大事〜！trueだと色が毎回背景白にクリアされちゃう、逆にtrueにしないと背景色ぬられない
      // this._renderer.autoClear = false;
  
      // シーンの更新
      this._scene.update();
      // this._scene.draw();
  
      requestAnimationFrame(this._update);
      this._renderer.render(this._scene, this._scene.camera);

      // //カメラポジションの取得
      // var position = this._scene.camera.matrixWorld.getPosition().clone();
      // console.log(position);

      this.frame += 1;
      if(this.frame%240 ==0){
        this.sceneNUM += 1;
      }
      if(this.sceneNUM >=5){
        this.sceneNUM = 0;
        this.frame = 0;
      }

      // if (this.sceneNUM == 0) {
      //   this._scene.scene2.scene = 7;
      //   this._scene.camera = this._scene._orthoCamera;
      // }
      if (this.sceneNUM == 0) {
        this._scene.scene2.scene = 8;
        this._scene.camera = this._scene._persCamera;
      }
      if (this.sceneNUM == 1) {
        this._scene.scene2.scene = 9;
        this._scene.camera = this._scene._persCamera;
      }
      if (this.sceneNUM == 2) {
        this._scene.scene2.scene = 15;
        this._scene.camera = this._scene._persCamera;
      }
      if (this.sceneNUM == 3) {
        this._scene.scene2.scene = 16;
        this._scene.camera = this._scene._persCamera;
      }
      if (this.sceneNUM == 4) {
        this._scene.scene2.scene = 13;
        this._scene.camera = this._scene._persCamera;
      }

      
  
  
    }
  
    /**
     * リサイズ
     */
    _resize() {
      const width = this._wrapper.clientWidth;
      const height = this._wrapper.clientHeight;
      this._renderer.domElement.setAttribute('width', String(width));
      this._renderer.domElement.setAttribute('height', String(height));
      this._renderer.setPixelRatio(window.devicePixelRatio || 1.0);
      this._renderer.setSize(width, height);
      // this._scene.camera.aspect = width / height;
      // this._scene.camera.updateProjectionMatrix();

      console.log("resize");
    }

    // onWindowResize() {

      // 	var w = container.clientWidth;
      // 	var h = container.clientHeight;
      
      // 	camera.aspect = w / h;
      // 	camera.updateProjectionMatrix();
      
      // 	renderer.setSize( w, h );
      
      // 	resolution.set( w, h );
      
      // }
  
}



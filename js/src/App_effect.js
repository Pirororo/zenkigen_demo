
// import * as THREE from '../libs/three.module.js';

/**
 * メインアプリクラスです。
 */
export class App{
  //  export default class App{
      /**
     * @constructor
     * @param sceneInstance
     */
    constructor(sceneInstance){

      
      //この中からconstructer外部のmethodを呼び出すためにはbindする必要がある
      this._update = this._update.bind(this);
      this._resize = this._resize.bind(this);
      // this._keyEvent = this._keyEvent.bind(this);
  
      // シーン
      this._scene = sceneInstance;
  
      //レンダラー
      this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this._renderer.setClearColor(new THREE.Color(0x000000), 1.0);
      this._renderer.setSize(window.innerWidth, window.innerHeight);
      this._renderer.setPixelRatio(1);
      this._renderer.shadowMap.enabled = true;//影に必要
  
      // DOMを追加
      this._wrapper = document.getElementById('WebGL-output').appendChild(this._renderer.domElement);

      // this.control = new THREE.OrbitControls(this._scene.camera);
  
      // リサイズ
      this._resize();
      window.addEventListener('resize', this._resize);

      window.addEventListener('keyup', this._keyEvent);

    // シェーダー
    //レンダーパス
    var renderPass = new THREE.RenderPass(this._scene, this._scene.camera);
    renderPass.clear = true;//Lineは線が更新されていくのでtrueにする、falseだと線最初から全部のこっちゃう

    //ブルームパス
    // var bloomPass = new BloomPass(1.5, 15, 3.0, 64);
    var bloomPass = new THREE.BloomPass(2.0, 15, 3.0, 64);
    bloomPass.enabled = true;

    //出力パス
    //コピーパス
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);//コピー
    effectCopy.renderToScreen = true;


    //コンポーザーの定義
    this.composer = new THREE.EffectComposer(this._renderer);
    this.composer.renderTarget1.stencilBuffer = true;//?
    this.composer.renderTarget2.stencilBuffer = true;//?

    //コンポーザーに入れていく
    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);
    this.composer.addPass(effectCopy);


  
    // フレーム毎の更新
    this._update();

    this.frame = 0;
    this.sceneNUM = 0;


  
    }

    // _keyEvent(event){
    //   // if (event.isComposing || event.keyCode === 229) {
    //   //   return;
    //   // }
    //   // // 何かをする

    //   // let KEY = event.key;
    //   if (event.key === 'a') {
    //     this._scene.scene2.scene = 1;
    //   }
    //   if (event.key === 's') {
    //     this._scene.scene2.scene = 2;
    //   }
    //   if (event.key === 'd') {
    //     this._scene.scene2.scene = 3;
    //   }
    //   if (event.key === 'f') {
    //     this._scene.scene2.scene = 4;
    //   }
    //   if (event.key === 'g') {
    //     this._scene.scene2.scene = 5;
    //   }
    //   if (event.key === 'h') {
    //     this._scene.scene2.scene = 6;
    //   }

    // }

  
  
    /**
    * フレーム毎の更新をします。
    */
    _update() {
  
      this._renderer.autoClear = true;//これ大事〜！trueだと色が毎回背景白にクリアされちゃう、逆にtrueにしないと背景色ぬられない
      // シーンの更新
      this._scene.update();
      // this._scene.draw();
  
      requestAnimationFrame(this._update);
      // this._renderer.render(this._scene, this._scene.camera);
      this.composer.render();




      this.frame += 1;
      if(this.frame%480 ==0){
        this.sceneNUM += 1;
      }
      if(this.sceneNUM >=4){
        this.sceneNUM = 0;
        this.frame = 0;
      }

      if (this.sceneNUM == 0) {
        this._scene.scene2.scene = 7;
        this._scene.camera = this._scene._orthoCamera;
      }
      if (this.sceneNUM == 1) {
        this._scene.scene2.scene = 8;
        this._scene.camera = this._scene._persCamera
      }
      if (this.sceneNUM == 2) {
        this._scene.scene2.scene = 9;
        this._scene.camera = this._scene._persCamera
      }
      if (this.sceneNUM == 3) {
        this._scene.scene2.scene = 10;
        this._scene.camera = this._scene._persCamera
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
      this._scene.camera.aspect = width / height;
      this._scene.camera.updateProjectionMatrix();

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



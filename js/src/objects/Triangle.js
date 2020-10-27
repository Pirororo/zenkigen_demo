// import * as THREE from '../../libs/three.module.js';

/**
 *カークラスです。
 */
export default class Triangle extends THREE.Object3D {
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    super();

    this.frame = 0;
    this.listNum = 0;

    this.startSetting = this.startSetting.bind(this);


    //BOX
    this.NUM = 60;
    this.boxList = [];
    this.boxMatList = [];

    this.nowBoxPos = [];
    this.targetBoxPos = [];

    this.nowBoxRot=[];
    this.targetBoxRot=[];

    this.nowBoxScl=[];
    this.targetBoxScl=[];

    this.nowBoxOpc=[];
    this.targetBoxOpc=[];

    for (let i = 0; i < this.NUM/2; i++) {

        //普通の三角
        this.geoCirc = new THREE.CircleGeometry(17, 3);
        // this.matCirc = new THREE.MeshBasicMaterial({
        this.matCirc = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          opacity: Maf.randomInRange( 0.3, 1.0 ),
          transparent: true,
          side: THREE.DoubleSide,
          // specular: 0x000000,
        });

        this.meshCirc = new THREE.Mesh(
          this.geoCirc,
          this.matCirc
        );

        this.startSetting(this.meshCirc, this.matCirc, i);
    }


    for (let i = 0; i < this.NUM/2; i++) {

        //中抜き三角
        this.geoRing = new THREE.RingGeometry(10, 15, 3, 1);
        this.matRing = new THREE.MeshPhongMaterial({
        // this.matRing = new THREE.MeshBasicMaterial({
            color: 0xFFDEFF,
            opacity: Maf.randomInRange( 0, 0.2 ),
            transparent: true,
            side: THREE.DoubleSide,
            // specular: 0x000000,
        });
        this.matRing.needsUpdate = true;
        this.meshRing = new THREE.Mesh(
            this.geoRing,
            this.matRing
        );

        this.startSetting(this.meshRing, this.matRing, i);
    }

  }

  startSetting(mesh, mat, i){

    mesh.position.set(
        Maf.randomInRange( -100, 100),
        Maf.randomInRange( -100, 100),
        Maf.randomInRange( -100, 100)
    );

    // mesh.rotation.z = 0 * Math.PI / 180;
    mesh.scale.set(1,1,1);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.add(mesh);

    // 個々のmeshをリスト化して保存
    this.boxList.push(mesh);
    this.boxMatList.push(mat);



    // ここからnow, targetの初期値設定

    // positions
    // 現在のpositions
    this.nowBoxPos.push(mesh.position.x, mesh.position.y, mesh.position.z);

    // ターゲットのpositions
    // this.targetBoxPos.push(0, 0, 0);
    let Randomselect = Math.random();
    let lineLength = Maf.randomInRange(50, 80);
    if(Randomselect >0.66){
        if(this.nowBoxPos[3 * i + 0]> 100 && lineLength>0){lineLength *= -1;}
        if(this.nowBoxPos[3 * i + 0]< -100&& lineLength<0){lineLength *= -1;}
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 0]+lineLength);
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 1]);
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 2]);
    }else if(Randomselect >0.33){
        if(this.nowBoxPos[3 * i + 0]> 100 && lineLength>0){lineLength *= -1;}
        if(this.nowBoxPos[3 * i + 0]< -100&& lineLength<0){lineLength *= -1;}
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 0]);
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 1]+lineLength);
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 2]);
    }else{
        if(this.nowBoxPos[3 * i + 0]> 100 && lineLength>0){lineLength *= -1;}
        if(this.nowBoxPos[3 * i + 0]< -100 && lineLength<0){lineLength *= -1;}
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 0]);
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 1]);
        this.targetBoxPos.push(this.nowBoxPos[3 * i + 2]+lineLength);
    }

    //rotate
    // 現在のrotate
    this.nowBoxRot.push(mesh.rotation.z);
    // ターゲットのrotate
    this.targetBoxRot.push((~~(Math.random()*360))*Math.PI/180);

    //scale
    // 現在のscale
    this.nowBoxScl.push(mesh.scale.x);
    // ターゲットのscale
    this.targetBoxScl.push(Maf.randomInRange(0.4, 1.8));

    //opacity
    // 現在のopacity
    this.nowBoxOpc.push(mat.opacity);
    // ターゲットのscale
    this.targetBoxOpc.push(Maf.randomInRange(0.8, 1));


  }

    /**
     * フレーム毎の更新をします。
     */
  update() {

      //box
      //イージング
      //positions
      for(let i =0; i< this.NUM*3; i++){
          this.nowBoxPos[i] += (this.targetBoxPos[i]-this.nowBoxPos[i]) *0.3;
      }

      //rotate //scale //opacity
      for(let i =0; i< this.NUM; i++){
        this.nowBoxRot[i] += (this.targetBoxRot[i]-this.nowBoxRot[i]) *0.1;
        // this.nowBoxScl[i] += (this.targetBoxScl[i]-this.nowBoxScl[i]) *0.2;
        this.nowBoxOpc[i] += (this.targetBoxOpc[i]-this.nowBoxOpc[i]) *0.2;
      }



      //ターゲットの決定
      this.frame += 1;

      if(this.frame%2 == 0){

          this.listNum += 1;
          if(this.listNum > this.NUM-4){
              this.listNum = 0;
          }

          for(let i = this.listNum; i< this.listNum+4; i++){
              //positions
              let Randomselect = Math.random();
              let PlusMinus = Math.random();
              let lineLength = Maf.randomInRange(30, 60) ;
              if(PlusMinus >0.5){ lineLength *= -1 }

              if(Randomselect >0.66){
                  if(this.targetBoxPos[3 * i + 0]> 100 && lineLength>0){lineLength *= -1;}
                  if(this.targetBoxPos[3 * i + 0]< -100 && lineLength<0){lineLength *= -1;}
                  this.targetBoxPos[3 * i + 0] += lineLength;
              }else if(Randomselect >0.33){
                  if(this.targetBoxPos[3 * i + 1]> 100 && lineLength>0){lineLength *= -1;}
                  if(this.targetBoxPos[3 * i + 1]< -100 && lineLength<0){lineLength *= -1;}
                  this.targetBoxPos[3 * i + 1] += lineLength;
              }else{
                  if(this.targetBoxPos[3 * i + 2]> 100 && lineLength>0){lineLength *= -1;}
                  if(this.targetBoxPos[3 * i + 2]< -100 && lineLength<0){lineLength *= -1;}
                  this.targetBoxPos[3 * i + 2] += lineLength;
              }

              //rotate
              this.targetBoxRot[ i ] = (~~(Math.random()*360))*2*Math.PI/180;

              // //scale
              // this.targetBoxScl[ i] = Maf.randomInRange(0.2, 1.8);

              //opacity
              if(this.nowBoxOpc[ i ]<0.5){
                this.targetBoxOpc[ i ] = Maf.randomInRange(0.8, 1);
              }else{
                this.targetBoxOpc[ i ] = Maf.randomInRange(0, 0.2);
              }
          }

      }

    // // ばらばらにmaterialのopacity設定するにはmaterialもListにておかないとだめ
    // this.matCirc.opacity -= 0.001;
    // console.log(this.matCirc.opacity);

    // console.log(this.g.parameters.innerRadius);
    // this.g.parameters.innerRadius += 1;


    //box
    for(let i =0; i< this.NUM; i++){
        //positions
        this.boxList[i].position.x = this.nowBoxPos[3 * i + 0];
        this.boxList[i].position.y = this.nowBoxPos[3 * i + 1];
        this.boxList[i].position.z = this.nowBoxPos[3 * i + 2];

        //rotate
        this.boxList[i].rotation.y = this.nowBoxRot[i];

        // //scale
        // this.boxList[i].scale.x = this.nowBoxScl[i];
        // this.boxList[i].scale.y = this.nowBoxScl[i];
        // this.boxList[i].scale.z = this.nowBoxScl[i];

        //opacity
        this.boxMatList[i].opacity = this.nowBoxOpc[i];

        // console.log(this.nowBoxScl[i]);
    }

  }

  draw(){
      
  }
}

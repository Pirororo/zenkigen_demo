// import * as THREE from '../../libs/three.module.js';

/**
 *カークラスです。
 */
export default class MiniTriangle extends THREE.Object3D {
  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {

    super();

    this.frame = 0;
    this.listNum = -1;

    this.startSetting = this.startSetting.bind(this);

    this.j=0;
    console.log(this.j);

    this.sclLen = 2.8;


    //BOX
    this.NUM = 24;
    this.boxList = [];
    this.boxMatList = [];

    this.centerPos = new THREE.Vector3();

    this.nowBoxPos = [];
    this.targetBoxPos = [];

    this.nowBoxRot=[];
    this.targetBoxRot=[];

    this.nowBoxScl=[];
    this.targetBoxScl=[];

    this.nowBoxOpc=[];
    this.targetBoxOpc=[];

    for (let i = 0; i < this.NUM; i++) {

        //普通の三角
        this.geoCirc = new THREE.CircleGeometry(1, 3);
        this.matCirc = new THREE.MeshBasicMaterial({
        // this.matCirc = new THREE.MeshPhongMaterial({
          color: 0xcccccc,
          opacity: Maf.randomInRange( 0.3, 1.0 ),
          transparent: true
        });

        this.meshCirc = new THREE.Mesh(
          this.geoCirc,
          this.matCirc
        );

        this.startSetting(this.meshCirc, this.matCirc, i);
    }

    


  }

  startSetting(mesh, mat, i){


    // if(i % 6 ==0){
    //   this.j+=1;
    // }

    mesh.position.set(
      this.sclLen/2*3*(i%6)+(i/3),
      -60,
      0
    );

    // this.j = 0;

    this.centerPos;

    mesh.rotation.z = 30 * Math.PI / 180;
    mesh.scale.set(this.sclLen,this.sclLen,this.sclLen);
    this.add(mesh);

    // 個々のmeshをリスト化して保存
    this.boxList.push(mesh);
    this.boxMatList.push(mat);



    // ここからnow, targetの初期値設定

    // positions
    // 現在のpositions
    this.nowBoxPos.push(mesh.position.x, mesh.position.y, mesh.position.z);

    // ターゲットのpositions
    this.targetBoxPos.push(this.nowBoxPos[3 * i + 0]);
    this.targetBoxPos.push(this.nowBoxPos[3 * i + 1]);
    this.targetBoxPos.push(this.nowBoxPos[3 * i + 2]);


    //rotate
    // 現在のrotate
    this.nowBoxRot.push(mesh.rotation.z);
    // ターゲットのrotate
    this.targetBoxRot.push((~~(Math.random()*360))*Math.PI/180);

    //scale
    // 現在のscale
    this.nowBoxScl.push(mesh.scale.x);
    // ターゲットのscale
    // this.targetBoxScl.push(Maf.randomInRange(0.8, 1.3));
    this.targetBoxScl.push(this.nowBoxScl[i]);

    //opacity
    // 現在のopacity
    this.nowBoxOpc.push(mat.opacity);
    // ターゲットのscale
    // this.targetBoxOpc.push(Maf.randomInRange(0.5, 0.7));
    this.targetBoxOpc.push(1);


  }

    /**
     * フレーム毎の更新をします。
     */
  update() {

      //box
      //イージング
      //positions
      for(let i =0; i< this.NUM*3; i++){
          this.nowBoxPos[i] += (this.targetBoxPos[i]-this.nowBoxPos[i]) *0.1;
      }

      //rotate //scale //opacity
      for(let i =0; i< this.NUM; i++){
          // this.nowBoxRot[i] += (this.targetBoxRot[i]-this.nowBoxRot[i]) *0.1;
          // this.nowBoxScl[i] += (this.targetBoxScl[i]-this.nowBoxScl[i]) *0.2;
          this.nowBoxOpc[i] += (this.targetBoxOpc[i]-this.nowBoxOpc[i]) *0.2;
      }

      //ターゲットの決定
      this.frame += 1;

      if(this.frame >=10 && this.frame <210){
        if(this.frame%2 == 0){

            this.listNum += 1;
            if(this.listNum > this.NUM-1){
                this.listNum = 0;
            }

            for(let i = this.listNum; i< this.listNum+1; i++){
                //positions
                let j = ~~(i/6);
                this.targetBoxPos[3 * i + 1] = this.sclLen*2 *j;

                //rotate
                this.targetBoxRot[ i ] = (~~(Math.random()*360))*3*Math.PI/180;

                //scale
                this.targetBoxScl[ i] = Maf.randomInRange(0.2, 1.8);

                //opacity
                if(this.targetBoxOpc[ i ]<0.5){
                  this.targetBoxOpc[ i ] = Maf.randomInRange(1, 1);
                }else{
                  this.targetBoxOpc[ i ] = Maf.randomInRange(0.4, 0.4);
                }
            }
        }
      }
      if(this.frame >=210){
        this.frame =0;
        for(let i = 0; i< this.NUM*3; i++){
          //positions
          this.nowBoxPos[3 * i + 0] = this.sclLen/2*3*(i%6)+(i/3);
          this.nowBoxPos[3 * i + 1] = -60;
          this.nowBoxPos[3 * i + 2] = 0;
          this.targetBoxPos[3 * i + 0] = this.sclLen/2*3*(i%6)+(i/3);
          this.targetBoxPos[3 * i + 1] = -60;
          this.targetBoxPos[3 * i + 2] = 0;
        }
        this.listNum =-1;
      }


    //box
    for(let i =0; i< this.NUM; i++){
        //positions
        this.boxList[i].position.x = this.nowBoxPos[3 * i + 0];
        this.boxList[i].position.y = this.nowBoxPos[3 * i + 1];
        this.boxList[i].position.z = this.nowBoxPos[3 * i + 2];

        //rotate
        this.boxList[i].rotation.z = this.nowBoxRot[i];

        //scale
        this.boxList[i].scale.x = this.nowBoxScl[i];
        this.boxList[i].scale.y = this.nowBoxScl[i];
        this.boxList[i].scale.z = this.nowBoxScl[i];

        //opacity
        this.boxMatList[i].opacity = this.nowBoxOpc[i];

        // console.log(this.nowBoxScl[i]);
    }

  }

  draw(){
      
  }
}

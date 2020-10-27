// import * as THREE from '../../libs/three.module.js';
// import * as THREE from '../../libs/three.js';
// import {} from '../../libs/THREE.MeshLine.js';

/**
 *　ラインクラスです。
 */
export default class ManyLine extends THREE.Object3D {
　　 /**
    * コンストラクターです。
    * @constructor
    */
    constructor(){

        super();

        this.init = this.init.bind(this);
        this.makeLine = this.makeLine.bind(this);
        this.makeGeo = this.makeGeo.bind(this);

        this.frame = 0;
        this.listNum = -1;
        this.space = 1.5;//ライン間のスペース

        this.meshList = [];//mesh
        this.gList = [];//meshline
        this.geoList = [];//vec3配列

        this.nowLinePos = [];
        this.targetLinePos = [];

        var Params = function(){
            this.curves = true;
            this.opacity = 1;
            this.amount = 5;
            this.lineWidth = 0.2;
            // this.dashArray = 0.1;
            // this.dashOffset = 0;
            // this.dashRatio = 0.7;
            this.strokes = false;
        };

        this.params = new Params();
        window.addEventListener( 'load', this.init());

    }



    init() {
        for( var j = 0; j < this.params.amount; j++ ) {
            if( this.params.curves ) this.makeLine( this.makeGeo(j), j );
        }
    }
    
    makeLine( geo, j ) {

        this.g = new MeshLine();
        this.gList.push(this.g);
        this.g.setGeometry( geo );


        // var dashArrays = [];
        // for(let i =0; i< this.params.amount; i++){
        //     let arrays= 0.1+((~~(Math.random()*60))*0.01);
        //     // console.log(arrays);
        //     dashArrays.push(arrays);
        // }
        
        // var dashOffsets = [];
        // for(let i =0; i< this.params.amount; i++){
        //     let offs= (~~(Math.random()*60))*0.0001;
        //     // console.log(offs);
        //     dashOffsets.push(offs);
        // }


        var material = new MeshLineMaterial( {
            useMap: this.params.strokes,
            color: new THREE.Color( 0xffffff),
            opacity: this.params.opacity,
            // dashArray: dashArrays[ ~~Maf.randomInRange( 0, dashArrays.length ) ],
            // dashOffset: dashOffsets[ ~~Maf.randomInRange( 0, dashOffsets.length ) ],
            // dashRatio: this.params.dashRatio,
            lineWidth: this.params.lineWidth,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh( this.gList[j].geometry, material );

        this.add( this.mesh );
        this.meshList.push( this.mesh );


    }

    makeGeo(j) {

        // ここからnow, targetの初期値設定
        // positions
        // 現在のpositions
        this.nowLinePos.push(
            j*this.space,
            150,
            0,
            j*this.space,
            150,
            0
        );

        // ターゲットのpositions
        this.targetLinePos.push(this.nowLinePos[3*2 * j + 0]);
        this.targetLinePos.push(this.nowLinePos[3*2 * j + 1]);
        this.targetLinePos.push(this.nowLinePos[3*2 * j + 2]);
        this.targetLinePos.push(this.nowLinePos[3*2 * j + 3]);
        this.targetLinePos.push(this.nowLinePos[3*2 * j + 4]);
        this.targetLinePos.push(this.nowLinePos[3*2 * j + 5]);



        //nowPosのgeometry登録
        this.geometry = new THREE.Geometry();
        // for( var i = 0; i < 2; i++ ) {
            this.geometry.vertices.push( new THREE.Vector3(
                this.nowLinePos[ 3*2 * j + 0],
                this.nowLinePos[ 3*2 * j + 1],
                this.nowLinePos[ 3*2 * j + 2]
            ));
            this.geometry.vertices.push( new THREE.Vector3(
                this.nowLinePos[ 3*2 * j + 3],
                this.nowLinePos[ 3*2 * j + 4],
                this.nowLinePos[ 3*2 * j + 5]
            ));
        // }

        this.geoList.push( this.geometry );
        return this.geometry;
    }



    update(){

        //イージング
        for(let i =0; i< this.nowLinePos.length; i++){
            this.nowLinePos[i] += (this.targetLinePos[i]-this.nowLinePos[i]) *0.1;
        }


        //ターゲットの決定
        this.frame += 1;
        console.log(this.frame);

        //はじめ

        //線入ってくるとこ
        if(this.frame > 30 && this.frame < 100){
            if(this.frame%10 == 0){

                this.listNum += 1;
                if(this.listNum > this.params.amount){
                    this.listNum = 0;
                }

                // for( var i = 0; i < 2; i++ ) {
                    for(let j =this.listNum; j< this.listNum+1; j++){
                        this.targetLinePos[ 3*2 * j + 0 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 1 ] = -40*0;
                        this.targetLinePos[ 3*2 * j + 2 ] = 0;
                        this.targetLinePos[ 3*2 * j + 3 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 4 ] = -40*1;
                        this.targetLinePos[ 3*2 * j + 5 ] = 0;
                    }
                // }
            }

        //線ゆれるとこ
        }if(this.frame >= 100 && this.frame < 140){

            if(this.frame%10 == 0){

                this.listNum += 1;
                if(this.listNum > this.params.amount){
                    this.listNum = 0;
                }

                
                if(this.listNum%2 ==0 ){
                    for(let j =this.listNum; j< this.listNum+1; j++){
                        this.targetLinePos[ 3*2 * j + 0 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 1 ] = -40;
                        this.targetLinePos[ 3*2 * j + 2 ] = 0;
                        this.targetLinePos[ 3*2 * j + 3 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 4 ] = -40;
                        this.targetLinePos[ 3*2 * j + 5 ] = 0;
                    }
                }else{
                    for(let j =this.listNum; j< this.listNum+1; j++){
                        this.targetLinePos[ 3*2 * j + 0 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 1 ] = 40;
                        this.targetLinePos[ 3*2 * j + 2 ] = 0;
                        this.targetLinePos[ 3*2 * j + 3 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 4 ] = 40;
                        this.targetLinePos[ 3*2 * j + 5 ] = 0;
                    }

                }
            }else if(this.frame%3 == 0){

                this.listNum += 1;
                if(this.listNum > this.params.amount){
                    this.listNum = 0;
                }

                let ran = Math.random()* 30;
                // for( var i = 0; i < 2; i++ ) {
                    for(let j =this.listNum; j< this.listNum+1; j++){
                        this.targetLinePos[ 3*2 * j + 0 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 1 ] = ran*1;
                        this.targetLinePos[ 3*2 * j + 2 ] = 0;
                        this.targetLinePos[ 3*2 * j + 3 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 4 ] = -ran*1;
                        this.targetLinePos[ 3*2 * j + 5 ] = 0;
                    }
                // }
            }

        //線消えるとこ
        }if(this.frame >= 140 && this.frame < 180){

            if(this.frame%5 == 0){

                this.listNum += 1;
                if(this.listNum > this.params.amount){
                    this.listNum = 0;
                }

                if(this.listNum%2 ==0 ){
                    for(let j =this.listNum; j< this.listNum+1; j++){
                        this.targetLinePos[ 3*2 * j + 0 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 1 ] = -80;
                        this.targetLinePos[ 3*2 * j + 2 ] = 0;
                        this.targetLinePos[ 3*2 * j + 3 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 4 ] = -80;
                        this.targetLinePos[ 3*2 * j + 5 ] = 0;
                    }
                }else{
                    for(let j =this.listNum; j< this.listNum+1; j++){
                        this.targetLinePos[ 3*2 * j + 0 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 1 ] = 80;
                        this.targetLinePos[ 3*2 * j + 2 ] = 0;
                        this.targetLinePos[ 3*2 * j + 3 ] = j*this.space;
                        this.targetLinePos[ 3*2 * j + 4 ] = 80;
                        this.targetLinePos[ 3*2 * j + 5 ] = 0;
                    }
                }
            }
        }

        if(this.frame>= 180){
            this.frame = 0;
            if(this.frame == 0){
                for(let j =0; j< this.params.amount; j++){
                    this.nowLinePos[ 3*2 * j + 0 ] = j*this.space;
                    this.nowLinePos[ 3*2 * j + 1 ] = 350;
                    this.nowLinePos[ 3*2 * j + 2 ] = 0;
                    this.nowLinePos[ 3*2 * j + 3 ] = j*this.space;
                    this.nowLinePos[ 3*2 * j + 4 ] = 350;
                    this.nowLinePos[ 3*2 * j + 5 ] = 0;
                    this.targetLinePos[ 3*2 * j + 0 ] = j*this.space;
                    this.targetLinePos[ 3*2 * j + 1 ] = 350;
                    this.targetLinePos[ 3*2 * j + 2 ] = 0;
                    this.targetLinePos[ 3*2 * j + 3 ] = j*this.space;
                    this.targetLinePos[ 3*2 * j + 4 ] = 350;
                    this.targetLinePos[ 3*2 * j + 5 ] = 0;
                }
            this.listNum =-1;
            }
        }


        
        

        //draw
        for(let j = 0; j< this.params.amount; j++){
            // for( var i = 0; i < 2; i++ ) {
                this.geoList[j].vertices[0].set(
                    this.nowLinePos[ 3*2 * j + 0 ],
                    this.nowLinePos[ 3*2 * j + 1 ],
                    this.nowLinePos[ 3*2 * j + 2 ]
                );
                this.geoList[j].vertices[1].set(
                    this.nowLinePos[ 3*2 * j + 3 ],
                    this.nowLinePos[ 3*2 * j + 4 ],
                    this.nowLinePos[ 3*2 * j + 5 ]
                );
            // }
            this.gList[j].setGeometry( this.geoList[j] );
        }
    }

}


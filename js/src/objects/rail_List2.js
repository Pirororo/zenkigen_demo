// import {MeshLine, MeshLineMaterial} from "three.meshline";
// import * as THREE from "three";


export default class Line extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor(){
        super();
        this.frame = 0;
        this.J = 0;
        this.meshList = [];

        this.prepareMesh = this.prepareMesh.bind(this);
        this.checkIntersection = this.checkIntersection.bind(this);
        this.getDistortion = this.getDistortion.bind(this);
        this.clearLines = this.clearLines.bind(this);
        this.datUpdate = this.datUpdate.bind(this);

        let Params = function(){
            this.amount = 15;
            this.color = 0xffffff;//黄緑C7FF73
            // this.color = "#ffffff";
            this.lineWidthMax = 0.3;
            this.lineWidthMin = 0.1;
            this.dashArray = 0.2;//黄緑0.2  白0.3
            this.dashRatio = 0.1;//黄緑0.1  白0.6
            this.dashGradate = 0.9;////黄緑0.9  白1.7 白は1.7以上じゃないと見えない。他の色は下げても見える。
            this.backGradate = 0.8;
            this.dashOffsetSpeed = 0.004;

            this.xAmp = 30;
            this.xFreq = 2.5;
            this.yAmp = -40;
            this.yFreq = 3.5;

        };

        this.params = new Params();
        var gui = new dat.GUI();

        var folder1 = gui.addFolder('line propaty');
            folder1.add( this.params, "color");
            // folder.add( this.params, 'color').onChange( this.datUpdate );
            folder1.add( this.params, 'amount', 5, 30 ).onChange( this.datUpdate );
            folder1.add( this.params, 'lineWidthMax', 0.0, 1.5 ).onChange( this.datUpdate );
            folder1.add( this.params, 'lineWidthMin', 0.0, 1.5 ).onChange( this.datUpdate );
            folder1.add( this.params, 'dashArray', 0, 1 ).onChange( this.datUpdate );
            folder1.add( this.params, 'dashRatio', 0, 1 ).onChange( this.datUpdate );
            folder1.add( this.params, 'dashGradate', 0.0, 3.0 ).onChange( this.datUpdate );
            folder1.add( this.params, 'backGradate', 0.01, 1.0 ).onChange( this.datUpdate );
            folder1.add( this.params, 'dashOffsetSpeed', 0, 0.01 );
        folder1.open();

        var folder2 = gui.addFolder('curve propaty');
            folder2.add( this.params, 'xAmp', -150, 150 );
            folder2.add( this.params, 'xFreq', 1, 5 );
            folder2.add( this.params, 'yAmp', -150, 150 );
            folder2.add( this.params, 'yFreq', 1, 5 );
        folder2.open();

        for(let i =0; i <this.params.amount; i++){
            this.prepareMesh(i);
        }

    }

    datUpdate() {

        this.clearLines();

        for(let i =0; i <this.params.amount; i++){
            this.prepareMesh(i);
        }

    }

    clearLines() {

        for(let i =0; i <this.meshList.length; i++){
            this.remove(this.meshList[i]);
        }
        this.meshList = [];//これもう一度つくらないとmeshListに保存されたままになってしまう
    }



    prepareMesh(i) {

        var geo = new Float32Array( 400 * 3 );//点は100個
        for( var j = 0; j < geo.length; j += 3 ) {//最初の点の位置。全部いれてる
            let distortion  = this.getDistortion(j/geo.length);
            geo[ j ] = distortion.x ;
            geo[ j + 1 ] = distortion.y; 
            geo[ j + 2 ] = j/3*2 ;
        }

        var g = new MeshLine();
        g.setGeometry( geo, function( p ) { return p; } );//function( p ) 

        let material = new MeshLineMaterial( {
            //固定
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 1.0,
            dashOffset: Maf.randomInRange(0.0, 1.0),

            //datで変えられる
            lineWidth: Maf.randomInRange( this.params.lineWidthMin, this.params.lineWidthMax),
            dashArray: this.params.dashArray,
            dashRatio: this.params.dashRatio,
            dashGradate: this.params.dashGradate,
            backGradate: this.params.backGradate,
            // color: new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ),
            // color: this.params.color
            // color: new THREE.Color(this.params.color)
            color: 0xffffff
        });

        this.mesh = new THREE.Mesh( g.geometry, material );//.geometry = new THREE.BufferGeometry()
        this.mesh.geo = geo;
        this.mesh.g = g;

        if(i ==0 ){
            this.mesh.position.set(0,0,0);
        }else {
            this.mesh.position.set(
                // Maf.randomInRange(-25, 25),
                (i-(this.params.amount/2))*4,
                Maf.randomInRange(-20, 0),
                Maf.randomInRange(-10, 10),
            );
        }
        // this.mesh.position.set((i-(this.params.amount/2))*5, 0, 0);

        this.meshList.push(this.mesh);

        this.add( this.meshList[i]);

        // return this.mesh;
    }

    checkIntersection(i){

        var geo = this.meshList[i].geo;
        var g = this.meshList[i].g;

        // var geo = this.mesh.geo;
        // var g = this.mesh.g;

        //これがないと生えていかない。
        for( var j = 0; j < geo.length; j+= 3 ) {
          geo[ j ] = geo[ j + 3 ] * 1.0;//0.9したらだんだん0になって直線になった
          geo[ j + 1 ] = geo[ j + 4 ] * 1.0;//0.9したらだんだん0になって直線になった
          geo[ j + 2 ] = geo[ j + 2 ];
        }

        let distortion  = this.getDistortion((geo.length+this.J)/geo.length);
        geo[ geo.length - 3 ] = distortion.x ;
        geo[ geo.length - 2 ] = distortion.y; 
        geo[ geo.length - 1 ] = geo[ geo.length - 1 ];
        if(i ==0){
        this.J += 3;
        }

        g.setGeometry( geo );

    }

    getDistortion(progress){

        let xAmp = this.params.xAmp;
        let xFreq = this.params.xFreq;
        let yAmp = this.params.yAmp;
        let yFreq = this.params.yFreq;

        return new THREE.Vector3( 
            xAmp * Math.sin(progress* Math.PI *xFreq*1) ,
            yAmp * Math.sin(progress* Math.PI *yFreq*1) ,
            0.
        );
    }


    update(){

            // this.frame += 1;
            // if(this.frame% 2 == 0){
                // this.checkIntersection(); 
                // this.mesh.material.uniforms.dashOffset.value += 0.003;
            // }
 
            for( let i =0; i< this.meshList.length; i++ ) { 
                this.checkIntersection(i); 
                this.meshList[i].material.uniforms.dashOffset.value -= this.params.dashOffsetSpeed;
                this.meshList[i].material.uniforms.color.value = new THREE.Color(this.params.color);
            }


    }

}

// const distortion_uniforms = {
// uDistortionX: new THREE.Uniform(new THREE.Vector2(80, 3)),
// uDistortionY: new THREE.Uniform(new THREE.Vector2(-40, 2.5))
// };

// const distortion_vertex = `
// #define PI 3.14159265358979
// uniform vec2 uDistortionX;
// uniform vec2 uDistortionY;

//     float nsin(float val){
//         return sin(val) * 0.5+0.5;
//     }
//     vec3 getDistortion(float progress){
//         progress = clamp(progress, 0.,1.);
//         float xAmp = uDistortionX.r;
//         float xFreq = uDistortionX.g;
//         float yAmp = uDistortionY.r;
//         float yFreq = uDistortionY.g;
//         return vec3( 
//             xAmp * nsin(progress* PI * xFreq   - PI / 2. ) ,
//             yAmp * nsin(progress * PI *yFreq - PI / 2.  ) ,
//             0.
//         );
//     }
// `;
  

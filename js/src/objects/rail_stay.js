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
        this.updateBool = false;

        this.createLines = this.createLines.bind(this);
        this.prepareMesh = this.prepareMesh.bind(this);
        this.checkIntersection = this.checkIntersection.bind(this);
        this.getDistortion = this.getDistortion.bind(this);

        // this.lineLength = 0;
        this.angle = 0;

        let Params = function(){
            this.curves = true;
            this.amount = 20;
            this.lineWidth = Maf.randomInRange( 0.3, 1.0);
            this.opacity = 1.0;
            this.dashArray = Maf.randomInRange(0.8, 1.5);
            this.dashOffset = Maf.randomInRange(0.0, 1.0);//(~~(Math.random()*60))*0.0001;
            this.dashRatio = 0.2;
            this.taper = 'none';
            this.strokes = false;
            this.sizeAttenuation = true;
            this.spread = false;
            // this.autoUpdate = true;//これ、DATでいれた値を反映させるのに大事！！！
            // this.animateVisibility = false;
            this.animateDashOffset = true;
        };

        this.params = new Params();

        this.createLines();

    }

    createLines() {
            this.prepareMesh();
            this.checkIntersection();
    }


    prepareMesh() {

        var geo = new Float32Array( 100 * 3 );//点は200個
        for( var j = 0; j < geo.length; j += 3 ) {
            geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;//最初の点の位置。全部いれてる
        }

        var g = new MeshLine();
        g.setGeometry( geo, function( p ) { return p; } );//function( p ) 


        var lineWidths = [];
        for(let i =0; i< this.params.amount; i++){
            let wid = Maf.randomInRange( 0.9, 1.0);
            lineWidths.push(wid);
        }

        
        let material = new MeshLineMaterial( {
            // depthTest: false,//これがないと隠れちゃって描画されなかった。。。

            // color: new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ),
            color: new THREE.Color( 0xffffff),
            opacity: this.params.opacity,
            dashArray: this.params.dashArray,
            dashOffset: this.params.dashOffset,
            dashRatio: this.params.dashRatio,
            lineWidth: this.params.lineWidth,
            transparent: true,
            side: THREE.DoubleSide

        });


        this.mesh = new THREE.Mesh( g.geometry, material );//.geometry = new THREE.BufferGeometry()
        this.mesh.geo = geo;
        this.mesh.g = g;

        this.add( this.mesh );

        this.updateBool = true;

        // return this.mesh;
    }

    checkIntersection(){

        var geo = this.mesh.geo;
        var g = this.mesh.g;

        // //これがないと生えていかない。
        // for( var j = 0; j < geo.length; j+= 3 ) {
        //   geo[ j ] = geo[ j + 3 ] * 0.09;
        //   geo[ j + 1 ] = geo[ j + 4 ] * 0.09;
        // //   geo[ j + 2 ] = geo[ j + 5 ] * 1.001;
        //     geo[ j + 2 ] = geo[ j + 2 ] ;
        // }

        // geo[ geo.length - 3 ] = d * Math.cos( this.angle );
        // // geo[ geo.length - 2 ] = intersects[ 0 ].point.y;
        // geo[ geo.length - 2 ] = -this.angle*1;
        // geo[ geo.length - 1 ] = d * Math.sin( this.angle );


        for( var j = 0; j < geo.length; j+= 3 ) {
            // let distortion  = getDistortion((-j/3*10+ uTravelLength / 2.) / uTravelLength);
            let distortion  = this.getDistortion(j/geo.length/3* 700);
            geo[ j ] = distortion.x;
            geo[ j + 1 ] = distortion.y; 
            geo[ j + 2 ] = j/3*5;
        }

        // for( var j = 0; j < geo.length; j+= 3 ) {
        //   geo[ j ] = d * Math.sin( (this.angle +(j/3))*8*Math.PI/180);
        //   geo[ j + 1 ] = 0;
        //   geo[ j + 2 ] = j/3 *20;
        // }

        g.setGeometry( geo );

    }

    getDistortion(progress){

        let uDistortionX = new THREE.Vector2(20, 3);
        let uDistortionY = new THREE.Vector2(-50, 2);

        let xAmp = uDistortionX.x;
        let xFreq = uDistortionX.y;
        let yAmp = uDistortionY.x;
        let yFreq = uDistortionY.y;

        this.angle+=1;
        if(this.angle >360){this.angle = 0;}

        return new THREE.Vector3( 
            // xAmp * Math.sin(10000*(progress* Math.PI/180 * xFreq   - Math.PI/180 / 2. )) ,
            // yAmp * Math.sin(10000*(progress * Math.PI/180 *yFreq - Math.PI/180 / 2.  )) ,
            xAmp * Math.sin(progress* Math.PI/180 * xFreq) ,
            yAmp * Math.sin(progress * Math.PI/180 *yFreq) ,
            0.
        );
    }


    update(){
        console.log(this.updateBool);
        if(this.updateBool == true){
            this.frame += 1;
            if(this.frame% 4 == 0){
                // for( var i in this.mesheList ) { this.checkIntersection(i); }
                // this.checkIntersection(); 

                this.mesh.material.uniforms.dashOffset.value += 0.06;
            }
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
  

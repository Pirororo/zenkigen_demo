// import {MeshLine, MeshLineMaterial} from "three.meshline";
// import * as THREE from "three";

import { convertCSVtoArray2D, loadCSV } from "../utils/AssetsLoader.js";

export default class Rails extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor(){
        super();


        //csvからのデータ取得
        this.getDateValue = this.getDateValue.bind(this);
        this.loadCSVandConvertToArray2D = this.loadCSVandConvertToArray2D.bind(this);
        this.dateValue = 0;
        this.data = [];
        this.loadCSVandConvertToArray2D();
        this.DATAisOK = false;

        this.frame = 0;
        this.Times = 0;

        this.amp = 30;
        this.amp2 = 20
        this.freq = 2 *(Math.sin(this.frame * 0.01));
        this.shakeList = [];
        this.geoyList = [];
        this.meshList = [];


        this.createLines = this.createLines.bind(this);
        this.prepareMesh = this.prepareMesh.bind(this);
        this.checkIntersection = this.checkIntersection.bind(this);
        this.angle = 0;

        let Params = function(){
            // this.curves = true;
            // this.amount = 20;
            // this.lineWidth = 0.2;
            // this.lineWidth = Math.random(0.1,1);
            
            // this.dashArray = 0.9;
            // this.dashOffset = 0;
            // this.dashRatio = 0.1;
            // this.taper = 'wavy';
            // this.strokes = true;
            // // this.sizeAttenuation = false;
            // this.animateWidth = true;
            // // this.spread = false;
            // // this.autoUpdate = true;//これ、DATでいれた値を反映させるのに大事！！！
            // this.animateVisibility = true;
            // this.animateDashOffset = true;


            // this.amount = 100;
            // this.lineWidth = 0.2;
            this.dashArray = 0.9;
            this.dashOffset = 0;
            this.dashRatio = 0.1;
            this.strokes = false;
            // this.sizeAttenuation = true;
            this.animateWidth = false;
            this.spread = false;
            this.autoRotate = true;
            this.autoUpdate = true;
            this.animateVisibility = false;
            this.animateDashOffset = false;
        };
        this.params = new Params();
    }

    createLines() {
        for(let i =0; i < 7; i++){
            this.prepareMesh(i);
        }
    }


    prepareMesh(i) {

        // var geo = new Float32Array( 50 * 3 );//点は200個
        // for( var j = 0; j < geo.length; j += 3 ) {
        //     geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;//最初の点の位置。全部いれてる
        // }

        var TimeNum = 30;//基準点の数
        var pointNum = 500;

        var posX = [];
        var posY = [];
        var posZ = [];
        for(let Time =0; Time < TimeNum; Time++){
            posX[Time] = 25*(Time - TimeNum/2);
            posY[Time] = this.getDateValue(Time, i);
            posZ[Time] = 25*Math.sin(Time*Math.PI/180);
        }
        // posY[i] = this.getDateValue(ix+this.time, 0);

        // var curve = new THREE.CatmullRomCurve3( [
        //     new THREE.Vector3( -450, posY[0], 50 ),
        //     new THREE.Vector3( -300, posY[1], 0 ),
        //     new THREE.Vector3( -150, posY[2], -50 ),
        //     new THREE.Vector3( 0, posY[3], 0 ),
        //     new THREE.Vector3( 150, posY[4], 50 ),
        //     new THREE.Vector3( 300, posY[5], 0 ),
        //     new THREE.Vector3( 450, posY[6], -50 ),
        // ] );


        var curveList = [];
        for(let Time =0; Time < TimeNum; Time++){
            curveList.push(new THREE.Vector3( posX[Time], posY[Time], posZ[Time] ));
        }
        // var curve = new THREE.CatmullRomCurve3(curveList, true,"centripetal");//centripetal, chordal and catmullrom.
        var curve = new THREE.CatmullRomCurve3(curveList);

        var points = curve.getPoints(pointNum);
        console.log(points[12].x);
        // var geo = new THREE.Geometry().setFromPoints( points );
        var geo = new Float32Array( pointNum * 3 );//点は200個
        var shake = [];
        var geoy = [];

        for( var j = 0; j < geo.length; j+= 3 ) {
            geo[ j ] = points[j/3].x;
            shake[j/3] = this.amp *Math.sin(geo[ j ] * this.freq * Math.PI/180);
            geoy[j/3] = points[j/3].y;
            geo[ j + 1 ] = geoy[j/3] + shake[j/3];
            geo[ j + 2 ] = points[j/3].z;
        }

        var g = new MeshLine();
        //taper:wavy
        g.setGeometry( geo, function( p ) { return 1 + Math.sin( 50 * p * i ) } ); 

        var opacitys = [];
        for(let i =0; i< this.params.amount; i++){
            let opc = Maf.randomInRange( 0.6, 1.0);
            opacitys.push(opc);
        }

        var lineWidths = [];
        for(let i =0; i< this.params.amount; i++){
            let wid = Maf.randomInRange( 0.9, 1.0);
            lineWidths.push(wid);
        }
        
        var dashArrays = [];
        for(let i =0; i< this.params.amount; i++){
            let arrays= Maf.randomInRange(0.2, 4);
            dashArrays.push(arrays);
        }
        
        var dashOffsets = [];
        for(let i =0; i< this.params.amount; i++){
            let offs= (~~(Math.random()*60))*0.0001;
            dashOffsets.push(offs);
        }
        

        // var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );
        let params = this.params;
        let material = new MeshLineMaterial( {
            // lineWidth: 0.2,
            // // depthTest: false,//これがないと隠れちゃって描画されなかった。。。
            // // map: strokeTexture,
            // // useMap: this.params.strokes,

            // color: new THREE.Color( 0xffffff),
            // opacity: 0.3,
            // dashArray: this.params.dashArray,
            // dashOffset: dashOffsets[ ~~Maf.randomInRange( 0, dashOffsets.length ) ],
            // dashRatio: this.params.dashRatio,
            // transparent: true,
            // side: THREE.DoubleSide



            // map: strokeTexture,
            useMap: params.strokes,
            // color: new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ),
            color: new THREE.Color( 0xffffff),
            opacity: 0.05,//params.strokes ? .5 : 1,
            dashArray: params.dashArray,
            dashOffset: params.dashOffset,
            dashRatio: params.dashRatio,
            // resolution: resolution,
            // sizeAttenuation: params.sizeAttenuation,
            // lineWidth: params.lineWidth,
            lineWidth: Math.random(0.01,0.05),
            // near: camera.near,
            // far: camera.far,
            // depthWrite: false,
            // depthTest: !params.strokes,
            // alphaTest: params.strokes ? .5 : 0,
            transparent: true,
            side: THREE.DoubleSide,

        });

        
        this.shakeList.push(shake);
        this.geoyList.push(geoy);

        this.mesh = new THREE.Mesh( g.geometry, material );//.geometry = new THREE.BufferGeometry()
        this.mesh.geo = geo;
        this.mesh.g = g;

        // this.add( this.mesh );
        this.meshList.push(this.mesh);
        this.add( this.meshList[i] );

        // return this.mesh;
    }


    checkIntersection(i){

        var geo = this.meshList[i].geo;
        var g = this.meshList[i].g;
        
        var shake = this.shakeList[i];
        var geoy = this.geoyList[i];

        this.angle+=1;
        if(this.angle >360){this.angle = 0;}

        for( var j = 0; j < geo.length; j+= 3 ) {
          geo[ j ] = geo[ j ] * 1.0;
          shake[j/3] = this.amp *Math.sin(geo[ j ] * this.freq * Math.PI/180);
          geoy[j/3] = geoy[j/3 + 1];
          geo[ j + 1 ] = geoy[j/3] + shake[j/3];
        //   geo[ j + 1 ] = geo[ j + 4 ] * 1.0 + this.shake[j/3];
          geo[ j + 2 ] = geo[ j + 5 ] * 1.0;
        }

        geo[ geo.length - 3 ] = geo[ geo.length - 3 ];
        shake[shake.length -1] = this.amp *Math.sin(geo[ geo.length - 3 ] * this.freq * Math.PI/180) ;
        geoy[geoy.length -1] = geoy[0];
        geo[ geo.length - 2 ] = geoy[geoy.length -1] + shake[geo.length -1];
        // geo[ geo.length - 2 ] = geo[1] + this.shake[geo.length -1];
        geo[ geo.length - 1 ] = geo[2];

        // //Create a closed wavey loop
        // var curve = new THREE.CatmullRomCurve3( [
        //     new THREE.Vector3( -10, 0, 10 ),
        //     new THREE.Vector3( -5, 5, 5 ),
        //     new THREE.Vector3( 0, 0, 0 ),
        //     new THREE.Vector3( 5, -5, 5 ),
        //     new THREE.Vector3( 10, 0, 10 )
        // ] );

        // var points = curve.getPoints( 50 );
        // var geo = new THREE.BufferGeometry().setFromPoints( points );

        // var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

        // // Create the final object to add to the scene
        // var curveObject = new THREE.Line( geometry, material );

        //taper:wavy
        g.setGeometry( geo, function( p ) { return 1.1 + 0.4*Math.sin( 70 * p + (i*10)) } ); 
        // g.setGeometry( geo); 

    }

    getDateValue(ix,iy){
        this.dateValue = (this.data[ix][iy+1])*0.00000001*0.8 -50;
        // console.log(this.data[this.Times][2*this.where + this.inout]*1);
        return this.dateValue;
    }

    loadCSVandConvertToArray2D(){
        loadCSV("../RoomTest2/js/src/data/kanto_7area_raw_short.csv", e =>{
            const result = e.result;
            this.data = convertCSVtoArray2D(result);
            console.log(this.data[0][1]);
            this.DATAisOK = true;
            this.createLines();
        });
    }


    update(){
        this.frame += 1;
        if(this.frame% 2 == 0){
            for(let i =0; i < 7; i++){
            // for( var i in this.meshList ) { 
                
                this.freq = (Math.sin(this.frame * 0.005))*0.3 +0.7;
                this.checkIntersection(i); 
            }
            
            // if( params.animateWidth ) l.material.uniforms.lineWidth.value = params.lineWidth * ( 1 + .5 * Math.sin( 5 * t + i ) );
		    // if( params.autoRotate ) l.rotation.y += .125 * delta;
			// l.material.uniforms.visibility.value= params.animateVisibility ? (time/3000) % 1.0 : 1.0;
            // l.material.uniforms.dashOffset.value -= params.animateDashOffset ? 0.01 : 0;



            // this.mesh.material.uniforms.lineWidth.value = ( 1 + .5 * Math.sin( 5 * this.frame) );

            // this.meshList.forEach( function( l, i ) {
            //     l.material.uniforms.lineWidth.value = params.lineWidth * ( 1 + .5 * Math.sin( 5 * t + i ) );
            // //     l.material.uniforms.dashOffset.value += 0.03;
            // } );
            // this.mesh.material.uniforms.dashOffset.value += 0.03;
        }
    }
}


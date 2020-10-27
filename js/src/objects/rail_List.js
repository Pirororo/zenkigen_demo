// import {MeshLine, MeshLineMaterial} from "three.meshline";
// import * as THREE from "three";


export default class Line extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor(where,inout){
        super();
        
        this.frame = 0;
        this.Times = 0;

        this.createLines = this.createLines.bind(this);
        this.prepareMesh = this.prepareMesh.bind(this);
        this.checkIntersection = this.checkIntersection.bind(this);
        this.getlineLength = this.getlineLength.bind(this);

        this.meshList = [];
        this.meshGeolist = [];
        this.meshMatlist = [];

        this.lineLength = 0;
        this.angle = 0;

        let Params = function(){
            this.curves = true;
            this.amount = 20;
            // this.lineWidth = Math.random(0,2);
            
            // this.dashArray = 0.1;
            this.dashOffset = 0;
            this.dashRatio = 0.8;
            this.taper = 'none';
            this.strokes = false;
            this.sizeAttenuation = true;
            // this.animateWidth = false;
            this.spread = false;
            // this.autoUpdate = true;//これ、DATでいれた値を反映させるのに大事！！！
            // this.animateVisibility = false;
            this.animateDashOffset = true;
        };

        this.params = new Params();

        this.createLines();

    }

    createLines() {
        for( var i = 0; i < this.params.amount; i++ ) {
            this.prepareMesh();
        }
    }


    prepareMesh() {

        var geo = new Float32Array( 50 * 3 );//点は200個
        for( var j = 0; j < geo.length; j += 3 ) {
            geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = 0;//最初の点の位置。全部いれてる
        }

        var g = new MeshLine();
        g.setGeometry( geo, function( p ) { return p; } );//function( p ) 


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
        
        let material = new MeshLineMaterial( {
            // color: 0xffffff,
            // lineWidth: 1.6,//0.4
            // depthTest: false,//これがないと隠れちゃって描画されなかった。。。

            // map: strokeTexture,
            useMap: this.params.strokes,
            // color: new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ),
            color: new THREE.Color( 0xffffff),
            opacity: opacitys[ ~~Maf.randomInRange( 0, opacitys.length ) ],
            dashArray: dashArrays[ ~~Maf.randomInRange( 0, dashArrays.length ) ],
            dashOffset: dashOffsets[ ~~Maf.randomInRange( 0, dashOffsets.length ) ],
            dashRatio: this.params.dashRatio,
            // resolution: resolution,
            // sizeAttenuation: params.sizeAttenuation,
            // lineWidth: params.lineWidth,
            lineWidth: lineWidths[ ~~Maf.randomInRange( 0, lineWidths.length ) ],
            // near: camera.near,
            // far: camera.far,
            // depthWrite: false,
            // depthTest: !params.strokes,
            // alphaTest: params.strokes ? .5 : 0,
            transparent: true,
            side: THREE.DoubleSide

        });

        
        this.mesh = new THREE.Mesh( g.geometry, material );//.geometry = new THREE.BufferGeometry()
        this.mesh.geo = geo;
        this.mesh.g = g;

        this.add( this.mesh );

        this.meshList.push(this.mesh);

        console.log(this.meshList.length);

        // return this.mesh;
    }


    checkIntersection(){
    // checkIntersection(i){

        // this.mesh = this.meshes[ 0 ];
        // this.mesh = this.meshList[ i ];
        var geo = this.mesh.geo;
        var g = this.mesh.g;

        this.angle+=1;
        if(this.angle >360){this.angle = 0;}

        // var d = intersects[ 0 ].point.x;
        var d = 50;

        // //これがないと生えていかない。
        // for( var j = 0; j < geo.length; j+= 3 ) {
        //   geo[ j ] = geo[ j + 3 ] * 1.001;
        //   geo[ j + 1 ] = geo[ j + 4 ] * 1.001;
        //   geo[ j + 2 ] = geo[ j + 5 ] * 1.001;
        // }

        // geo[ geo.length - 3 ] = d * Math.cos( this.angle );
        // // geo[ geo.length - 2 ] = intersects[ 0 ].point.y;
        // geo[ geo.length - 2 ] = -this.angle*1;
        // geo[ geo.length - 1 ] = d * Math.sin( this.angle );

        for( var j = 0; j < geo.length; j+= 3 ) {
          geo[ j ] = j/3 *4;
        //   geo[ j ] = d * Math.sin( (this.angle +(j/3))*3*Math.PI/180);
          geo[ j + 1 ] = d * Math.sin( (this.angle +(j/3))*8*Math.PI/180);
          geo[ j + 2 ] = 0;
        //   geo[ j + 2 ] = i*5;
        }

        g.setGeometry( geo );

    }


    update(){
        this.frame += 1;
        if(this.frame% 4 == 0){
            // for( var i in this.meshList ) { this.checkIntersection(i); }
            this.checkIntersection(); 

            // for( let i =0; i< this.meshList.length; i++ ) { this.checkIntersection(i); }

            // this.meshList.forEach( function( l, i ) {
            //     // if( params.animateWidth ) l.material.uniforms.lineWidth.value = params.lineWidth * ( 1 + .5 * Math.sin( 5 * t + i ) );
            //     l.material.uniforms.dashOffset.value += 0.03;
                // this.checkIntersection(i);

            // } );
            // this.mesh.material.uniforms.dashOffset.value += 0.03;
        }


    }


    getlineLength(){

            return this.lineLength;

    }

}


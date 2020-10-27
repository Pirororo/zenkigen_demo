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
        this.createLines = this.createLines.bind(this);
        this.createLine = this.createLine.bind(this);
        this.makeLine = this.makeLine.bind(this);
        this.createCurve = this.createCurve.bind(this);

        //  console.log(positions);//30000個の中身全部[]
        // console.log(positions.length);//30000


        this.lines = [];

        var Params = function(){
            this.curves = true;
            this.amount = 100;
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

        window.addEventListener( 'load', this.init());

    }



    init() {
        this.createLines();
    }

    createLines() {
        for( var j = 0; j < this.params.amount; j++ ) {
            this.createLine(j);
        }
    }
    
    createLine(j) {
        if( this.params.curves ) this.makeLine( this.createCurve(j) );
    }
    


    //  clearLines() {
    //     this.lines.forEach( function( l ) {
    //       scene.remove( l );
    //     } );
    //     this.lines = [];
    //   }
    
    makeLine( geo ) {

        this.g = new MeshLine();
        switch( this.params.taper ) {
            case 'none': this.g.setGeometry( geo ); break;
        }

        // var colors = [
        //     0xed6a5a,
        //     0xf4f1bb,
        //     0x9bc1bc,
        //     0x5ca4a9,
        //     0xe6ebe0,
        //     0xf0b67f,
        //     0xfe5f55,
        //     0xd6d1b1,
        //     0xc7efcf,
        //     0xeef5db,
        //     0x50514f,
        //     0xf25f5c,
        //     0xffe066,
        //     0x247ba0,
        //     0x70c1b3
        // ];

        var opacitys = [];
        for(let i =0; i< this.params.amount; i++){
            let opc = Maf.randomInRange( 0.6, 1.0);
            // console.log(opc);
            opacitys.push(opc);
        }

        var lineWidths = [];
        for(let i =0; i< this.params.amount; i++){
            let wid = Maf.randomInRange( 0.9, 1.0);
            // console.log(wid);
            lineWidths.push(wid);
        }
        
        var dashArrays = [];
        for(let i =0; i< this.params.amount; i++){
            let arrays= Maf.randomInRange(0.2, 4);
            // console.log(arrays);
            dashArrays.push(arrays);
        }
        
        var dashOffsets = [];
        for(let i =0; i< this.params.amount; i++){
            let offs= (~~(Math.random()*60))*0.0001;
            // console.log(offs);
            dashOffsets.push(offs);
        }


        var material = new MeshLineMaterial( {
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

        var mesh = new THREE.Mesh( this.g.geometry, material );
        this.add( mesh );
        this.lines.push( mesh );

    }

    createCurve(wid) {
        // let randomWid = Math.random()*window.innerWidth*0.2;
        // // console.log(window.innerWidth);//1440
        // var geometry = new THREE.Geometry();
        // for( var i = 0; i < 2; i++ ) {
        //     geometry.vertices.push( new THREE.Vector3(
        //         -window.innerWidth/10+ randomWid,
        //         window.innerHeight/4- window.innerHeight/4*i,
        //         0
        //     ));
        //     // geometry.vertices.push( new THREE.Vector3( -window.innerWidth/5 +(20*wid), window.innerHeight*i, 0));
        // }

        let randomX = Maf.randomInRange(-150, 150);
        let randomZ = Maf.randomInRange(-150, 150);
        // console.log(window.innerWidth);//1440
        var geometry = new THREE.Geometry();
        for( var i = 0; i < 2; i++ ) {
            geometry.vertices.push( new THREE.Vector3(
                randomX,
                -150+ (300*i),
                randomZ
                // Maf.randomInRange(-150, 150)
            ));
        }

        return geometry;
    }


    update(){
    // var delta = clock.getDelta();
    // var t = clock.getElapsedTime();
    this.lines.forEach( function( l, i ) {
        // if( params.animateWidth ) l.material.uniforms.lineWidth.value = params.lineWidth * ( 1 + .5 * Math.sin( 5 * t + i ) );
        // if( params.autoRotate ) l.rotation.y += .125 * delta;
        // 	l.material.uniforms.visibility.value= params.animateVisibility ? (time/3000) % 1.0 : 1.0;
        
        l.material.uniforms.dashOffset.value += 0.03;
    } );

    // console.log(this.lines.length);

    }

}


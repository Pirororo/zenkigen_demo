// import { Maf } from "../libs/Maf.js";
// import * as THREE from 'three/build/three.module';
import { convertCSVtoArray2D, loadCSV } from "../utils/AssetsLoader.js";

export default class Sea extends THREE.Object3D {

    constructor() {

        super();

        //csvからのデータ取得
        this.getDateValue = this.getDateValue.bind(this);
        this.loadCSVandConvertToArray2D = this.loadCSVandConvertToArray2D.bind(this);
        this.dateValue = 0;
        this.data = [];
        this.TimesList = [1,1,1,1,1,1,1,1,1,1,1,1,1,1];
        // this.loadCSVandConvertToArray2D();
        this.DATAisOK = false;



        //https://threejs.org/examples/?q=wave#webgl_points_waves
        this.SEPARATION = 20, this.AMOUNTX = 200, this.AMOUNTY = 200;
        // this.SEPARATION = 100, this.AMOUNTX = 250, this.AMOUNTY = 10;
        this.particles = 0, this.count = 0;

        var numParticles = this.AMOUNTX * this.AMOUNTY;

        var positions = new Float32Array( numParticles * 3 );
        var scales = new Float32Array( numParticles );

        var i = 0, j = 0;

        for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

            for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {

                positions[ i ] = ix * this.SEPARATION - ( ( this.AMOUNTX * this.SEPARATION ) / 2 ); // x
                positions[ i + 1 ] = 0; // y
                positions[ i + 2 ] = iy * this.SEPARATION - ( ( this.AMOUNTY * this.SEPARATION ) / 2 ); // z

                // positions[ i ] = 0.05*(ix * this.SEPARATION - ( ( this.AMOUNTX * this.SEPARATION ) / 2 )); // x
                // positions[ i + 1 ] = 0; // y
                // positions[ i + 2 ] = 0.01*( iy * this.SEPARATION - ( ( this.AMOUNTY * this.SEPARATION ) / 2 ))-200; // z

                scales[ j ] = 1;

                i += 3;
                j ++;

            }

        }

        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position',new THREE.BufferAttribute( positions,3));
        geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

        var material = new THREE.ShaderMaterial( {

            uniforms: {
                color: { value: new THREE.Color( 0x000000 ) },
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent

        } );

        //

        this.particles = new THREE.Points( geometry, material );

        this.add(this.particles);
    }

    getDateValue(i){
        //https://uxmilk.jp/11586
        //Where: 関東ー北海道 = 0, 関東ー中部 = 1,,,
        //InOut: in=1, out=2;
        // this.lineLength = (this.data[this.Times][i+1]-20)*0.005;//長さ調整
        i = i%14;
        // this.dateValue = (this.data[this.TimesList[ix]][ix])*0.1+10;
        this.dateValue = (this.data[this.TimesList[i]][i])*0.00000001;
        // this.dateValue = (this.data[this.TimesList[i]][i])-100000000;
        // console.log(this.data[this.Times][2*this.where + this.inout]*1);
        // console.log(this.dateValue);//console出すとフリーズする
        // 1811806451

        return this.dateValue;
    }

    loadCSVandConvertToArray2D(){
        loadCSV("../RoomTest2/js/src/data/kanto_7area_raw_short.csv", e =>{
            const result = e.result;
            this.data = convertCSVtoArray2D(result);
            
            // console.group();
            // console.log("Data from csv");
            // console.dir(this.data);
            console.log(this.data[0][1]);
            // console.groupEnd();

            this.DATAisOK = true;
        });
        // console.log(this.data[0][0]);//これは表示されない
    }

    update() {

        // if(this.DATAisOK == true){
        // camera.position.x += ( mouseX - camera.position.x ) * .05;
		// 		camera.position.y += ( - mouseY - camera.position.y ) * .05;
        

        var positions = this.particles.geometry.attributes.position.array;
        var scales = this.particles.geometry.attributes.scale.array;

        var i = 0, j = 0;

        for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

            for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {

                positions[ i + 1 ] = ( Math.sin( ( ix * 0.5 + this.count ) * 0.3 ) * 50 ) +
                                ( Math.sin( ( iy * 0.5 + this.count ) * 0.5 ) * 50 );

                scales[ j ] = ( Math.sin( ( ix * 0.5 + this.count ) * 0.3 ) + 1 ) * 8 +
                                ( Math.sin( ( iy * 0.5 + this.count ) * 0.5 ) + 1 ) * 8;

                // if(this.TimesList[i] >= 303){this.TimesList[i] =1;}
                // this.getDateValue(ix);
                // var xValue = this.dateValue;
                // this.getDateValue(iy);
                // var yValue = this.dateValue;
                // positions[ i + 1 ] = xValue + yValue;
                // scales[ j ] = (xValue + yValue )+1;
                // this.TimesList[i] += 1;

                i += 3;
                j ++;

            }

        // }

        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.scale.needsUpdate = true;
        
        // this.particles.rotation.y = Math.PI*45;

        
        this.count += 0.0002;
        }
    }
}

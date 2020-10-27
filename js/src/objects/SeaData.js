import * as THREE from '../../libs/three.module.js';
import { convertCSVtoArray2D, loadCSV } from "../utils/AssetsLoader.js";

export default class Sea extends THREE.Object3D {

    constructor() {

        super();

        //csvからのデータ取得
        this.getDateValue = this.getDateValue.bind(this);
        this.loadCSVandConvertToArray2D = this.loadCSVandConvertToArray2D.bind(this);
        this.dateValue = 0;
        this.data = [];
        this.loadCSVandConvertToArray2D();
        this.DATAisOK = false;
        this.time = 0;
        this.frame = 0;


        //https://threejs.org/examples/?q=wave#webgl_points_waves
        this.SEPARATION = 20, this.AMOUNTX = 200, this.AMOUNTY = 200;
        this.particles = 0;
        var numParticles = this.AMOUNTX * this.AMOUNTY;
        var positions = new Float32Array( numParticles * 3 );
        this.targetPositions = new Float32Array( numParticles * 3 );
        var scales = new Float32Array( numParticles );
        var i = 0, j = 0;

        for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
            for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
                positions[ i ] = ix * this.SEPARATION - ( ( this.AMOUNTX * this.SEPARATION ) / 2 ); // x
                positions[ i + 1 ] = 0; // y
                positions[ i + 2 ] = iy * this.SEPARATION - ( ( this.AMOUNTY * this.SEPARATION ) / 2 ); // z
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
            vertexShader: vertexshader,
            fragmentShader: fragmentshader
        } );

        this.particles = new THREE.Points( geometry, material );
        this.add(this.particles);
    }

    getDateValue(ix,iy){
        iy = iy%14 +1;
        ix = ix%303 +1;
        this.dateValue = (this.data[ix][iy])*0.00000001;
        return this.dateValue;
    }

    loadCSVandConvertToArray2D(){
        loadCSV("./js/src/data/kanto_7area_raw_short.csv", e =>{
            const result = e.result;
            this.data = convertCSVtoArray2D(result);
            console.log(this.data[0][1]);
            this.DATAisOK = true;
        });
    }

    update() {
        
        if(this.frame%180 ==0){
            this.frame = 0;
            if(this.DATAisOK == true){
                var scales = this.particles.geometry.attributes.scale.array;
                var i = 0, j = 0;
                for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
                    for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
                        this.getDateValue(ix+this.time, iy);
                        this.targetPositions[ i + 1 ] = this.dateValue;
                        scales[ j ] = (this.dateValue )+1;
                        this.time += 1;
                        this.time = this.time%303;
                        i += 3;
                        j ++;
                    }
                }
                this.particles.geometry.attributes.scale.needsUpdate = true;
            }
        }
        this.frame += 1;

        var positions = this.particles.geometry.attributes.position.array;
        var i = 0;
        for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
            for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
                positions[ i + 1 ] += (this.targetPositions[ i + 1 ]-positions[ i + 1 ])*0.02;
                i += 3;
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
    }
}

const vertexshader = `
    attribute float scale;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        //gl_PointSize = clamp(scale * ( 200.0 / - mvPosition.z ), 0.1, 4.0);
        gl_PointSize = clamp(( 1000.0 / - mvPosition.z ), 0.1, 8.0)*1.2;
        gl_Position = projectionMatrix * mvPosition;
    }
`;
const fragmentshader = `
    uniform vec3 color;

    void main() {
    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
    gl_FragColor = vec4( color, 0.8 );
    }
`;

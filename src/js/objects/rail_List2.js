import { MeshLine, MeshLineMaterial } from "../libs/three.meshline_shaderCostum.js";
import { Maf } from "../libs/Maf.js";
import * as THREE from 'three/build/three.module';

export default class Line extends THREE.Object3D {

    /**
    * コンストラクターです。
    * @constructor
    */
    constructor() {
        super();
        this.frame = 0;
        this.J = 0;
        this.meshList = [];
        this.motion0Bool = true;
        this.motion1Bool, this.motion2Bool = false;

        this.prepareMesh = this.prepareMesh.bind(this);
        this.checkIntersection = this.checkIntersection.bind(this);
        this.getDistortion = this.getDistortion.bind(this);
        this.clearLines = this.clearLines.bind(this);
        this.datUpdate = this.datUpdate.bind(this);


        //光らせる
        let Params = function () {
            this.amount = 15;
            this.color = 0xF1F4FF;
            this.lineWidthMax = 1.5;
            this.lineWidthMin = 2.0;
            this.dashArray = 0.9;
            this.dashRatio = Maf.randomInRange(0.1, 0.3)
            this.dashGradate = 1.3;
            this.backGradate = 0.4;
            this.dashOffsetSpeed = 0.015
        };

        let ParamsWave = function () {
            this.xAmp = 0;
            this.xFreq = 0;
            this.yAmp = 45;
            this.yFreq = 2.5;
        }

        this.params = new Params();
        this.paramsWave = new ParamsWave();

        for (let i = 0; i < this.params.amount; i++) {
            this.prepareMesh(i);
        }
    }

    datUpdate() {
        this.clearLines();
        for (let i = 0; i < this.params.amount; i++) {
            this.prepareMesh(i);
        }
    }

    clearLines() {
        for (let i = 0; i < this.meshList.length; i++) {
            this.remove(this.meshList[i]);
        }
        this.meshList = [];
    }

    prepareMesh(i) {
        var geo = new Float32Array(100 * 3);
        for (var j = 0; j < geo.length; j += 3) {
            let distortion = this.getDistortion(j / geo.length);
            geo[j] = distortion.x;
            geo[j + 1] = distortion.y;
            geo[j + 2] = j / 3 * 2 * 3;
        }

        var g = new MeshLine();
        g.setGeometry(geo, function (p) { return p; });

        let material = new MeshLineMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            dashOffset: Maf.randomInRange(0.0, 2.0),

            lineWidth: Maf.randomInRange(this.params.lineWidthMin, this.params.lineWidthMax),
            dashArray: this.params.dashArray,
            dashRatio: this.params.dashRatio,
            dashGradate: this.params.dashGradate,
            backGradate: this.params.backGradate,
            color: this.params.color
        });

        this.mesh = new THREE.Mesh(g.geometry, material);
        this.mesh.geo = geo;
        this.mesh.g = g;

        if (i == 0) {
            this.mesh.position.set(0, 0, 0);
        } else {
            this.mesh.position.set(
                ((60 * 2) / this.params.amount * i) - 60,
                Maf.randomInRange(-30, -5),
                Maf.randomInRange(0, 40)
            );
        }
        this.meshList.push(this.mesh);
        this.add(this.meshList[i]);
    }

    checkIntersection(i) {
        var geo = this.meshList[i].geo;
        var g = this.meshList[i].g;

        for (var j = 0; j < geo.length; j += 3) {
            geo[j] = geo[j + 3] * 1.0;
            geo[j + 1] = geo[j + 4] * 1.0;
            geo[j + 2] = geo[j + 2];
        }

        if (this.motion0Bool == true) {
            let distortion = this.getDistortion((geo.length + this.J) / geo.length);
            geo[geo.length - 3] = distortion.x;
            geo[geo.length - 2] = distortion.y;
            geo[geo.length - 1] = geo[geo.length - 1];
            if (i == 0) { this.J += 3; }
        }

        if (this.motion1Bool == true) {
            let distortion = this.getDistortion((geo.length + this.J) / geo.length);
            geo[geo.length - 3] = distortion.x;
            geo[geo.length - 2] = distortion.y;
            geo[geo.length - 1] = geo[geo.length - 1];
            if (i == 0) { this.J += 3; }
        }

        g.setGeometry(geo);
    }


    getDistortion(progress) {

        this.disp = function (para) {
            this.xAmp = para.xAmp;
            this.xFreq = para.xFreq;
            this.yAmp = para.yAmp;
            this.yFreq = para.yFreq;
        }

        this.disp(this.paramsWave);

        return new THREE.Vector3(
            this.xAmp * Math.sin(progress * Math.PI * this.xFreq * 1),
            this.yAmp * Math.sin(progress * Math.PI * this.yFreq * 1),
            0.0
        );
    }

    update() {
        for (let i = 0; i < this.meshList.length; i++) {
            this.checkIntersection(i);
            this.meshList[i].material.uniforms.dashOffset.value -= this.params.dashOffsetSpeed;
        }
    }
}

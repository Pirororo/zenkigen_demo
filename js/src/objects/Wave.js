export default class Wave extends THREE.Object3D {
    /**
     * コンストラクターです。
     * @constructor
     */
    constructor() {
  
        super();
    
        this.frame = 0;

        // http://yomotsu.net/blog/2012/12/01/create-terrain-with-threejs.html
        this.simplexNoise = new SimplexNoise;
        this.geometry = new THREE.PlaneGeometry(800, 100, 16, 16);

        this.planeMesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial({
            // new THREE.MeshPhongMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: true
            })
        );


        for ( let i = 0; i < this.geometry.vertices.length; i++ ) {
            var vertex = this.geometry.vertices[ i ];
            vertex.z = 20 *Math.sin( (i%(16+1)) *30*Math.PI/180)+5*this.simplexNoise.noise( vertex.x / 10, vertex.y / 10 );
        }
        // console.log(this.geometry.vertices);//4425

        this.planeMesh.position.set(0,-100,0);
        this.planeMesh.receiveShadow = true;
        this.add(this.planeMesh);


        // this.boxGeo = new THREE.Box

    }

    update(){

        this.frame += 1;
        if(this.frame > 130){this.frame = 0;} 

        for ( let i = 0; i < this.geometry.vertices.length; i++ ) {
            var vertex = this.geometry.vertices[ i ];
            vertex.z = 30 *Math.sin( (i%(16+1)+this.frame/6) *30 *Math.PI/180)+20*this.simplexNoise.noise( vertex.x / 5, vertex.y / 5 );
        }
        this.geometry.verticesNeedUpdate = true;
        // this.planeMesh.geometry.attributes.position.needsUpdate = true;




    }

}
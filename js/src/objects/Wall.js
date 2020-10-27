export default class PictWaver extends THREE.Object3D {
// class LightsSticks {
    constructor() {

      super();
      this.time = 0;

      // uniform変数を定義
      this.uniforms = {
        "uTime" : { type: "f", value: 0.0 },
        "uResolution" : { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight ) }
      };
    //   const geometry = new THREE.PlaneBufferGeometry(1, 1);
      const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

      const material = new THREE.ShaderMaterial({
        fragmentShader: sideSticksFragment,
        vertexShader: sideSticksVertex,
        // This ones actually need double side
        side: THREE.DoubleSide,
        uniforms: this.uniforms,
        // map: texture
      });

    //   material.onBeforeCompile = shader => {
    //     shader.vertexShader = shader.vertexShader.replace(
    //       "#include <getDistortion_vertex>",
    //       options.distortion.getDistortion
    //     );
    //   };

      this.mesh = new THREE.Mesh(geometry, material);
      this.add(this.mesh);
    //   this.mesh = mesh;
  
    //   const mesh = new THREE.Mesh(instanced, material);
    //   // The object is behind the camera before the vertex shader
    //   mesh.frustumCulled = false;
    //   // mesh.position.y = options.lightStickHeight / 2;
    //   this.webgl.scene.add(mesh);
    //   this.mesh = mesh;
    }
    update() {
      this.time+=1;
      this.mesh.material.uniforms.uTime.value = this.time*0.03;
    }
}
  
const sideSticksVertex = `

  void main(){
      // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      gl_Position = vec4( position, 1.0 );
  }
`;
const sideSticksFragment = `

  uniform vec2 uResolution;
  uniform float uTime;
  uniform sampler2D uTex;

      vec3 palette(in float time, in vec3 colorA, in vec3 colorB, in vec3 colorC, in vec3 colorD) {
          return colorA + colorB * cos(6.28318 * (colorC * time + colorD));
      }

      void main() {
          vec2 position = gl_FragCoord.xy / uResolution;
          
          vec3 blue = vec3(0.184, 0.788, 0.902);
          vec3 green = vec3(0.651, 0.851, 0.294);
          vec3 purple = vec3(0.714, 0.357, 0.945);
          vec3 white = vec3(1.0, 1.0, 1.0);
          
          float time = uTime * 0.1;
          vec2 c1 = vec2(sin(time) * 0.2, cos(uTime) * 0.07);
          vec2 c2 = vec2(sin(time * 0.7) * 0.9, cos(uTime * 0.65) * 0.6);
          
          float d1 = length(position - c1) * - 0.8;
          vec3 col1 = palette(d1 + time, blue, green , purple , white);
          
          float d2 = length(position - c2);
          vec3 col2 = palette(d2 + time, green, blue, purple, white);
          
          // vec3 color = vec3((col1 + col2) / 2.0));
          gl_FragColor = vec4((col1 + col2) / 2.0 , 1.0);

          // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
`;

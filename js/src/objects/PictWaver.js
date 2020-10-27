// http://naochang.me/?p=846

export default class PictWaver extends THREE.Object3D {
    constructor() {

      super();

      this.time = 0;
      var texture = new THREE.TextureLoader().load( '../RoomTest2/js/src/img/chacha.png' );//1024*1024
      // マウス座標
      this.mouseMoved = this.mouseMoved.bind(this);
      this.mouse = new THREE.Vector2(0.5, 0.5);

      // uniform変数を定義
      this.uniforms = {
        "uTime" : { type: "f", value: 0.0 },
        "uResolution" : { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight ) },
        // "uResolution" : { type: "v2", value: new THREE.Vector2(1024.0,1024.0 ) },
        "uTex" : { value: texture },
        // 逆アスペクト
        // "uFixAspect": { value: 1.0 },
        "uFixAspect": { value: window.innerHeight / window.innerWidth },
        "uMouse": { value: this.mouse }
      };
      // const geometry = new THREE.PlaneBufferGeometry(2,2,1,1);
      const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
      // const geometry = new THREE.PlaneGeometry(512, 512);

      const material = new THREE.ShaderMaterial({
        fragmentShader: sideSticksFragment,
        vertexShader: sideSticksVertex,
        // This ones actually need double side
        side: THREE.DoubleSide,
        uniforms: this.uniforms,
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
    mouseMoved(x, y) {
      // 左上原点から左下原点に変換
      this.mouse.x = x / window.innerWidth;
      this.mouse.y = 1.0 - (y / window.innerHeight);
    }
    update() {
      this.time+=1;
      this.mesh.material.uniforms.uTime.value = this.time*0.03;
      // this.uniforms.uMouse.value.lerp(this.mouse, 0.5);
      this.uniforms.uMouse.value = this.mouse;
      // console.log(this.mouse);//左下が(0,0),右上が(1,1)
    }
  }
  
  const sideSticksVertex = `
    
    uniform vec2 uResolution;
    uniform float uFixAspect;
    varying vec2 vUv;

    void main(){

        // 余白ができないようにアスペクト補正
        vUv = uv - .5;
        vUv.x *= uFixAspect;
        vUv += .5;
        gl_Position = vec4( position, 1.0 );
        // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;
  const sideSticksFragment = `

    uniform vec2 uResolution;
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTex;
    uniform vec2 uMouse;


        vec4 frag(vec2 position){
            vec2 gap = position - uMouse;

            float moveX = 0.0;
            float moveY = 0.0;
            float len = length(gap);
            float brightGap = 0.0;

            float _EffectRadius = 0.5;//
            float _Speed = 0.15;//
            float _Height = 2.3;//

            if(len <= _EffectRadius) {
                // float p = (-1.0/_EffectRadius * pow(len, 2.0) + _EffectRadius);
                float p = sqrt(pow(_EffectRadius, 2.0) - pow(gap.x, 2.0) - pow(gap.y, 2.0));
                moveX = p * _Height * 0.002 * (cos((len - uTime * _Speed) * 30.0));
                moveY = moveY;
        
                brightGap = _Height * 10.0 * (moveX + moveY) * cos(45.0); 
            }

            vec2 move = vec2(-moveX, -moveY);
            // vec4 color = (texture2D(uTex, position + move + _TextureSampleAdd));
            vec4 color = (texture2D(uTex, position + move));
            color.rgb += brightGap;
            return color;
        }

        void main() {
              vec2 p = gl_FragCoord.xy / uResolution *vUv;
              // vec2 p = gl_FragCoord.xy / vec2(1024.0, 1024.0) *vUv;
              vec4 destColor = frag(p);
              gl_FragColor = destColor; 
        }
  `;
  
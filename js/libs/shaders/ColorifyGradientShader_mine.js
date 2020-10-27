/**
 * @author Hiroko K
 *
 * Colorify shader
 */	

THREE.ColorifyGradientShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"color":    { value: new THREE.Color( 0xff0000 ) },
		"color2":    { value: new THREE.Color( 0xff0000 ) }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec3 color;",
		"uniform vec3 color2;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

			"vec3 luma = vec3( 0.299, 0.587, 0.114 );",
			"float v = dot( texel.xyz, luma );",

			"vec3 gradate = color * vUv.y + color2 * (1.0 - vUv.y);",

			// "gl_FragColor = vec4( v * color, texel.w );",
			"gl_FragColor = vec4(v * gradate, texel.w );",

		"}"

	].join( "\n" )

};

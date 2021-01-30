const fragmentShaderSrc = `      
		precision mediump float;  
		uniform vec4 vColor;   
        void main () {               
           gl_FragColor = vColor;
        }                            
	  `;

export default fragmentShaderSrc;

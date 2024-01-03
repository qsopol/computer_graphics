//script.js
var vertexShaderText = `
precision mediump float;

attribute vec3 vertPosition;
uniform mat4 u_Trans;
uniform mat4 u_RotX;
uniform mat4 u_RotY;
uniform mat4 u_Scale;
uniform mat4 u_Pers;

uniform mat4 u_Basis;
uniform mat4 u_Eye;

attribute vec3 vertNormal;
varying vec3 fragNormal;

attribute vec2 verTexCoord; 
varying vec2 fragTexCoord;


void main() {
    mat4 M = u_RotX * u_RotY *u_Trans *u_Scale;
    mat4 V = u_Basis*u_Eye;
    mat4 P = u_Pers;


    fragTexCoord = verTexCoord; //texture


    gl_Position = P * V * M * vec4(vertPosition, 1.0);
}
`;

var fragmentShaderText = `
precision mediump float;
varying vec2 fragTexCoord;
uniform sampler2D sampler;

void main() {


gl_FragColor =  texture2D(sampler, fragTexCoord);

}
`;


var canvas = document.getElementById("gl");
var gl = canvas.getContext('webgl');
if (!gl) {
    console.log("You use experimental-webgl, it's a browser problem? Not yours.");
    gl = canvas.getContext('experimental-webgl');
}
if (!gl) {
    alert('No WEBGL in the browser or the wrong version');

}
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));

}

gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));

}


function initGL_1() {

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program!', gl.getProgramInfoLog(program));
        return;
    }
    return program;

}


function initBuffers() {

    var boxVertices =
            [  // X,    Y,    Z       U, V
                // Top
                -1.0,  1.0, -1.0,     0, 0,
                -1.0,  1.0,  1.0,     0, 1,
                 1.0,  1.0,  1.0,     1, 1,
                 1.0,  1.0, -1.0,     1, 0,

                // Left
                -1.0,  1.0,  1.0,     0, 0,
                -1.0, -1.0,  1.0,     1, 0,
                -1.0, -1.0, -1.0,     1, 1,
                -1.0,  1.0, -1.0,     0, 1,

                // Right
                 1.0,  1.0,  1.0,     1, 1,
                 1.0, -1.0,  1.0,     0, 1,
                 1.0, -1.0, -1.0,     0, 0,
                 1.0,  1.0, -1.0,     1, 0,

                // Front
                 1.0,  1.0,  1.0,     1, 1,
                 1.0, -1.0,  1.0,     1, 0,
                -1.0, -1.0,  1.0,     0, 0,
                -1.0,  1.0,  1.0,     0, 1,

                // Back
                 1.0,  1.0, -1.0,     0, 0,
                 1.0, -1.0, -1.0,     0, 1,
                -1.0, -1.0, -1.0,     1, 1,
                -1.0,  1.0, -1.0,     1, 0,

                // Bottom
                -1.0, -1.0, -1.0,     1, 1,
                -1.0, -1.0,  1.0,     1, 0,
                 1.0, -1.0,  1.0,     0, 0,
                 1.0, -1.0, -1.0,     0, 1
            ];

    var boxIndices =
            [
                // Top
                0, 1, 2,
                0, 2, 3,

                // Left
                5, 4, 6,
                6, 4, 7,

                // Right
                8, 9, 10,
                8, 10, 11,

                // Front
                13, 12, 14,
                15, 14, 12,

                // Back
                16, 17, 18,
                16, 18, 19,

                // Bottom
                21, 20, 22,
                22, 20, 23
            ];
            
    
    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var texCoordAttribLocation = gl.getAttribLocation(program, "verTexCoord");
    
    
    gl.vertexAttribPointer(
            positionAttribLocation, 
            3, 
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, 
            0 
            );
    gl.vertexAttribPointer(
            texCoordAttribLocation, 
            2, 
            gl.FLOAT, 
            gl.FALSE, 
            5 * Float32Array.BYTES_PER_ELEMENT, 
            3 * Float32Array.BYTES_PER_ELEMENT 
            );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);
    
    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById('box_img')
	);
   
   
 canvas.addEventListener('click', function(event) {
     
    if (boxTexture === document.getElementById('box_img')) {
        boxTexture = document.getElementById('almaz_img');
    } else {
        boxTexture = document.getElementById('box_img');
    }
    gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		boxTexture
	);
});

    gl.bindTexture(gl.TEXTURE_2D, null);
    return boxTexture;
    
}

let rotationY = 0; 


document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown') {
        rotationY -= 6.0; 
    } else if (event.key === 'ArrowUp') {
        rotationY += 6.0; 
    };
});

function extraMatrix(program) {

    var perspMatrixLocation = gl.getUniformLocation(program, 'u_Pers');
    var aspect = 1.0;
    var fov = 75.0;
    var far = 10.0;
    var near = 1.0;
    var pa = 1.0 / (aspect * Math.tan((fov / 2) * Math.PI / 180));
    var pb = 1.0 / (Math.tan((fov / 2) * Math.PI / 180));
    var pc = -(far + near) / (far - near);
    var pd = -(2.0 * far * near) / (far - near);
    var persMat = new Float32Array([pa, 0.0, 0.0, 0.0,
        0.0, pb, 0, 0.0,
        0.0, 0.0, pc, -1.0,
        0.0, 0.0, pd, 0.0]);
    gl.uniformMatrix4fv(perspMatrixLocation, false, persMat);


    var basisMatrixLocation = gl.getUniformLocation(program, 'u_Basis');
    var eyeMatrixLocation = gl.getUniformLocation(program, 'u_Eye');

    var basisMat = new Float32Array([1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]);
//Переміщення
    var xe = 0.0;
    var ye = 0.3;
    var ze = 1.7;
    var eyeMat = new Float32Array([1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
        0, -xe, -ye, -ze, 1]);
    gl.uniformMatrix4fv(basisMatrixLocation, false, basisMat);
    gl.uniformMatrix4fv(eyeMatrixLocation, false, eyeMat);



    var animYMatrixLocation = gl.getUniformLocation(program, 'u_RotY');


    var angleInRadians2 = performance.now() / 2000 / 6 * 2 * Math.PI;
    var cos2 = Math.cos(angleInRadians2);
    var sin2 = Math.sin(angleInRadians2);
    var angleInRadians = (rotationY * Math.PI) / 180.0;
    var cos = Math.cos(angleInRadians);
    var sin = Math.sin(angleInRadians);
    var animXMatrixLocation = gl.getUniformLocation(program, 'u_RotX');
    var animXMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, cos, -sin, 0.0,
        0.0, sin, cos, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    gl.uniformMatrix4fv(animXMatrixLocation, false, animXMatrix);
    var animYMatrix = new Float32Array([
        cos2, 0.0, -sin2, 0.0,
        0.0, 1.0, 0.0, 0.0,
        sin2, 0.0, cos2, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    gl.uniformMatrix4fv(animYMatrixLocation, false, animYMatrix);

   

}
function draw_crate(program) {

    gl.useProgram(program);
       
    
    extraMatrix(program);
    var scaleMatrix1 = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 3.0
    ]);
    var scaleMatrixLocation = gl.getUniformLocation(program, 'u_Scale');
    gl.uniformMatrix4fv(scaleMatrixLocation, false, scaleMatrix1);


    var tansMatrixLocation = gl.getUniformLocation(program, 'u_Trans');
    var transMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    gl.uniformMatrix4fv(tansMatrixLocation, false, transMatrix);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

}

let program = initGL_1();

var boxTexture = initBuffers();

var loop = function () {
    gl.clearColor(0.2, 0.55, 0.7, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.activeTexture(gl.TEXTURE0);
    draw_crate(program);
    requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

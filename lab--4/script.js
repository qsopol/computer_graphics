

var VTShaderText = `
precision mediump float;

attribute vec3 vertPosition; 
attribute vec3 vertColor;    
varying vec3 fragColor;      
uniform mat4 u_Trans;        
uniform mat4 u_RotX;         
uniform mat4 u_RotY;         
uniform mat4 u_Scale;       
uniform mat4 u_Pers;        

uniform mat4 u_Basis;        
uniform mat4 u_Eye;          

void main() {
    mat4 M = u_RotX * u_RotY * u_Trans * u_Scale; 
    mat4 V = u_Basis * u_Eye;                      
    mat4 P = u_Pers;                               
    fragColor = vertColor;                         

    
    gl_Position = P * V * M * vec4(vertPosition, 1.0);
}
`;


var FTShaderText = `
precision mediump float;
varying vec3 fragColor; 

void main() {
    gl_FragColor = vec4(fragColor, 1.0); 
}
`;


var canvas = document.getElementById("gl");
var gl = canvas.getContext('webgl');
if (!gl) {
    console.log("Використовується experimental-webgl. Це проблема браузера чи ні?");
    gl = canvas.getContext('experimental-webgl');
}
if (!gl) {
    alert('WEBGL не підтримується в браузері або невірна версія.');
}


gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);


var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, VTShaderText);
gl.shaderSource(fragmentShader, FTShaderText);


gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ПОМИЛКА компіляції вершинного шейдера!', gl.getShaderInfoLog(vertexShader));
}


gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ПОМИЛКА компіляції фрагментного шейдера!', gl.getShaderInfoLog(fragmentShader));
}


function initGL_1() {
    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    
    gl.linkProgram(program);
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Помилка при валідації програми!', gl.getProgramInfoLog(program));
        return;
    }
    return program;
}


function initGL_2() {
    var program2 = gl.createProgram();
    gl.attachShader(program2, vertexShader);
    gl.attachShader(program2, fragmentShader);

    gl.linkProgram(program2);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Помилка лінкування програми!', gl.getProgramInfoLog(program));
        return;
    }
    return program2;
}


function initBuffers() {
    
    var BoxXYZ = [
        // X, Y, Z           R, G, B
        // Top 
        -1.0, 1.0, -1.0, 0.1, 0.4, 0.4, //green
        -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, //white
        1.0, 1.0, 1.0, 1.0, 0.4, 0.8, //pink
        1.0, 1.0, -1.0, 0.0, 0.9, 0.9,//turquoise 

        // Left 
        -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, //white
        -1.0, -1.0, 1.0, 1.0, 1.0, 0.0, //yellow
        -1.0, -1.0, -1.0, 0.1, 1.0, 0.3, // light green
        -1.0, 1.0, -1.0, 0.1, 0.4, 0.4, //green

        // Right 
        1.0, 1.0, 1.0, 1.0, 0.4, 0.8, //pink
        1.0, -1.0, 1.0, 0.8, 0.0, 0.9, //purple
        1.0, -1.0, -1.0, 0.5, 0.5, 1.0, //blue
        1.0, 1.0, -1.0, 0.0, 0.9, 0.9,//turquoise

        // Front 
        1.0, 1.0, 1.0, 1.0, 0.4, 0.8, //pink
        1.0, -1.0, 1.0, 0.8, 0.0, 0.9, //purple
        -1.0, -1.0, 1.0, 1.0, 1.0, 0.0, //yellow
        -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, //white

        // Back
        1.0, 1.0, -1.0, 0.0, 0.9, 0.9,//turquoise
        1.0, -1.0, -1.0, 0.5, 0.5, 1.0, //blue
        -1.0, -1.0, -1.0, 0.1, 1.0, 0.3, // light green
        -1.0, 1.0, -1.0, 0.1, 0.4, 0.4, //green

        // Bottom
        -1.0, -1.0, -1.0, 0.1, 1.0, 0.3, // light green
        -1.0, -1.0, 1.0, 1.0, 1.0, 0.0, //yellow
        1.0, -1.0, 1.0, 0.8, 0.0, 0.9, //purple
        1.0, -1.0, -1.0, 0.5, 0.5, 1.0, //blue
    ];

    
    var BOXDots = [
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(BoxXYZ), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(BOXDots), gl.STATIC_DRAW);

    
    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttribLocation = gl.getAttribLocation(program, "vertColor");

    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
}


let rotationY = 0; 
let rotationX = 0; 



document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        
        rotationY -= 5.0;
    } else if (event.key === 'ArrowRight') {
        
        rotationY += 5.0;
    }
    ;
    if (event.key === "ArrowDown") {
        if (rotationX > 0) {
            rotationX -= 1.0;
        }
    } else if (event.key === "ArrowUp") {
        if (rotationX < 3) {
            rotationX += 1.0;
        }
    }
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

   
    var xe = 0.0;
    var ye = 0.2;
    var ze = 2.1;
    var eyeMat = new Float32Array([1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
        0, -xe, -ye, -ze, 1]);
    gl.uniformMatrix4fv(basisMatrixLocation, false, basisMat);
    gl.uniformMatrix4fv(eyeMatrixLocation, false, eyeMat);



    var animYMatrixLocation = gl.getUniformLocation(program, 'u_RotY');

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
        cos, 0.0, -sin, 0.0,
        0.0, 1.0, 0.0, 0.0,
        sin, 0.0, cos, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    gl.uniformMatrix4fv(animYMatrixLocation, false, animYMatrix)
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

function draw_lid(program2) {

    
    gl.useProgram(program2);
    extraMatrix(program2);


    let widthLid = 0.05;
    var scaleMatrix2 = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, widthLid, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 1.0 + widthLid + 0.01, 0.0, 3.0
    ]);

    var scaleMatrixLocation = gl.getUniformLocation(program2, 'u_Scale');
    gl.uniformMatrix4fv(scaleMatrixLocation, false, scaleMatrix2);

    var tansMatrixLocation = gl.getUniformLocation(program2, 'u_Trans');
    
    var angleInRadians = (rotationX * 30.0 * Math.PI) / 180.0;
    var cos = Math.cos(angleInRadians);
    var sin = Math.sin(angleInRadians);
    let y = 0;
    let z = 0;
    switch (rotationX) {
        case 0:
            y = 0.0;
            z = 0.0;
            break;
        case 1:
            y = 0.22;
            z = 0.15;
            break;
        case 2:
            y = 0.47;
            z = 0.16;
            break;
        case 3:
            y = 0.68;
            z = 0.04;
            break;

        default:
            x = 0;
            y = 0;
            z = 0;
            break;
    }
    var transMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, cos, -sin, 0.0,
        0.0, sin, cos, 0.0,
        0.0, y, z, 1.0
        
    ]);
    gl.uniformMatrix4fv(tansMatrixLocation, false, transMatrix);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

}
let program = initGL_1();
let program2 = initGL_2();
initBuffers();
var loop = function () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    draw_crate(program);
    draw_lid(program2);
    requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

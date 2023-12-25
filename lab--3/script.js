
var VTShaderText = `
precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mScale;

void main() {
    fragColor = vertColor;
    gl_Position = mScale * mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`;


var FTShaderText = `
precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0); 
}
`;

function resizeCanvas() {
    var canvas = document.getElementById("gl");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


function initMy() {


    console.log("В init()");

    
    var canvas = document.getElementById("gl");
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("Вик-ться experimental-webgl. Це проблема браузера?");
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('WEBGL не підтримується або невірна версія.');
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
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ПОМИЛКА компіляції фрагментного шейдера!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ПОМИЛКА при посиланні', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ПОМИЛКА валідації', gl.getProgramInfoLog(program));
        return;
    }

    
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

    
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    
    gl.useProgram(program);

    
    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");
    var matScaleUniformLocation = gl.getUniformLocation(program, "mScale");

    
    var Sx = 0.8, Sy = 0.8, Sz = 0.8;
    var scaleMatrix = new Float32Array([
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -7], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, 45 * (Math.PI / 180), canvas.width / canvas.height, 0.1, 1000.0);

    
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    gl.uniformMatrix4fv(matScaleUniformLocation, gl.FALSE, scaleMatrix);

    
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    

    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 6, [0, 1, 0]);
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [1, 0, 0]);
        glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, BOXDots.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };

    
    requestAnimationFrame(loop);
    
}

window.addEventListener('resize', resizeCanvas);

window.addEventListener('load', function () {
    resizeCanvas();
    initMy() 

    
});

// B581-lab-04-starting-text.js
// CSCI B581 Advanced Computer Graphics
// Mitja Hmeljak - Fall 2015

var gl = null;
var modelViewInTheShader, projectionInTheShader;

var gModelViewMatrix = [
   1.0, 0.0, 0.0, 0.0, 
   0.0, 1.0, 0.0, 0.0,
   0.0, 0.0, 1.0, 0.0,
   0.0, 0.0, 0.0, 1.0
];

var gLabel;

//  TODO: you may want to use these globals to keep track of rotation & translation:
var dX = 0;
var dY = 0;
var dAngle = 0;



window.onload = function mainMini() {
    gLabel = document.getElementById( "debug-label" )
    gLabel.innerHTML = "testing for WebGL"

    if (!window.WebGLRenderingContext) {
        gLabel.innerHTML = "No WebGL Rendering Context available in your web browser:<br>" +
            "window.WebGLRenderingContext = {"+JSON.stringify(window.WebGLRenderingContext)+"}";
        return;
    } else {
        gLabel.innerHTML = "WebGL Rendering Context found:<br>" +
            "window.WebGLRenderingContext = {"+JSON.stringify(window.WebGLRenderingContext)+"}";
    }

    var lCanvas = document.getElementById( "gl-canvas" );
    
    var lWebGLnames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var ii = 0; ii < lWebGLnames.length; ++ii) {
        gLabel.innerHTML = "Querying for {"+lWebGLnames[ii]+"} context."
    
        try {
            gl = lCanvas.getContext(lWebGLnames[ii]);
        } catch(e) {
            alert("Error creating WebGL Context: " + e.toString());
            return;
        }
        if (gl) {
            break;
        }
    }
    if ( !gl ) {
            alert("Unable to create WebGL Context.")
            return;
    }

    gLabel.innerHTML = "Obtained WebGL context."


    var lTriangleVertices = [
         -1, -1,
          0,  1,
          1, -1 
    ];

    gl.viewport( 0, 0, lCanvas.width, lCanvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    var lGLSLprogram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( lGLSLprogram );
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(lTriangleVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( lGLSLprogram, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewInTheShader = gl.getUniformLocation( lGLSLprogram, "modelViewMatrix" );
    projectionInTheShader = gl.getUniformLocation( lGLSLprogram, "projectionMatrix" );

    render();

    gLabel.innerHTML = "This is a WebGL-rendered triangle."

};


function render() {
    gl.uniformMatrix4fv(modelViewInTheShader, false, new Float32Array(gModelViewMatrix) );
    gl.uniformMatrix4fv( projectionInTheShader, false, new Float32Array(myOrtho2D(-1,1,-1,1)) );

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}

// ------------------------------------------------------------
    // TODO: modify the content of the gModelViewMatrix matrix
    //    in the four functions that follow.
    // Implement rotation and translation by a fixed increment
    //    every time a button is clicked, e.g.
    //    + or - 5 degrees rotation, + or - 5 pixel translation.
    //
    // Hint 1: the matrix is defined "transposed" in JavaScript,
    //   i.e. the last row in the JavaScript code is really
    //   the last column of the matrix, as used in
    //   the matrix multiplication inside the vertex shader.
    // Hint 2: in this 4x4 matrix, disregard the 3rd row and 3rd
    //   column since they act upon "z" coordinates, and we
    //   are working in 2D here, so all "z" coordinates are "flattened".
    //   Thus consider only rows the first, second and fourth row,
    //   and the first, second and fourth column (if you "white out" the
    //   third row and the third column, you'll see a 3x3 matrix).

    // update the gModelViewMatrix global by affecting ONLY
    //   the parameters that affect either rotation or translation.
    //

    // Hint 3: you may want to use these globals, defined above,
    //    to keep track of rotation & translation:
    // var dX = 0;
    // var dY = 0;
    // var dAngle = 0;

// ------------------------------------------------------------

function turn_left() {
    gLabel.innerHTML = "turning left";
    dAngle = - 5 * Math.PI / 360;
    gModelViewMatrix = [
   Math.cos(dAngle), Math.sin(dAngle), 0.0, 0.0, 
   -Math.sin(dAngle), Math.cos(dAngle), 0.0, 0.0,
   0.0, 0.0, 1.0, 0.0,
   0.0, 0.0, 0.0, 1.0
];
  render();  
    // TODO: see instructions in comment above
}

function turn_right() {

    gLabel.innerHTML = "turning right";
    dAngle = 5 * Math.PI / 360;
    gModelViewMatrix = [
   Math.cos(dAngle), Math.sin(dAngle), 0.0, 0.0, 
   -Math.sin(dAngle), Math.cos(dAngle), 0.0, 0.0,
   0.0, 0.0, 1.0, 0.0,
   0.0, 0.0, 0.0, 1.0
];
    render();
    // TODO: see instructions in comment above
}

function move_up() {
    gLabel.innerHTML = "moving up";
    dY = 0.5 ;
    gModelViewMatrix = [
   1.0, 0.0, 0.0, 0.0, 
   0.0, 1.0, 0.0, 0.0,
   0.0,  0.0, 1.0, 0.0,
   0.0, dY, 0.0, 1.0
];
render();
    // TODO: see instructions in comment above
}

function move_down() {
    gLabel.innerHTML = "moving down";
    dY = - 0.5;
    gModelViewMatrix = [
   1.0, 0.0, 0.0, 0.0, 
   0.0, 1.0, 0.0, 0.0,
   0.0, 0.0, 1.0, 0.0,
   0.0, dY, 0.0, 1.0
];
    render();
    // TODO: see instructions in comment above
}

function myOrtho2D(left,right,bottom,top) {
    var near = -1;
    var far = 1;
    var rl = right-left;
    var tb = top-bottom;
    var fn = far-near;
    // the returned matrix is defined "transposed", i.e. the last row
    //   is really the last column as used in matrix multiplication:
    return [        2/rl,                0,              0,  0,
                       0,             2/tb,              0,  0,
                       0,                0,          -2/fn,  0,
        -(right+left)/rl, -(top+bottom)/tb, -(far+near)/fn,  1];
}

// ------------------------------------------------------------
function initShaders( gl, vertexShaderId, fragmentShaderId ) {
    var vertShdr;
    var fragShdr;

    var vertElem = document.getElementById( vertexShaderId );
    if ( !vertElem ) { 
        alert( "Unable to load vertex shader " + vertexShaderId );
        return -1;
    }
    else {
        vertShdr = gl.createShader( gl.VERTEX_SHADER );
        gl.shaderSource( vertShdr, vertElem.text );
        gl.compileShader( vertShdr );
        if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
            var msg = "Vertex shader failed to compile.  The error log is:"
        	+ "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
            alert( msg );
            return -1;
        }
    }

    var fragElem = document.getElementById( fragmentShaderId );
    if ( !fragElem ) { 
        alert( "Unable to load vertex shader " + fragmentShaderId );
        return -1;
    }
    else {
        fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
        gl.shaderSource( fragShdr, fragElem.text );
        gl.compileShader( fragShdr );
        if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
            var msg = "Fragment shader failed to compile.  The error log is:"
        	+ "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
            alert( msg );
            return -1;
        }
    }

    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return -1;
    }

    return program;
}



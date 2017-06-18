// B581-lab-03-starting-text.js
// CSCI B581 Advanced Computer Graphics
// Mitja Hmeljak - Fall 2015

var gl = null;
var gModelViewInTheShader = new Array()
var gProjectionInTheShader = new Array();
var gGLSLprogram = new Array();
var gBufferId = new Array();
    

window.onload = function mainMini() {
    var lLabel = document.getElementById( "debug-label" )
    lLabel.innerHTML = "testing for WebGL"

    if (!window.WebGLRenderingContext) {
        lLabel.innerHTML = "No WebGL Rendering Context available in your web browser:<br>" +
            "window.WebGLRenderingContext = {"+JSON.stringify(window.WebGLRenderingContext)+"}";
        return;
    } else {
        lLabel.innerHTML = "WebGL Rendering Context found:<br>" +
            "window.WebGLRenderingContext = {"+JSON.stringify(window.WebGLRenderingContext)+"}";
    }

    var lCanvas = document.getElementById( "gl-canvas" );
    
    var lWebGLnames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var ii = 0; ii < lWebGLnames.length; ++ii) {
        lLabel.innerHTML = "Querying for {"+lWebGLnames[ii]+"} context."
    
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

    lLabel.innerHTML = "Obtained WebGL context."


    var lTriangleVertices = [
         -0.75, -0.75,
          0.0,   0.75,
          0.75, -0.75 
    ];

    var lSquareVertices = [
          0.5,  0.5,
         -0.5,  0.5,
          0.5, -0.5,
         -0.5, -0.5 
    ];

    gl.viewport( 0, 0, lCanvas.width, lCanvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gGLSLprogram.push ( initShaders( gl, "vertex-shader", "fragment-shader-colorfill" ) )
    gGLSLprogram.push ( initShaders( gl, "vertex-shader", "fragment-shader-bricks" ) )
    gl.useProgram( gGLSLprogram[1] );
    
    gBufferId.push ( gl.createBuffer() );
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[0] );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(lSquareVertices), gl.STATIC_DRAW );
    gBufferId[0].itemSize = 2;
    gBufferId[0].numItems = 4;


    gBufferId.push ( gl.createBuffer() );
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[1] );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(lTriangleVertices), gl.STATIC_DRAW );
    gBufferId[0].itemSize = 2;
    gBufferId[0].numItems = 3;

    gModelViewInTheShader.push ( gl.getUniformLocation( gGLSLprogram[0], "modelViewMatrix" ) );
    gProjectionInTheShader.push ( gl.getUniformLocation( gGLSLprogram[0], "projectionMatrix" ) );

    gModelViewInTheShader.push ( gl.getUniformLocation( gGLSLprogram[1], "modelViewMatrix" ) );
    gProjectionInTheShader.push ( gl.getUniformLocation( gGLSLprogram[1], "projectionMatrix" ) );

    brickColorInTheShader = gl.getUniformLocation(gGLSLprogram[1], "BrickColor");
    mortarColorInTheShader = gl.getUniformLocation(gGLSLprogram[1], "MortarColor");
    brickSizeInTheShader = gl.getUniformLocation(gGLSLprogram[1], "BrickSize");
    brickPctInTheShader = gl.getUniformLocation(gGLSLprogram[1], "BrickPct");

    drawContent();

    lLabel.innerHTML = "B581 - Lab 03 starting code  - Fall 2015."

};


function drawContent() {

    // set uniform variables for shaders:

    // the lModelViewMatrix is defined here as a 1-dimensional array,
    //   therefore it looks *transposed* compared to how we've seen it at lecture time:
    var lModelViewMatrix = [
       1.0, 0.0, 0.0, 0.0,   // first column (not row!) in matrix
       0.0, 1.0, 0.0, 0.0,   // second column (not row!) in matrix
       0.0, 0.0, 1.0, 0.0,   // third column (not row!) in matrix
       0.0, 0.0, 0.0, 1.0    // fourth column (not row!) in matrix
    ];

    var lBrickColor = [0.7, 0.1, 0.0];
    var lMortarColor = [0.85, 0.86, 0.84];
    var lBrickSize = [0.30, 0.15];
    var lBrickPct = [0.90, 0.85];

    gl.useProgram( gGLSLprogram[0] );
    gl.uniformMatrix4fv( gModelViewInTheShader[0], false, new Float32Array(lModelViewMatrix) );
    gl.uniformMatrix4fv( gProjectionInTheShader[0], false, new Float32Array(myOrtho2D(-1,1,-1,1)) );

    gl.useProgram( gGLSLprogram[1] );
    // TODO: change the modelview matrix so that the triangle 
    //   appears aligned *exactly* with the bottom edge of the viewport
    // lModelViewMatrix = ...

    gl.uniformMatrix4fv( gModelViewInTheShader[1], false, new Float32Array(lModelViewMatrix) );
    gl.uniformMatrix4fv( gProjectionInTheShader[1], false, new Float32Array(myOrtho2D(-1,1,-1,1)) );
    gl.uniform3fv( brickColorInTheShader,  new Float32Array( lBrickColor ));
    gl.uniform3fv( mortarColorInTheShader,  new Float32Array(lMortarColor));
    gl.uniform2fv( brickSizeInTheShader,  new Float32Array(lBrickSize));
    gl.uniform2fv( brickPctInTheShader,  new Float32Array(lBrickPct));


    // drawing:

    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.useProgram( gGLSLprogram[1] );
    gl.bindBuffer(gl.ARRAY_BUFFER, gBufferId[1]);
    var vPosition = gl.getAttribLocation( gGLSLprogram[1], "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.useProgram( gGLSLprogram[0] );
    gl.bindBuffer(gl.ARRAY_BUFFER, gBufferId[0]);
    vPosition = gl.getAttribLocation( gGLSLprogram[0], "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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



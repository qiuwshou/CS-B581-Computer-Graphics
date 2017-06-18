// B581 Fall 2015 Lab2
// Qiuwei Shou
// qiuwshou@umail.iu.edu

var gl = null;
var points;

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

//coordinates of three vertice of triangle 
    var vertices = [
         -1, -1,
          0,  1,
          1, -1 
    ];
    //configure webGL
    gl.viewport( 0, 0, lCanvas.width, lCanvas.height );
    //define the width and height of viewpoint in browser window
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    //color of triangle
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
    //send data color to GPU

    //associate shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    //also send information of vertice to GPU

    render();
    //show the object in HTML
    

    lLabel.innerHTML = "This is a WebGL-rendered triangle."

};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}

//a function to initialize vertex shader and fragmentshader
//and load the 
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
        //get the content of vertice and will be used for fragment shader later
        
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
    //transfer vertex shader to fragment shader to define the object
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return -1;
    }

    return program;
}



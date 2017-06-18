// ------------------------------------------------------------
// CSCI B581 Advanced Computer Graphics
// Qiuwei Shou - Fall 2015
// ------------------------------------------------------------


// WebGL context:
var gl = null;

// HTML5 canvas:
var gCanvas = null;

// modelview and rotation matrices in Javascript:

// position and rotation of 3D model object:
var gObjCoord = vec3(0.0, 0.0, -3.0 );
var gObjRotMatrix = mat4();

// matrices to pass to the shader:
var gModelMatrix = mat4();
var gViewMatrix = mat4();
var gProjectionMatrix = mat4();

// pointer to GLSL program to pass to GPU:
var gGLSLprogram = new Array();

// pointer to vertex buffer:
var gBufferId = new Array();
var cBuffer = new Array();
var nBuffer = new Array();
var vBuffer = new Array();

// Mouse Event Variables
var gMouseDownFlag = false;
var gMouseButtonWhich = 0;
var gXmouseDown = -1;
var gYmouseDown = -1;
var gXmouseCurrent = -1;
var gYmouseCurrent = -1;
var gXmousePrev;
var gYmousePrev;
var gDX = 0.0;
var gDY = 0.0;

// Keyboard Event Variables
var gModifierShiftKeyDown = false;

var gInteractionMode = "RollingBall";
var gCameraSpaceFlag = true;



// canvas redraw counter:
var i = 0;


// debug labels in HTML:
var gDebugLabel;
var gDebugLabel2;



// coordinates for 3D camera position in world frame:
var gCameraCoords = vec3(0.0, 0.0, 0.0 );

//
// ------- prepare data for a 3D cube -------
//
var gNumVertices = 0; // here we'll store the number of vertices to draw

var all_vertex = [];
var all_normal = [];
var all_color = [];
var gVertexArray = [];
var gNormalsArray = [];
var gColorArray = [];

var gVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];




//
// ------- prepare data for three lights: -------
//

var gLightDir0 = vec3(100.0, 100.0, 100.0);
var gLightColor0 = vec3(1.0, 0.5, 0.5);

var gLightPos1 = vec3(1.0, 1.0, 1.0);
var gLightColor1 = vec3(1.0, 1.0, 1.0);

var gLightPos2 = vec3(1.0, 1.0, 1.0);
var gLightDir2 = vec3(1.0, 1.0, 1.0);
var gLightColor2 = vec3(1.0, 1.0, 1.0);
var gLightCosCutoff2 = 100.0;


// -------- prepare variables for storage locations of shader variables:

// attribute variables for vertices:
var gVertexLoc ;
var gNormalLoc;
var gColorLoc;

var all_vloc = new Array();
var all_nloc = new Array();
var all_cloc = new Array();

// uniform variable for color:
var gColorUniformLoc;
var all_cuni = new Array();




function posToColor(x) {
    var xLocal = x;
    var xLocal = x;
    var xLocal = x;
    var xLocal = x;
    for ( var i = 0; i < xLocal.length; ++i ) {
        if ( xLocal[i] < 0 ) {
            xLocal[i] = -xLocal[i]
        }
    }
    xLocal = normalize(xLocal);
    return xLocal;
}


function quad(a, b, c, d)    {
     var t1 = subtract(gVertices[b], gVertices[a]);
     var t2 = subtract(gVertices[c], gVertices[b]);
     var color = vec4( 0.5, 0.5, 0.5, 1.0 );
//     var color = add(gVertices[a], vec4( 0.5, 0.5, 0.5, 0.0 ));
     var normal = cross(t1, t2);
     var normal = vec3(normal);

     gVertexArray.push(gVertices[a]); 
     gNormalsArray.push(normal); 
     gColorArray.push(color); 
     gVertexArray.push(gVertices[b]); 
     gNormalsArray.push(normal); 
     gColorArray.push(color); 
     gVertexArray.push(gVertices[c]); 
     gNormalsArray.push(normal);   
     gColorArray.push(color); 
     gVertexArray.push(gVertices[a]);  
     gNormalsArray.push(normal); 
     gColorArray.push(color); 
     gVertexArray.push(gVertices[c]); 
     gNormalsArray.push(normal); 
     gColorArray.push(color); 
     gVertexArray.push(gVertices[d]); 
     gNormalsArray.push(normal);
     gColorArray.push(color); 
}

// take 3 gVertices and define a triangle, and its normal,
//  and place them into gVertexArray and gNormalsArray:
// function tri(a, b, c)    {
//      var t1 = subtract(gVertices[c], gVertices[a]);
//      var t2 = subtract(gVertices[b], gVertices[a]);
//      var normal = cross(t1, t2);
//      var normal = vec3(normal);

//      gVertexArray.push(gVertices[a]); 
//      gNormalsArray.push(normal); 
//      gColorArray.push(color); 
//      gVertexArray.push(gVertices[b]); 
//      gNormalsArray.push(normal); 
//      gColorArray.push(color); 
//      gVertexArray.push(gVertices[c]); 
//      gNormalsArray.push(normal); 
//      gColorArray.push(color); 

//     console.log("in tri() gVertexArray = " + gVertexArray)
//     console.log("in tri() gVertexArray.length = " + gVertexArray.length)
//     console.log("in tri() gNormalsArray = " + gNormalsArray)
//     console.log("in tri() gNormalsArray.length = " + gNormalsArray.length)
//     console.log("in tri() gColorArray = " + gColorArray)
//     console.log("in tri() gColorArray.length = " + gColorArray.length)
// } // end of tri()

// Note: add up TOTAL number of verts, not number in vertArray
function colorCube()     {
    quad( 1, 0, 3, 2 );
    console.log("in colorCube() gVertexArray = " + gVertexArray)
    console.log("in colorCube() gVertexArray.length = " + gVertexArray.length)
    console.log("in colorCube() gNormalsArray = " + gNormalsArray)
    console.log("in colorCube() gNormalsArray.length = " + gNormalsArray.length)
    console.log("in colorCube() gColorArray = " + gColorArray)
    console.log("in colorCube() gColorArray.length = " + gColorArray.length)
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    console.log("in colorCube() gVertexArray = " + gVertexArray)
    console.log("in colorCube() gVertexArray.length = " + gVertexArray.length)
    console.log("in colorCube() gNormalsArray = " + gNormalsArray)
    console.log("in colorCube() gNormalsArray.length = " + gNormalsArray.length)
    console.log("in colorCube() gColorArray = " + gColorArray)
    console.log("in colorCube() gColorArray.length = " + gColorArray.length)
    all_vertex.push(gVertexArray);
    all_normal.push(gNormalsArray);
    all_color.push(gColorArray);
} // end of colorCube()
function model(){
        for (i = 0; i < gGLSLprogram.length ; i++){
    gl.useProgram( gGLSLprogram[i] );

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer[i] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(all_normal[i]), gl.STATIC_DRAW );
    
    all_nloc.push(gl.getAttribLocation( gGLSLprogram[i], "normal" ));
    gl.vertexAttribPointer( all_nloc[i], 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( all_nloc[i] );

    // now create a buffer for all colors for the cube, to store gColorArray:
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer[i] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(all_color[i]), gl.STATIC_DRAW );
    
    all_cloc.push(gl.getAttribLocation( gGLSLprogram[i], "color" ));
    gl.vertexAttribPointer( all_cloc[i], 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( all_cloc[i] );
    
    // now create a buffer for all vertices in the cube:
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer[i] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(all_vertex[i]), gl.STATIC_DRAW );
    
    all_vloc.push(gl.getAttribLocation(gGLSLprogram[i], "a_vertex"));
    gl.vertexAttribPointer(all_vloc[i], 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(all_vloc[i]);
    }
    }
function light(){
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 0.5, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    // material properties for one material:
    var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
    var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    var materialShininess = 100.0;

    // compute light * material products to pass shaders:
    for (i = 0; i < gGLSLprogram.length ; i++){
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(gGLSLprogram[i], "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(gGLSLprogram[i], "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(gGLSLprogram[i], "specularProduct"), flatten(specularProduct) );
    // we use u_lightDir0 in this case, not this one:
    // gl.uniform4fv(gl.getUniformLocation(gGLSLprogram, "lightPosition"), flatten(lightPosition) );
       
    gl.uniform1f(gl.getUniformLocation(gGLSLprogram[i], "shininess"), materialShininess);

    gl.uniform3fv(gl.getUniformLocation(gGLSLprogram[i], "u_lightDir0"), flatten(gLightDir0));
    // not yet used:
    gl.uniform3fv(gl.getUniformLocation(gGLSLprogram[i], "u_lightColor0"), flatten(gLightColor0));
    gl.uniform3fv(gl.getUniformLocation(gGLSLprogram[i], "u_lightPos1"), flatten(gLightPos1));
    gl.uniform3fv(gl.getUniformLocation(gGLSLprogram[i], "u_lightColor1"), flatten(gLightColor1));
    gl.uniform3fv(gl.getUniformLocation(gGLSLprogram[i], "u_lightPos2"), flatten(gLightPos2));
    gl.uniform3fv(gl.getUniformLocation(gGLSLprogram[i], "u_lightDir2"), flatten(gLightDir2));
    gl.uniform3fv(gl.getUniformLocation(gGLSLprogram[i], "u_lightColor2"), flatten(gLightColor2));
    gl.uniform1f (gl.getUniformLocation(gGLSLprogram[i], "u_lightCosCutoff2"), gLightCosCutoff2);
    }
}

function axisX(){
    var v1 = vec4( -2, 0,  0, 1.0 );
    var v2 = vec4( 2, 0,  0, 1.0 );
    var v3 = vec4(0, 0, 0, 0);
    var v4 = vec4(1,0,0,1.0);
    var t1 = subtract(v1, v2);
    var t2 = subtract(v1, v3);
    var color2 = vec4( 0.4, 1, 1, 1.0 );
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    var x_vertices = [v1,v2,v3,v4];
    var x_color = [color2,color2,color2,color2];
    var x_normal = [normal, normal,normal, normal];
    all_vertex.push(x_vertices);
    all_normal.push(x_normal);
    all_color.push(x_color);
}
function axisY(){
    var v1 = vec4(0,2 ,0,1.0);
    var v2 = vec4(0,-2,0,1.0);
    var v3 = vec4(0,0 ,0,1.0);
    var v4 = vec4(0, 1,0,1.0);
    var t1 = subtract(v1, v2);
    var t2 = subtract(v1, v3);
    var color2 = vec4( 0.4, 1, 1, 1.0 );
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    var x_vertices = [v1,v2,v3,v4];
    var x_color = [color2,color2,color2,color2];
    var x_normal = [normal, normal,normal, normal];
    all_vertex.push(x_vertices);
    all_normal.push(x_normal);
    all_color.push(x_color);
}
function axisZ(){
    var v1 = vec4(0,0, 2,1);
    var v2 = vec4(0,0, -2,1);
    var v3 = vec4(0,0, 0,1);
    var v4 = vec4(0,0, 1,1);
    var t1 = subtract(v1, v2);
    var t2 = subtract(v1, v3);
    var color2 = vec4( 0.4, 1, 1, 1.0 );
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    var x_vertices = [v1,v2,v3,v4];
    var x_color = [color2,color2,color2,color2];
    var x_normal = [normal, normal,normal, normal];
    all_vertex.push(x_vertices);
    all_normal.push(x_normal);
    all_color.push(x_color);
}
// ------------------------------------------------------------
window.onload = function myMainProgram() {

    console.log("function myMainProgram BEGIN")
    
    // provide debug information in an HTML element, obtained by its ID:
    gDebugLabel = document.getElementById( "debug-label" )
    gDebugLabel2 = document.getElementById( "debug-label-2" );
    gDebugLabel.innerHTML = "WebGL main Javascript program starting..."
    gDebugLabel.innerHTML = "(more debug info will be provided in this place)"


	// // document.getElementById("ButtonTxy").onclick = function() { gInteractionMode = "Txy";updateDebug(); };
 // //    document.getElementById("ButtonTyz").onclick = function() { gInteractionMode = "Txz";updateDebug(); };
 // //    document.getElementById("ButtonRroll").onclick = function() { gInteractionMode = "RollingBall";updateDebug(); };

 //    // document.getElementById("ButtonRz").onclick = function() { gInteractionMode = "Rz";updateDebug(); };

	// document.getElementById("Switch").onclick = function() {
	// 	if (gCameraSpaceFlag) { gCameraSpaceFlag = false; } else { gCameraSpaceFlag = true; }
	// 	updateDebug();
	// };
	document.getElementById("x-y").checked = function() { gInteractionMode = "Txy";updateDebug(); };
    document.getElementById("x-z").checked = function() { gInteractionMode = "Txz";updateDebug(); };
    document.getElementById("show").checked = function() { gInteractionControl = "show"; updateDebug(); };
    document.getElementById("hide").checked = function() { gInteractionControl = "hide"; updateDebug(); };


    // test for WebGL context capability:
    if (!window.WebGLRenderingContext) {
        gDebugLabel.innerHTML = "No WebGL Rendering Context available in your web browser:<br>" +
            "window.WebGLRenderingContext = {"+JSON.stringify(window.WebGLRenderingContext)+"}";
        return;
    } else {
        gDebugLabel.innerHTML = "WebGL Rendering Context found:<br>" +
            "window.WebGLRenderingContext = {"+JSON.stringify(window.WebGLRenderingContext)+"}";
    }


    // obtain HTML5 canvas:
    gCanvas = document.getElementById( "gl-canvas" );
    
    // obtain WebGL context in HTML canvas:
    var lWebGLnames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var ii = 0; ii < lWebGLnames.length; ++ii) {
        gDebugLabel.innerHTML = "Querying for {"+lWebGLnames[ii]+"} context."
    
        try {
        // 2015-12-02 - B581 - Mitja:
        // added "{ alpha: false }" to disable the alpha channel of HTML5's Canvas,
        // so that all alpha compositing is done only by WebGL:
        // (from http://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html )
            gl = gCanvas.getContext(lWebGLnames[ii], { alpha: false });
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

    gDebugLabel.innerHTML = "Obtained WebGL context."


    
    //
    // ------- initialize WebGL : -------
    //

    gl.viewport( 0, 0, gCanvas.width, gCanvas.height );
    gl.clearColor( 1, 1, 1, 1.0 );
    //  if we want to preserve "drawing order" instead of Z-buffer, disable DEPHT_TEST:
    gl.enable(gl.DEPTH_TEST);


    gGLSLprogram.push(initShaders( gl, "vertex-shader-MVP", "fragment-shader-x" ));
    cBuffer.push ( gl.createBuffer() );
    vBuffer.push ( gl.createBuffer() );
    nBuffer.push ( gl.createBuffer() );
    axisX();

    gGLSLprogram.push(initShaders( gl, "vertex-shader-MVP", "fragment-shader-y" ));
    cBuffer.push ( gl.createBuffer() );
    vBuffer.push ( gl.createBuffer() );
    nBuffer.push ( gl.createBuffer() );
    axisY();

    gGLSLprogram.push(initShaders( gl, "vertex-shader-MVP", "fragment-shader-z" ));
    cBuffer.push ( gl.createBuffer() );
    vBuffer.push ( gl.createBuffer() );
    nBuffer.push ( gl.createBuffer() );
    axisZ();
    // load GLSL shaders into GPU:
    //
    gGLSLprogram.push(initShaders( gl, "vertex-shader-MVP", "fragment-shader-3-lights" ));
    cBuffer.push ( gl.createBuffer() );
    vBuffer.push ( gl.createBuffer() );
    nBuffer.push ( gl.createBuffer() );
    colorCube();

    



    model();


	
    // getUniformLocation finds the place "string", in the shader's variable space, to store a value.
    //  then gl.uniform3fv transfers the value in second arg (an array here) to the shader variable.
	// gColorUniformLoc = gl.getUniformLocation(gGLSLprogram, "color");
	// gl.uniform3f(gColorUniformLoc, 0.8, 0.2, 0.1); // (4f for alpha, etc., 3fv, 4fv for vec)

    // we use u_lightDir0 in this case, not this one:
    // var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
    // light properties for one light source:
    
    light();
//    gl.enableVertexAttribArray( gGLSLprogram.vPosition );


    // initialize event callbacks, i.e. mouse event handlers:
    gCanvas.onmousedown = handleMouseDown;
    gCanvas.onmouseup = handleMouseUp;
    gCanvas.onmousemove = handleMouseMotion;

    gCanvas.oncontextmenu = function (e) {   e.preventDefault();  };

    document.onkeydown = function (e) {
        if (e.shiftKey) { 
            setShiftToTrue();
        }
//         else {
//             gModifierShiftKeyDown = false;
//             windowModifierShiftKey = false;
//             console.log("document.onkeydown e.shiftKey FALSE = " + windowModifierShiftKey)
//         }
    }
    document.onkeyup = function (e) {
        console.log("onkeyup = " + e )
        setShiftToFalse();
//         else {
//             windowModifierShiftKey = true;
//             console.log("document.onkeyup e.shiftKey TRUE = " + windowModifierShiftKey)
//         }
    }

    // to animate/refresh canvas periodically e.g. every 1/60 second, use this:
    // refreshCanvas();
    // to draw only once, you would use this instead:
    drawContent();

    // done with WebGL setup.
    gDebugLabel.innerHTML = "WebGL initialization completed."

    console.log("function myMainProgram END")

} // end of function myMainProgram()


function distance(x0, y0, x1, y1){
	return Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1));
}

function distanceToLine(x, y, x1, y1, x2, y2) {

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len = C * C + D * D;
    var param = -1;
    if (len !== 0){ 
        norm = dot / len;
    }

    var xx, yy;
    if (norm < 0) {
        xx = x1;
        yy = y1;
    }
    else if (norm > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + norm * C;
        yy = y1 + norm * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return (Math.sqrt(dx * dx + dy * dy));
}

// ------------------------------------------------------------
function drawContent() {

//    console.log("function drawContent BEGIN")

            
    // Clear the screen
    gl.clearColor( 1, 1, 1, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	

    if (gCameraSpaceFlag) {
        if (gInteractionMode == "Txy") {
            // move camera:
            gCameraCoords[0] = gCameraCoords[0] + 0.01 * gDX;
            gCameraCoords[1] = gCameraCoords[1] + 0.01 * gDY;
        } else if(gInteractionMode == "Txz") {
            gCameraCoords[0] = gCameraCoords[0] + 0.01 * gDX;
            gCameraCoords[2] = gCameraCoords[2] + 0.01 * gDY;
        }
    }
        
        
	// Set View Matrix:
	//  start with a fresh "translate" matrix from camera coordinates,
	//  translating the world in the opposite direction from the camera:
	gViewMatrix = translate(negate(gCameraCoords));

	
	// ------------- DRAWING THE CUBE -------------------------------

	// Setting the perspective matrix:
	gProjectionMatrix = perspective(60, gCanvas.width/gCanvas.height, 1, 21);

	// Setting the Model Matrix:
	gModelMatrix = translate(gObjCoord);
	gModelMatrix = mult(gModelMatrix, gObjRotMatrix);

    render();

	
    // count how many time canvas has been redrawn:
    i = i + 1
    
    // we "used up" mouse motion, therefore clean it:
    gDX = 0
    gDY = 0

    // update HTML debug information:
    updateDebug();

//    console.log("function drawContent END")

} // end of function drawContent()

function render(){


 for (i = 0; i < gGLSLprogram.length ; i++){

    gl.clear( gl.DEPTH_BUFFER_BIT);
    gl.useProgram( gGLSLprogram[i] );

    setUniformMatrices(i);
    
  
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer[i]);

    gl.vertexAttribPointer(all_vloc[i], 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(all_vloc[i]);

    gl.vertexAttribPointer(all_nloc[i], 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( all_nloc[i]);

    gl.vertexAttribPointer(all_cloc[i], 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(all_cloc[i]);    
    
    // Draw vertex arrays -- first find how many vertices!
    gNumVertices = all_vertex[i].length;
    console.log("in drawContent() all_vertex[i].length = " + all_vertex[i].length)
    console.log("in drawContent() gNumVertices = " + gNumVertices)
    console.log("in drawContent() all_vertex[i].length = " + all_vertex[i].length)
    console.log("in drawContent() gNumVertices = " + gNumVertices)
    console.log("in drawContent() all_vertex[i].length = " + all_vertex[i].length)
    console.log("in drawContent() gNumVertices = " + gNumVertices)
    if (i < 3){
        gl.drawArrays( gl.LINE_STRIP, 0, gNumVertices);
    }
    else if(i == 3){
        gl.drawArrays( gl.TRIANGLES, 0, gNumVertices);
    }

}

}



// ------------------------------------------------------------
function setUniformMatrices(i){

//    console.log("function setUniformMatrices BEGIN")


	gl.uniformMatrix4fv( gl.getUniformLocation(gGLSLprogram[i], "Proj_Matrix"),false, flatten(gProjectionMatrix));

	gl.uniformMatrix4fv( gl.getUniformLocation(gGLSLprogram[i], "Model_Matrix"), false, flatten(gModelMatrix) );
	
	gl.uniformMatrix4fv( gl.getUniformLocation(gGLSLprogram[i], "View_Matrix"), false, flatten(gViewMatrix) );	

//    console.log("function setUniformMatrices END")

}




// ------------------------------------------------------------
function b481_GL_rollBall (pDeltaX, pDeltaY, pObjRotMat) {
    // returns new rotation matrix for object
    
    console.log("function b481_GL_rollBall BEGIN")


    var rotationAngle = 0;  
    var rotationAxis = vec3(0.0, 0.0, 1.0);
    var angleScale = 0.5 ;
    var rotateR = Math.sqrt(pDeltaX*pDeltaX + pDeltaY*pDeltaY);
    
    // pObjRotMat is an input matrix, it's the object rotation matrix
    // pObjCoord are the XYZ center of coordinates of the object

    // only rotate when there is some angle:
    if (rotateR > 0.01) {
        rotationAngle = (rotateR * angleScale );
        rotationAxis[0] = -pDeltaY/rotateR;
        rotationAxis[1] =  pDeltaX/rotateR;
        rotationAxis[2] = 0.0;
        
        return rotate(rotationAngle, rotationAxis);
        
    } else {
        // return identity if no rotation:
        return mat4(1);
    }

    console.log("function b481_GL_rollBall END")

} /* b481_GL_rollBall() */

// ------------------------------------------------------------


// ------------------------------------------------------------
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
// mouse event functions
// 
// the functions below work with mouse coordinates relative to the canvas, as from:
//  http://miloq.blogspot.com/2011/05/coordinates-mouse-click-canvas.html
// ------------------------------------------------------------

function handleMouseDown(event) {
    // event.which - http://www.w3schools.com/jsref/event_which.asp
    // 0 : No button
    // 1 : Left mouse button
    // 2 : Wheel button or middle button (if present)
    // 3 : Right mouse button
    gMouseButtonWhich = event.which;

	gMouseDownFlag = true;


    console.log("function handleMouseDown BEGIN")


    if (event.x !== undefined && event.y !== undefined) {
        gXmouseDown = event.x + document.body.scrollLeft +
                            document.documentElement.scrollLeft;
        gYmouseDown = event.y + document.body.scrollTop +
                            document.documentElement.scrollTop;
    } else {
        // Firefox method to get the position
        gXmouseDown = event.clientX + document.body.scrollLeft +
                            document.documentElement.scrollLeft;
        gYmouseDown = event.clientY + document.body.scrollTop +
                            document.documentElement.scrollTop;
    }
    
    gXmousePrev = gXmouseDown;
    gYmousePrev = gYmouseDown;        
    gXmouseCurrent = gXmouseDown;
    gYmouseCurrent = gYmouseDown;        
    gDX = 0;
    gDY = 0;

	updateDebug();
    // if we're not running on automatic, redraw:
    drawContent();

    console.log("function handleMouseDown END")

} // end of function handleMouseDown(event)

// ------------------------------------------------------------
function handleMouseUp(event) {

    console.log("function handleMouseUp BEGIN")

    // event.which - http://www.w3schools.com/jsref/event_which.asp
    // 0 : No button
    // 1 : Left mouse button
    // 2 : Wheel button or middle button (if present)
    // 3 : Right mouse button
    gMouseButtonWhich = 0;

	gMouseDownFlag = false;


    // invalidate mouse coordinates:
    gXmouseDown = -1;
    gYmouseDown = -1;        
    gXmousePrev = -1;
    gYmousePrev = -1;        
    gXmouseCurrent = -1;
    gYmouseCurrent = -1;        
    gDX = 0;
    gDY = 0;

	updateDebug();
    // if we're not running on automatic, redraw:
    drawContent();

    console.log("function handleMouseUp END")
} // end of function handleMouseUp(event)



// ------------------------------------------------------------
function handleMouseMotion(event) {
    console.log("function handleMouseMotion BEGIN")

    if (event.shiftKey) { 
        console.log("handleMouseMotion event.shiftKey TRUE")
    } else {
        console.log("handleMouseMotion event.shiftKey FALSE")
    }

    if (gMouseDownFlag === true) {
        if (event.x !== undefined && event.y !== undefined) {
            gXmouseCurrent = event.x + document.body.scrollLeft +
                                document.documentElement.scrollLeft;
            gYmouseCurrent = event.y + document.body.scrollTop +
                                document.documentElement.scrollTop;
        } else {
            // Firefox method to get the position
            gXmouseCurrent = event.clientX + document.body.scrollLeft +
                                document.documentElement.scrollLeft;
            gYmouseCurrent = event.clientY + document.body.scrollTop +
                                document.documentElement.scrollTop;
        }
        // Convert from left-handed GLUT to right-handed
        gDX = gXmouseCurrent - gXmousePrev;
        gDY = -( gYmouseCurrent - gYmousePrev );

        gXmousePrev = gXmouseCurrent;
        gYmousePrev = gYmouseCurrent;

        // mouse buttons that are pressed -- store in global:
        // we could use:

        // event.button - http://www.w3schools.com/jsref/event_button.asp

        // 0 : Left mouse button
        // 1 : Wheel button or middle button (if present)
        // 2 : Right mouse button

        // event.buttons - only Firefox and IE - http://www.w3schools.com/jsref/event_buttons.asp
        // 1 : Left mouse button
        // 2 : Right mouse button
        // 4 : Wheel button or middle button
        // 8 : Fourth mouse button (typically the "Browser Back" button)
        // 16 : Fifth mouse button (typically the "Browser Forward" button)

        // event.which - http://www.w3schools.com/jsref/event_which.asp
        // 0 : No button
        // 1 : Left mouse button
        // 2 : Wheel button or middle button (if present)
        // 3 : Right mouse button
        
        // set it only in handleMouseUp and handleMouseDown,
        //   since a bug prevents it from working otherwise: 
        https://bugzilla.mozilla.org/show_bug.cgi?id=1048294
        // gMouseButtonWhich = event.which;

        // detect if we're using the right button on the mouse:
        if (gMouseButtonWhich === 3) { 
            if (gModifierShiftKeyDown === true) {
                gObjCoord[0] += 0.01 * gDX;
                gObjCoord[2] -= 0.01 * gDY;
            } else {
                gObjCoord[0] += 0.01 * gDX;
                gObjCoord[1] += 0.01 * gDY;
            }
        } else {
        // any other button on the mouse:    
            // rotate object:
            if (gInteractionMode === "RollingBall") {
                // rotate object:
                var deltaX =  gDX;
                var deltaY =  gDY;
                var lRotMat = mat4();
                lRotMat = b481_GL_rollBall(deltaX, deltaY);

            // Move to center:  gCameraCoords[0] 
            // lRotmat = mult(mult(transCtr,lRotMat),invTransCtr);
            // ?? this fixed-point transform seems to be already
            //   done -- probably means a mistake in scene definition?
    
            // Perform space-fixed, left multiplication:
                
                gObjRotMatrix = mult(lRotMat,gObjRotMatrix);
            }
        } // 
    }

	updateDebug();
    // if we're not running on automatic, redraw:
    drawContent();


    console.log("function handleMouseMotion END")
} // end of function handleMouseMotion(event) 
// ------------------------------------------------------------



function updateDebug(){
	gDebugLabel2.innerHTML = "Redraw Canvas: " + i + "<br>"
	    + "Mouse Down: " + gMouseDownFlag + "<br>"
	    + "Which Mouse Button: " + gMouseButtonWhich + "<br>"
		+ "Mouse Location : (" + gXmouseCurrent + ", " + gYmouseCurrent + ") <br>"
		+ "Mouse (dx, dy) : (" + gDX + " " + gDY + ") <br>"
	    + "Keyboard Shift Key: " + gModifierShiftKeyDown + "<br>"
		+ "Interaction Mode: " + gInteractionMode + "<br>"
		+ "Interact with Camera: " + gCameraSpaceFlag + "<br>"
		+ "gObjRotMatrix: " + gObjRotMatrix;
} // end of updateDebug()




function setShiftToTrue() {
    console.log("function setShiftToTrue BEGIN")
    gModifierShiftKeyDown = true;
    console.log("gModifierShiftKeyDown is now " + gModifierShiftKeyDown)
    console.log("function setShiftToTrue END")
}

function setShiftToFalse() {
    console.log("function setShiftToFalse BEGIN")
    if (gModifierShiftKeyDown) {
        gModifierShiftKeyDown = false;
    }
    console.log("gModifierShiftKeyDown is now " + gModifierShiftKeyDown)
    console.log("function setShiftToFalse END")
}



// ------------------------------------------------------------
// animation utility functions
// ------------------------------------------------------------
function refreshCanvas() {
    requestAnimationFrame(refreshCanvas);
    drawContent();
}

// ------------------------------------------------------------
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

// ------------------------------------------------------------

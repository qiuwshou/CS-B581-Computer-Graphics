// ------------------------------------------------------------
// CSCI B581 Advanced Computer Graphics
// Mitja Hmeljak - Fall 2015
// ------------------------------------------------------------


// WebGL context:
var gl = null;

// HTML5 canvas:
var gCanvas = null;

// position and rotation of 3D model object:
var gObjCoord = vec3(55.0, 55.0, 0.0 );
var gObjRotMatrix = mat4();

// matrices to pass to the shader:
var gModelMatrix = mat4();
var gViewMatrix = mat4();
var gProjectionMatrix = mat4();

// pointer to GLSL program to pass to GPU:
var gGLSLprogram = new Array() ;

// pointer to vertex buffer:
var gBufferId = new Array();

// flags:
var gHighlightedVertex = null;





// Mouse Event Variables
var gMouseDownFlag = false;
var gMouseButtonCode = 0;
var gXmouseCurrent;
var gYmouseCurrent;
var gXmousePrevious;
var gYmousePrevious;
var gXmouseDown;
var gYmouseDown;
var gDX = 0.0;
var gDY = 0.0;

// Keyboard Event Variables
var gModifierShiftKeyDown = false;

var interactionMode = "Rotate";
var cameraSpaceFlag = true;
var origin;



// canvas refresh counter:
var i = 0;

//count new button
var SelectId = 0;
var CurrentId = 0;
var NewCount = 0;

// debug labels in HTML:
var gDebugLabel;
var gDebugLabel2;


var lBrickColor = [0.5, 0.1, 0.0];
var lMortarColor = [0.85, 0.86, 0.84];
var lBrickSize = [0.30, 0.15];
var lBrickPct = [0.90, 0.85];


// coordinates for 3D camera position in world frame:
var gCameraCoord = vec3(0.0, 0.0, 0.0 );

//
// ------- prepare data for a 3D cube -------
//
var gNumVertices = 0; // here we'll store the number of vertices to draw

var gPointsArray = [];
var gNormalsArray = [];

var gVertices2D = new Array();
gVertices2D.push([
    vec4(  10.0,  10.0,  0, 1.0 ),
    vec4( 100.0,  10.0,  0, 1.0 ),
    vec4( 100.0, 100.0,  0, 1.0 ),
    vec4(  10.0, 100.0,  0, 1.0 ),
]);
gVertices2D.push([
    vec4(  50,  50,  0.1, 1.0 ),
    vec4( 150,  200,  0.1, 1.0 ),
    vec4( 200.0, 200,  0.1, 1.0 ),
]);
gVertices2D.push([
    vec4(  150,  175,  0.5, 1.0 ),
    vec4( 300,  300,  0.5, 1.0 ),
    vec4( 400, 350,  0.5, 1.0 ),
    vec4(  500, 300,  0.5, 1.0 ),
    ]);



// var gVertices2D = [
//     vec4(  10.0,  10.0,  0.0, 1.0 ),
//     vec4( 100.0,  10.0,  0.0, 1.0 ),
//     vec4( 100.0, 100.0,  0.0, 1.0 ),
//     vec4(  10.0, 100.0,  0.0, 1.0 ),
// ];

// var gVerticesTri = [
//     vec4(  10.0,  10.0,  0.0, 1.0 ),
//     vec4( 100.0,  10.0,  0.0, 1.0 ),
//     vec4( 100.0, 100.0,  0.0, 1.0 ),
// ];
// function fourVertices2D(a, b, c, d)    {
//      var t1 = subtract(gVertices2D[b], gVertices2D[a]);
//      var t2 = subtract(gVertices2D[c], gVertices2D[b]);
//      var normal = cross(t1, t2);
//      var normal = vec3(normal);

//      gPointsArray.push(gVertices2D[a]); 
//      gNormalsArray.push(normal); 
//      gPointsArray.push(gVertices2D[b]); 
//      gNormalsArray.push(normal); 
//      gPointsArray.push(gVertices2D[c]); 
//      gNormalsArray.push(normal); 
//      gPointsArray.push(gVertices2D[d]);  
//      gNormalsArray.push(normal); 
// }




// // Note: add up TOTAL number of vertices, not number in vertArray
// function rectangle2D()     {
//     fourVertices2D( 0, 1, 2, 3 );
//     console.log("in rectangle2D() gPointsArray = " + gPointsArray)
//     console.log("in rectangle2D() gPointsArray.length = " + gPointsArray.length)
//     console.log("in rectangle2D() gNormalsArray = " + gNormalsArray)
//     console.log("in rectangle2D() gNormalsArray.length = " + gNormalsArray.length)
// } // end of rectangle2D()


//
// ------- prepare data for three lights: -------
//
var lightDir0Loc = vec3(100.0, 100.0, 100.0);
var lightColor0Loc = vec3(1.0, 0.5, 0.5);

var lightPos1Loc = vec3(1.0, 1.0, 1.0);
var lightColor1Loc = vec3(1.0, 1.0, 1.0);

var lightPos2Loc = vec3(1.0, 1.0, 1.0);
var lightDir2Loc = vec3(1.0, 1.0, 1.0);
var lightColor2Loc = vec3(1.0, 1.0, 1.0);
var lightCosCutoff2Loc = 100.0;


// -------- prepare variables for storage locations of shader variables:

var gVertexLoc;
var normalLoc;
var gColorLoc;

// radio buttion function

var ViewFlag ;

// ------------------------------------------------------------
window.onload = function myMainProgram() {

    console.log("function myMainProgram BEGIN")
    
    // provide debug information in an HTML element, obtained by its ID:
    gDebugLabel = document.getElementById( "debug-label" )
    gDebugLabel2 = document.getElementById( "debug-label-2" );
    gDebugLabel.innerHTML = "WebGL main Javascript program starting..."
    gDebugLabel.innerHTML = "(more debug info will be provided in this place)"

    document.getElementById("New").onclick = function() {
       interactionMode = "New";
       NewCount = NewCount + 1 ;
       CurrentId = NewCount;
       drawNew(CurrentId);
      // NewCount = NewCount % 3;
       SelectId = CurrentId - 1;
       updateDebug();
    };
    document.getElementById("Select").onclick = function() {
       interactionMode = "Select";
       
       SelectId += 1;
       SelectId = SelectId % 3;
       drawContent(SelectId, gVertices2D[SelectId]);
       updateDebug();
       
    };
    document.getElementById("Solid").onclick = function() {
         gGLSLprogram[SelectId] = initShaders( gl, "vertex-shader-MVP", "fragment-shader-Solid" );
         drawContent(SelectId,gVertices2D[SelectId]);
         updateDebug();
    }
    document.getElementById("Brick").onclick = function() {
         gGLSLprogram[SelectId] = initShaders( gl, "vertex-shader-MVP", "fragment-shader-Brick" );
         drawContent(SelectId,gVertices2D[SelectId]);
         updateDebug();

    }
    document.getElementById("Checker").onclick = function() {
         gGLSLprogram[SelectId] = initShaders( gl, "vertex-shader-MVP", "fragment-shader-Checker" );
         drawContent(SelectId,gVertices2D[SelectId]);
         updateDebug();

    }
    document.getElementById("Bilinear").onclick = function() {
         gGLSLprogram[SelectId] = initShaders( gl, "vertex-shader-MVP", "fragment-shader-Bilinear" );
         gl.uniform3f(gColorLoc, 0.8, 0.2, 0.1);
         drawContent(SelectId,gVertices2D[SelectId]);
         updateDebug();

    }
    document.getElementById("Polygon").onclick = function() {
        ViewFlag = 0;

    }
    document.getElementById("Camera").onclick = function() {
        ViewFlag = 1;

    }
    document.getElementById("Translate").onclick = function() {

    }
    document.getElementById("Rotate").onclick = function() {

    }
    document.getElementById("Scale").onclick = function() {

    }
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
            gl = gCanvas.getContext(lWebGLnames[ii]);
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
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );
    //  if we draw in 2D and want to preserve "drawing order", disable DEPHT_TEST:
    gl.disable(gl.DEPTH_TEST);

    // load GLSL shaders into GPU:
    //
    gGLSLprogram.push (initShaders( gl, "vertex-shader-MVP", "fragment-shader-basic" ))
    gGLSLprogram.push (initShaders( gl, "vertex-shader-MVP", "fragment-shader-basic" ))
    gGLSLprogram.push (initShaders( gl, "vertex-shader-MVP", "fragment-shader-basic" ))
    gl.useProgram( gGLSLprogram[0] );
    gl.useProgram( gGLSLprogram[1] );
    gl.useProgram( gGLSLprogram[2] );


    gBufferId.push (gl.createBuffer())
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[0] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gVertices2D[0]), gl.STATIC_DRAW );
    
    gVertexLoc = gl.getAttribLocation(gGLSLprogram[0], "a_Position");
    gl.vertexAttribPointer(gVertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gVertexLoc);

    gBufferId.push (gl.createBuffer())
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[1]);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gVertices2D[1]), gl.STATIC_DRAW );
    
    gVertexLoc = gl.getAttribLocation(gGLSLprogram[1], "a_Position");
    gl.vertexAttribPointer(gVertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gVertexLoc);

    gBufferId.push (gl.createBuffer())
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[2]);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gVertices2D[2]), gl.STATIC_DRAW );
    
    gVertexLoc = gl.getAttribLocation(gGLSLprogram[2], "a_Position");
    gl.vertexAttribPointer(gVertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gVertexLoc);
  
    
    // if there is no color, put this back if desired?
    // gColorLoc = gl.getAttribLocation(gGLSLprogram, "color");
    //    gl.vertexAttribPointer(gColorLoc, 4, gl.FLOAT, false, 0, 0);
    //    gl.enableVertexAttribArray(gColorLoc);
    
    // getUniformLocation finds the place "string", in the shader's variable space, to store a value.
    //  then gl.uniform3fv transfers the value in second arg (an array here) to the shader variable.

    //     gColorLoc = gl.getUniformLocation(gGLSLprogram, "color");
    //     gl.uniform3f(gColorLoc, 0.8, 0.2, 0.1); // (4f for alpha, etc., 3fv, 4fv for vec)

    
    // var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
    // var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    // var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    // var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    // var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    // var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
    // var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    // var materialShininess = 100.0;

    // ambientProduct = mult(lightAmbient, materialAmbient);
    // diffuseProduct = mult(lightDiffuse, materialDiffuse);
    // specularProduct = mult(lightSpecular, materialSpecular);

    // gl.uniform4fv(gl.getUniformLocation(gGLSLprogram, "ambientProduct"), flatten(ambientProduct));
    // gl.uniform4fv(gl.getUniformLocation(gGLSLprogram, "diffuseProduct"), flatten(diffuseProduct) );
    // gl.uniform4fv(gl.getUniformLocation(gGLSLprogram, "specularProduct"), flatten(specularProduct) );    
    // gl.uniform4fv(gl.getUniformLocation(gGLSLprogram, "lightPosition"), flatten(lightPosition) );
       
    // gl.uniform1f(gl.getUniformLocation(gGLSLprogram, "shininess"),materialShininess);

    // gl.uniform3fv(gl.getUniformLocation(gGLSLprogram, "u_lightDir0"), flatten(lightDir0Loc));
    // gl.uniform3fv(gl.getUniformLocation(gGLSLprogram, "u_lightColor0"), flatten(lightColor0Loc));
    // gl.uniform3fv(gl.getUniformLocation(gGLSLprogram, "u_lightPos1"), flatten(lightPos1Loc));
    // gl.uniform3fv(gl.getUniformLocation(gGLSLprogram, "u_lightColor1"), flatten(lightColor1Loc));
    // gl.uniform3fv(gl.getUniformLocation(gGLSLprogram, "u_lightPos2"), flatten(lightPos2Loc));
    // gl.uniform3fv(gl.getUniformLocation(gGLSLprogram, "u_lightDir2"), flatten(lightDir2Loc));
    // gl.uniform3fv(gl.getUniformLocation(gGLSLprogram, "u_lightColor2"), flatten(lightColor2Loc));
    // gl.uniform1f (gl.getUniformLocation(gGLSLprogram, "u_lightCosCutoff2"),lightCosCutoff2Loc);

    // used in previous version:
    // gl.enableVertexAttribArray( gGLSLprogram.vPosition );


    // initialize event callbacks, i.e. mouse event handlers:
    gCanvas.onmousedown = handleMouseDown;
    gCanvas.onmouseup = handleMouseUp;
    gCanvas.onmousemove = handleMouseMotion;

    gCanvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

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

    // to animate, use this:
    // refreshCanvas();
    // to draw only once, you would use this instead:
    //drawContent(0);
    
    
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


function getCentroid() {

        // B481-TODO: you may have to compute and
        //            return the average position from pVertices

        tmpData = vec4( (gCanvas.width/2), (gCanvas.height/2), 0.0, 0.0);

        return tmpData;
}


// ------------------------------------------------------------

function drawNew(id){
    
    gl.clear(gl.GL_COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT | gl.GL_STENCIL_BUFFER_BIT);
    
    // Set View Matrix: start with a fresh "translate" matrix from camera coordinates:
    gViewMatrix = translate(gCameraCoord);
    
    // ------------- DRAWING WebGL PRIMITIVES -------------------------------

    // Setting the Projection Matrix to be an orthographic "2D" projection:
    //    parameters for ortho() are: ( left, right, bottom, top, near, far )
    gProjectionMatrix = ortho(0.0, gCanvas.width, 0.0, gCanvas.height, -1.0, 1.0);

    // Setting the Model Matrix:
    console.log("in drawContent() gObjCoord = " + gObjCoord)
    console.log("in drawContent() gModelMatrix = " + gModelMatrix)
    gModelMatrix = translate(gObjCoord);
    var lTmpMatrix = gObjRotMatrix;
    gModelMatrix = mult(gModelMatrix, lTmpMatrix);
    var lTmpVec3 = vec3( -gObjCoord[0], -gObjCoord[1], -gObjCoord[2] );
    var lTmpMatrix = translate(lTmpVec3);
    gModelMatrix = mult(gModelMatrix, lTmpMatrix);

    if(id >= 1){
    gl.useProgram( gGLSLprogram[0] );
    setUniformMatrices(0);
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[0] );

    gl.vertexAttribPointer(gVertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gVertexLoc);
    

    gColorLoc = gl.getUniformLocation(gGLSLprogram[0], "u_drawColor");
    gl.uniform3f(gColorLoc, 0.5, 0.5, 1.0);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);

    gColorLoc = gl.getUniformLocation(gGLSLprogram[0], "u_drawColor");
    gl.uniform3f(gColorLoc, 0, 1.0, 0.0);
    gl.drawArrays( gl.LINE_LOOP, 0, 4);
    gl.drawArrays( gl.POINTS, 0, 4);}
    
    if( id>=2 ){
    gl.useProgram( gGLSLprogram[1] );
    setUniformMatrices(1);
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[1] );
    gl.vertexAttribPointer(gVertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gVertexLoc);
    
    gColorLoc = gl.getUniformLocation(gGLSLprogram[1], "u_drawColor");
    gl.uniform3f(gColorLoc, 0.5, 0.5, 1.0);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 3);

    gColorLoc = gl.getUniformLocation(gGLSLprogram[1], "u_drawColor");
    gl.uniform3f(gColorLoc, 0, 1.0, 0.0);
    gl.drawArrays( gl.LINE_LOOP, 0, 3);
    gl.drawArrays( gl.POINTS, 0, 3);}

    if( id >= 3){
    gl.useProgram( gGLSLprogram[2] );
    setUniformMatrices(2);
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[2] );

    gl.vertexAttribPointer(gVertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gVertexLoc);
    

    gColorLoc = gl.getUniformLocation(gGLSLprogram[2], "u_drawColor");
    gl.uniform3f(gColorLoc, 0.5, 0.5, 1.0);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);

    gColorLoc = gl.getUniformLocation(gGLSLprogram[2], "u_drawColor");
    gl.uniform3f(gColorLoc, 0, 1.0, 0.0);
    gl.drawArrays( gl.LINE_LOOP, 0, 4);
    gl.drawArrays( gl.POINTS, 0, 4);}


}

function drawContent(id, gVertices) {
 
            
    // // Clear the screen
    gl.clear( gl.GL_DEPTH_BUFFER_BIT | gl.GL_STENCIL_BUFFER_BIT);
    
    
    // Set View Matrix: start with a fresh "translate" matrix from camera coordinates:
    gViewMatrix = translate(gCameraCoord);
    
    // ------------- DRAWING WebGL PRIMITIVES -------------------------------

    // Setting the Projection Matrix to be an orthographic "2D" projection:
    //    parameters for ortho() are: ( left, right, bottom, top, near, far )
    gProjectionMatrix = ortho(0.0, gCanvas.width, 0.0, gCanvas.height, -1.0, 1.0);

    // Setting the Model Matrix:
    console.log("in drawContent() gObjCoord = " + gObjCoord)
    console.log("in drawContent() gModelMatrix = " + gModelMatrix)
    gModelMatrix = translate(gObjCoord);
    var lTmpMatrix = gObjRotMatrix;
    gModelMatrix = mult(gModelMatrix, lTmpMatrix);
    var lTmpVec3 = vec3( -gObjCoord[0], -gObjCoord[1], -gObjCoord[2] );
    var lTmpMatrix = translate(lTmpVec3);
    gModelMatrix = mult(gModelMatrix, lTmpMatrix);

    gl.useProgram( gGLSLprogram[id] );

    // now call gl.uniformMatrix4fv( gl.getUniformLocation(...), ... )
    //   so that all 3 matrices are set in the vertex shader:
   
    gl.useProgram( gGLSLprogram[id] );
    setUniformMatrices(id);
    gl.bindBuffer( gl.ARRAY_BUFFER, gBufferId[id] );


    // Load the vertex data
    gl.vertexAttribPointer(gVertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gVertexLoc);
    
    // in this example we don't yet use arrays for colored vertices:
    //     gl.vertexAttribPointer(gColorLoc, 4, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(gColorLoc);    
    
    // Draw vertex arrays -- first find how many vertices!
   
    gNumVertices = gVertices.length;
    console.log("in drawContent() gVertices.length = " + gVertices.length)
    console.log("in drawContent() gNumVertices = " + gNumVertices)
    
    gColorLoc = gl.getUniformLocation(gGLSLprogram[id], "u_drawColor");
    gl.uniform3f(gColorLoc, 0.5, 0.5, 1.0);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, gNumVertices);

    gColorLoc = gl.getUniformLocation(gGLSLprogram[id ], "u_drawColor");
    gl.uniform3f(gColorLoc, 0, 1.0, 0.0);
    gl.drawArrays( gl.LINE_LOOP, 0, gNumVertices);
    gl.drawArrays( gl.POINTS, 0, gNumVertices);
    
    // count how many time canvas has been refreshed:
    i = i + 1
    
    // we "used up" any memorized mouse motion, therefore clean it:
    gDX = 0
    gDY = 0

    // update HTML debug information:
    updateDebug();

//    console.log("function drawContent END")

} // end of function drawContent()



// ------------------------------------------------------------
function setUniformMatrices(id){

//    console.log("function setUniformMatrices BEGIN")

    gl.uniformMatrix4fv( gl.getUniformLocation(gGLSLprogram[id], "u_P_Matrix"), false, flatten(gProjectionMatrix) );

    gl.uniformMatrix4fv( gl.getUniformLocation(gGLSLprogram[id], "u_M_Matrix"), false, flatten(gModelMatrix) );
    
    gl.uniformMatrix4fv( gl.getUniformLocation(gGLSLprogram[id], "u_V_Matrix"), false, flatten(gViewMatrix) );    

//    console.log("function setUniformMatrices END")

}




// ------------------------------------------------------------
function b581_GL_rollBall (pDeltaX, pDeltaY, pObjRotMat) {
    // returns new rotation matrix for object
    
    console.log("function b581_GL_rollBall BEGIN")


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

    console.log("function b581_GL_rollBall END")

} /* b581_GL_rollBall() */

// ------------------------------------------------------------



// ------------------------------------------------------------
function b581_GL_rotate2D (pDeltaX, pDeltaY, pObjRotMat) {
    // returns new rotation matrix for object
    
    console.log("function b581_GL_rotate2D BEGIN")


    var rotationAngle = 0;  
    var rotationAxis = vec3(0.0, 0.0, 1.0);
    var angleScale = 0.5 ;
    var rotateR = pDeltaX;
    
    // only rotate when there is some angle:
    //   angle can be positive or negative here...
    if ( (rotateR > 0.01) || (rotateR < -0.01) ) {
        rotationAngle = (rotateR * angleScale );
        
        return rotate(rotationAngle, rotationAxis);
        
    } else {
        // return identity if no rotation:
        return mat4(1);
    }

    console.log("function b581_GL_rotate2D END")

} /* b581_GL_rotate2D() */

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
    gMouseButtonCode = event.which;

    gMouseDownFlag = true;


    console.log("function handleMouseDown BEGIN")


// X and Y positions !!!
    if (event.x !== undefined && event.y !== undefined) {
        gXmouseDown = event.x + document.body.scrollLeft ; 
                            document.documentElement.scrollLeft;
        gYmouseDown = event.y + document.body.scrollTop ; 
                            document.documentElement.scrollTop;
    } else {
        // Firefox method to get the position
        gXmouseDown = event.clientX + document.body.scrollLeft; 
                            document.documentElement.scrollLeft;
        gYmouseDown = event.clientY + document.body.scrollTop; 
                            document.documentElement.scrollTop;
    }
    
    gXmousePrevious = gXmouseDown;
    gYmousePrevious = gYmouseDown;        
    gXmouseCurrent = gXmouseDown;
    gYmouseCurrent = gYmouseDown;        
    gDX = 0;
    gDY = 0;

    updateDebug();
    // if we're not running on automatic, call refresh:
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
    gMouseButtonCode = 0;

    gMouseDownFlag = false;


    // invalidate mouse coordinates:
    gXmouseDown = -1;
    gYmouseDown = -1;        
    gXmousePrevious = -1;
    gYmousePrevious = -1;        
    gXmouseCurrent = -1;
    gYmouseCurrent = -1;        
    gDX = 0;
    gDY = 0;

    updateDebug();
    // if we're not running on automatic, call refresh:
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
    // X and Y positions !!!
    
    // TODO fix mouse <-> canvas coordinates:
        if (event.x !== undefined && event.y !== undefined) {
            gXmouseCurrent = event.x + document.body.scrollLeft ; 
                                document.documentElement.scrollLeft;
            gYmouseCurrent = event.y + document.body.scrollTop ; 
                                document.documentElement.scrollTop;
        } else {
            // Firefox method to get the position
            gXmouseCurrent = event.clientX + document.body.scrollLeft; 
                                document.documentElement.scrollLeft;
            gYmouseCurrent = event.clientY + document.body.scrollTop; 
                                document.documentElement.scrollTop;
        }
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
        gDX = gXmouseCurrent - gXmousePrevious;
        gDY = -( gYmouseCurrent - gYmousePrevious );

        gXmousePrevious = gXmouseCurrent;
        gYmousePrevious = gYmouseCurrent;

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
        //   since a bug prevents it from working otherwise:  https://bugzilla.mozilla.org/show_bug.cgi?id=1048294
        // gMouseButtonCode = event.which;

        // detect if we're using the right button on the mouse:
        if (gMouseButtonCode === 3) { 
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
            if (interactionMode === "Rotate") {
                // rotate object:
                var deltaX =  gDX;
                var deltaY =  gDY;
                var lRotMat = mat4();
                lRotMat = b581_GL_rotate2D(deltaX, deltaY);

                // Perform space-fixed, left multiplication:                
                gObjRotMatrix = mult(lRotMat,gObjRotMatrix);
            }
        } // 
    }

    updateDebug();
    // if we're not running on automatic, call drawContent():
    drawContent(SelectId,gVertices2D[SelectId]);

    console.log("function handleMouseMotion END")
} // end of function handleMouseMotion(event) 
// ------------------------------------------------------------



function updateDebug(){
    gDebugLabel2.innerHTML = "Refresh Canvas: " + i + "<br>"
        + "Mouse Down: " + gMouseDownFlag + "<br>"
        + "Which Mouse Button: " + gMouseButtonCode + "<br>"
        + "Mouse Location : (" + gXmouseCurrent + ", " + gYmouseCurrent + ") <br>"
        + "Mouse (dx, dy) : (" + gDX + " " + gDY + ") <br>"
        + "Keyboard Shift Key: " + gModifierShiftKeyDown + "<br>"
        + "Interaction Mode: " + interactionMode + "<br>"
        + "Interact with Camera: " + cameraSpaceFlag + "<br>"
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

//------------------------------------------------------------
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

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
     texCoordsArray.push(texCoord[0]);
     gVertexArray.push(gVertices[b]); 
     gNormalsArray.push(normal); 
     gColorArray.push(color); 
     texCoordsArray.push(texCoord[1]);
     gVertexArray.push(gVertices[c]); 
     gNormalsArray.push(normal);   
     gColorArray.push(color);
     texCoordsArray.push(texCoord[2]); 
     gVertexArray.push(gVertices[a]);  
     gNormalsArray.push(normal); 
     gColorArray.push(color); 
     texCoordsArray.push(texCoord[3]);
     gVertexArray.push(gVertices[c]); 
     gNormalsArray.push(normal); 
     gColorArray.push(color); 
     texCoordsArray.push(texCoord[0]);
     gVertexArray.push(gVertices[d]); 
     gNormalsArray.push(normal);
     gColorArray.push(color); 
     texCoordsArray.push(texCoord[1]);
}

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
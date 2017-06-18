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

    if(i == 3){
        var tBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
        
        var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
        gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);
    
        configureTexture(normals);
    }
    }
    }
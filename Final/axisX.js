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
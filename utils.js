// -------------------------------- PROGRAM ----------------------------------

function swapProgram(program){
  gl.useProgram(program);
}
// -------------------------------- PROGRAM ----------------------------------
// -------------------------------- SHADING ----------------------------------

    // stores individual vertex normals for each vertex
    // does not consider vertices that are used in multiple triangles
    // flat shading
function get_flat_normals(vertices) { 
    var temp = [];
    var flat_normals = [];
    for (var j = 0; j < vertices.length; j++){
        temp[j] = vec3(0,0,0);
    }

    for (var i = 0; i < vertices.length-2; i+=3){ // goes through each triangle of the cow
        var u = subtract(vertices[i+1], vertices[i]);
        var v = subtract(vertices[i+2], vertices[i]);
        var faceNormal = cross(u,v); // finds face normal of each triangle

        temp[i] = add(temp[i], normalize(faceNormal));
        temp[i+1] = add(temp[i+1], normalize(faceNormal));
        temp[i+2] = add(temp[i+2], normalize(faceNormal));

        flat_normals.push(temp[i]);
        flat_normals.push(temp[i+1]);
        flat_normals.push(temp[i+2]);
    } 
    return flat_normals
}

// -------------------------------- SHADING ----------------------------------

    // stores weighted sums of vertex normals for each vertex
    // essentially averages these weighted sums to apply a smoothing effect
    // smooth phong shading
function get_smooth_normals(vertices, indices) {
    var temp = [];
    var flat_normals = [];

    for (var j = 0; j < vertices.length; j++){
        temp[j] = vec3(0,0,0);
    }

    for (var i = 0; i < indices.length; i++){ // goes through each triangle of the cow
        var u = subtract(vertices[indices[i][1] - 1], vertices[indices[i][0] - 1]);
        var v = subtract(vertices[indices[i][2] - 1], vertices[indices[i][0] - 1]);
        var faceNormal = cross(u,v); // finds face normal of each triangle

        temp[indices[i][0]- 1] = add(temp[indices[i][0]- 1], faceNormal); // adds face normal to each vertex of the triangle
        temp[indices[i][1]- 1] = add(temp[indices[i][1]- 1], faceNormal); // will continue to add face normals to vertices used in multiple triangles
        temp[indices[i][2]- 1] = add(temp[indices[i][2]- 1], faceNormal); // this acts as a way to find the weighted sums of vertex normals for each vertex
    }

    for (var k = 0; k < temp.length; k++){
        temp[k] = normalize(temp[k]); // normalize the vertex normal sums of each vertex 
    }

    for (var m = 0; m < indices.length; m++){
        for (var n = 0; n < 3; n++) {
            flat_normals.push(temp[indices[m][n] - 1]) // adds smooth shading normals to the normals array
        }
    }

    return flat_normals;
}

// -------------------------------- SHADING ----------------------------------

// ---------------------------- OBJECT CREATION ------------------------------

// TAKEN FROM TEXTBOOK CODING EXAMPLES: https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/CODE/GEOMETRY/geometryTest2.html
// USES MODIFIED FUNCTION FROM GEOMETRY.JS
function cylinder(numSlices, numStacks, caps) {

    var slices = 36;
    if(numSlices) slices = numSlices;
    var stacks = 1;
    if(numStacks) stacks = numStacks;
    var capsFlag = true;
    if(caps==false) capsFlag = caps;
    
    var data = {};
    
    
    var top = 0.5;
    var bottom = -0.5;
    var radius = 0.5;
    
    
    var cylinderVertexCoordinates = [];
    
    // side
    
    for(var j=0; j<stacks; j++) {
      var stop = bottom + (j+1)*(top-bottom)/stacks;
      var sbottom = bottom + j*(top-bottom)/stacks;
      var topPoints = [];
      var bottomPoints = [];

      for(var i =0; i<slices; i++) {
        var theta = 2.0*i*Math.PI/slices;
        topPoints.push([radius*Math.sin(theta), stop, radius*Math.cos(theta), 1.0]);
        bottomPoints.push([radius*Math.sin(theta), sbottom, radius*Math.cos(theta), 1.0]);
      };
    
      topPoints.push([0.0, stop, radius, 1.0]);
      bottomPoints.push([0.0,  sbottom, radius, 1.0]);
    
    
      for(var i=0; i<slices; i++) {
        var a = topPoints[i];
        var d = topPoints[i+1];
        var b = bottomPoints[i];
        var c = bottomPoints[i+1];
        var u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
        var v = [c[0]-b[0], c[1]-b[1], c[2]-b[2]];
    
        var normal = [
          u[1]*v[2] - u[2]*v[1],
          u[2]*v[0] - u[0]*v[2],
          u[0]*v[1] - u[1]*v[0]
        ];
    
        var mag = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2])
        normal = [normal[0]/mag, normal[1]/mag, normal[2]/mag];
        cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    
        cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
    
        cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    
        cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    
        cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    
        cylinderVertexCoordinates.push([d[0], d[1], d[2], 1.0]);
        };
    };
    
      var topPoints = [];
      var bottomPoints = [];
      for(var i =0; i<slices; i++) {
        var theta = 2.0*i*Math.PI/slices;
        topPoints.push([radius*Math.sin(theta), top, radius*Math.cos(theta), 1.0]);
        bottomPoints.push([radius*Math.sin(theta), bottom, radius*Math.cos(theta), 1.0]);
      };
      topPoints.push([0.0, top, radius, 1.0]);
      bottomPoints.push([0.0,  bottom, radius, 1.0]);
    
    if(capsFlag) {
    
    //top
    
    for(i=0; i<slices; i++) {
      normal = [0.0, 1.0, 0.0];
      var a = [0.0, top, 0.0, 1.0];
      var b = topPoints[i];
      var c = topPoints[i+1];
      cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    
      cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
    
      cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    };
    
    //bottom
    
    for(i=0; i<slices; i++) {
      normal = [0.0, -1.0, 0.0];
      var a = [0.0, bottom, 0.0, 1.0];
      var b = bottomPoints[i];
      var c = bottomPoints[i+1];
      cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    
      cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
    
      cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    };
    
    };

    data.TriangleVertices = cylinderVertexCoordinates;
    return data;
}

// ---------------------------- OBJECT CREATION ------------------------------
// ---------------------------------- MISC -----------------------------------

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

// ---------------------------------- MISC -----------------------------------

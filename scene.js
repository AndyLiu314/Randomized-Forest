var TREE_BASE_HEIGHT = 14.0;
var TREE_BASE_WIDTH = 2.0;
var LOWER_TREE_HEIGHT = 7.0;
var LOWER_TREE_WIDTH  = 1.75;
var UPPER_TREE_HEIGHT = 6.5;
var UPPER_TREE_WIDTH  = 1.5;
var BRANCH_HEIGHT = 5.0;
var BRANCH_WIDTH  = 1.0;
var TWIG_HEIGHT = 4.0;
var TWIG_WIDTH = 0.5;

var Base = 0;
var LowerTree = 1;
var UpperTree = 2;
var Branch = 3;
var Twig = 4;

var robot = [];
var theta = [];
var tree_positions = [];

var gl;
var canvas;
var program;
var tex_program;
var texture;
var texCoordsArray = [];

var vertices = [];
var indices = [];
var cow = [];
var normals = [];

var cube_vertices = [];
var cube_indices = [];
var cube = [];

var cylinderVertices = [];

var floor_vertices = [];
var floor = [];

var angleX = 0;
var angleY = 0;
var angleZ = 0;
var scale_val = 1;
var trans_x = 0;
var trans_y = 0;
var trans_z = 0;
var pos_x = 0; 
var pos_y = 0; 

var angle = 0;
var lightRadius = 20.0;
var rotationSpeed = 0.003;
var isRotating = true;
var lightPosition = vec4(8.0, 5.0, 5.0, 0.0 );

var lightAmbient = [vec4(0.5, 0.4, 0.3, 1.0 ), vec4(0.5, 0.4, 0.3, 1.0 )];
var lightDiffuse = [vec4( 0.6, 0.5, 0.4, 1.0 ), vec4(0.5, 0.4, 0.3, 1.0 )];
var lightSpecular = [vec4( 1.0, 1.0, 1.0, 1.0 ), vec4(0.5, 0.4, 0.3, 1.0 )];

var materialAmbient = [vec4( 0.5, 0.4, 0.3, 1.0 ), vec4(0.0, 0.7, 0.5, 1.0 )];
var materialDiffuse = [vec4( 0.5, 0.4, 0.3, 1.0 ), vec4(0.0, 0.7, 0.5, 1.0 )];
var materialSpecular = [vec4( 1.0, 1.0, 1.0, 1.0 ), vec4(0.0, 0.7, 0.5, 1.0 )];
var materialShininess = [5000000, 5000000];

var cowBuffer, cube_vBuffer, cylinderBuffer, robotBuffer;
var nBuffer, cylNormBuffer, robotNormBuffer;
var vNormal, vPosition;
var modelView, projection;
var eye, target, up;

function quad(a,  b,  c,  d, finalBuffer, vertices) {
    //colors.push(vertexColors[a]);
    finalBuffer.push(vertices[a]);
    //colors.push(vertexColors[a]);
    finalBuffer.push(vertices[b]);
    //colors.push(vertexColors[a]);
    finalBuffer.push(vertices[c]);
    //colors.push(vertexColors[a]);
    finalBuffer.push(vertices[a]);
    //colors.push(vertexColors[a]);
    finalBuffer.push(vertices[c]);
    //colors.push(vertexColors[a]);
    finalBuffer.push(vertices[d]);
}

function addSquareTexture(finalTexArray, texCoords){
    finalTexArray.push(texCoords[0]);
    finalTexArray.push(texCoords[1]);
    finalTexArray.push(texCoords[2]);
    finalTexArray.push(texCoords[0]);
    finalTexArray.push(texCoords[2]);
    finalTexArray.push(texCoords[3]);
    return finalTexArray;
}

function Cube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function resetCow(){
    trans_x = 0;
    trans_y = 0;
    trans_z = 0;

    angleX = 0;
    angleY = 0;
    angleZ = 0;
}

// creates transformation matrix for cow
function transformCow(){
    const model = [
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];

    // scale matrix
    var scale_mat = model;
    scale_mat = scalem(scale_val, scale_val, scale_val);

    // creates rotation matrix
    // var angleXYZ rotates the matrix
    // rotation depends on axis which is the second parameter (the array)
    let rotateX = rotate(angleX, [1.0, 0.0, 0.0]);
    let rotateY = rotate(angleY, [0.0, 1.0, 0.0]);
    let rotateZ = rotate(angleZ, [0.0, 0.0, 1.0]);
    var rotate_mat = mult(rotateZ, mult(rotateY, rotateX)); 

    // creates translation matrix
    // moves cow x y z 
    var translate_mat = translate(trans_x, trans_y, trans_z); 

    // final transformation matrix 
    return mult(translate_mat, mult(scale_mat, rotate_mat));
}

// view matrix function to orient camera
function viewMatrix() {
    // eye is camera location
    // target is reference position (basically cow position)
    // up is direction of up
    eye = vec3(3, 30, 60);
    target = vec3(0, 0, 0);
    up = vec3(0, 1, 0);

    // create view matrix
    return lookAt(eye, target, up);
}

// rotates point light
function updateLightPosition() {
    // calculate new x and z coordinates for the light
    var lightX = lightRadius * Math.cos(angle);
    var lightZ = lightRadius * Math.sin(angle);
  
    // update light's position vector
    lightPosition[0] = lightX;
    lightPosition[2] = lightZ;
  
    // update angle for the next frame
    angle += rotationSpeed;
}

// self-explanatory
function setLightUniforms(lightAmbient, materialAmbient, lightDiffuse, materialDiffuse, lightSpecular, materialSpecular, materialShininess){
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"), materialShininess );

    updateLightPosition();
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
}

// --------------------------ROBOT-----------------------------

function base(robotViewMatrix) {
    var s = scalem(TREE_BASE_WIDTH, TREE_BASE_HEIGHT, TREE_BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * TREE_BASE_HEIGHT, 0.0 ), s);
    var t = mult(robotViewMatrix, instanceMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotBuffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotNormBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniformMatrix4fv(modelView,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, robot.length );
    return robotViewMatrix;
}

function lowerArm(robotViewMatrix)
{
    var s = scalem(LOWER_TREE_WIDTH, LOWER_TREE_HEIGHT, LOWER_TREE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_TREE_HEIGHT, 0.0 ), s);
    var t = mult(robotViewMatrix, instanceMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotBuffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotNormBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniformMatrix4fv( modelView,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, robot.length );
    return robotViewMatrix;
}

function upperArm(robotViewMatrix) {
    var s = scalem(UPPER_TREE_WIDTH, UPPER_TREE_HEIGHT, UPPER_TREE_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_TREE_HEIGHT, 0.0 ),s);
    var t = mult(robotViewMatrix, instanceMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotBuffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotNormBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniformMatrix4fv( modelView,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, robot.length );
    return robotViewMatrix;
}

function branch(robotViewMatrix){
    var s = scalem(BRANCH_WIDTH, BRANCH_HEIGHT, BRANCH_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * BRANCH_HEIGHT, 0.0 ),s);
    var t = mult(robotViewMatrix, instanceMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotBuffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotNormBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniformMatrix4fv( modelView,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, robot.length );
    return robotViewMatrix;
}

function twig(robotViewMatrix){
    var s = scalem(TWIG_WIDTH, TWIG_HEIGHT, TWIG_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * TWIG_HEIGHT, 0.0 ),s);
    var t = mult(robotViewMatrix, instanceMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotBuffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, robotNormBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniformMatrix4fv( modelView,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, robot.length );
    return robotViewMatrix;
}

// --------------------------ROBOT-----------------------------

function initShaderVariables(){
    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation( program, "vNormal" );
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );
}

function initCylinder(){
    var myCylinder = cylinder(72, 3);
    cylinderVertices = myCylinder.TriangleVertices;
    cylinderBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cylinderVertices), gl.STATIC_DRAW);

    cylNormBuffer = gl.createBuffer();
    normals = get_flat_normals(cylinderVertices); // for flat shading
    gl.bindBuffer( gl.ARRAY_BUFFER, cylNormBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW ); 
}

function initCow(){
    indices = get_faces();
    vertices = get_vertices();
    for (var i = 0; i < indices.length; i++) {
      for (var j = 0; j < 3; j++) {
        cow.push(vertices[indices[i][j] - 1]);
      }
    }

    cowBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cowBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cow), gl.STATIC_DRAW);

    nBuffer = gl.createBuffer();
    normals = get_smooth_normals(vertices, indices);
    //normals = get_flat_normals(cow); // for flat shading
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW ); 
}

function initRobot(){
    var myRobot = cylinder(72, 3);
    robot = myRobot.TriangleVertices;
    robotBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, robotBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(robot), gl.STATIC_DRAW); 
     
    robotNormBuffer = gl.createBuffer(); 
    normals = get_flat_normals(robot); // for flat shading 
    gl.bindBuffer( gl.ARRAY_BUFFER, robotNormBuffer); 
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW ); 

    for (let i = 0; i < 20; i++){
        let row = [];
        for (let j = 0; j < 5; j ++) {
            row.push(getRandomNum(-80,80)); 
        }
        theta.push(row);
    }

    for (let m = 0; m < 20; m++){
        let row = [];
        for(let n = 0; n < 2; n++){
            row.push(getRandomNum(-60,60));
        }
        tree_positions.push(row);
    }
}

function initFloor() {
    // FLOOR
    floor_vertices = get_floor_vertices();
    quad(1, 0, 3, 2, floor, floor_vertices);
    floor_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floor_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(floor), gl.STATIC_DRAW);
    
    // FLOOR
    floor_normals = gl.createBuffer();
    normals = get_flat_normals(floor);
    gl.bindBuffer(gl.ARRAY_BUFFER, floor_normals);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
}

function drawCow(){
    // Cow MV matrix
    var transform_mat = mult(translate(-10,0,5), rotate(-30, [0.0, 1.0, 0.0]));
    var view = viewMatrix();
    var modelView_mat = mult(view, transform_mat);
    var aspect = canvas.width / canvas.height;
    var projection_mat = perspective(55.0, aspect, 0.1, 1000.0);

    // Drawing Cow
    gl.bindBuffer(gl.ARRAY_BUFFER, cowBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniformMatrix4fv(modelView, false, flatten(modelView_mat));
    gl.uniformMatrix4fv(projection, false, flatten(projection_mat) );

    gl.drawArrays(gl.TRIANGLES, 0, cow.length);
}

// Tree drawing function
function drawRobot(theta, translation){
    // Drawing Robot
    gl.bindBuffer(gl.ARRAY_BUFFER, robotBuffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var robotMV = mult(viewMatrix(), translation);
    robotMV = base(robotMV);
    robotMV = mult(robotMV, translate(0.0, TREE_BASE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(theta[LowerTree], 0, 0, 1 ));
    robotMV = lowerArm(robotMV);
    robotMV = mult(robotMV, translate(0.0, LOWER_TREE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(60, 1, -1, 1) );
    robotMV = upperArm(robotMV);
    robotMV = mult(robotMV, rotate(60, 1, -1, 1) );
    robotMV = upperArm(robotMV);
    robotMV = mult(robotMV, translate(0.0, UPPER_TREE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(-70, 0, 1, 1) );
    robotMV = branch(robotMV);
    robotMV = mult(robotMV, rotate(150, 0, 0, 1 ));
    robotMV = lowerArm(robotMV);
    robotMV = mult(robotMV, translate(0.0, LOWER_TREE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(theta[UpperTree], 0, 0, 1) );
    robotMV = upperArm(robotMV);
    robotMV = mult(robotMV, translate(0.0, UPPER_TREE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(theta[UpperTree], 0, 0, 1) );
    robotMV = branch(robotMV);
    robotMV = mult(robotMV, translate(0.0, BRANCH_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(30, 0, 0, 1) );
    robotMV = twig(robotMV);


    // NEW BRANCH LINE
    var robotMV = mult(viewMatrix(), translation );
    robotMV = base(robotMV);
    robotMV = mult(robotMV, translate(0.0, TREE_BASE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(55, 1, 0, 0 ));
    robotMV = lowerArm(robotMV);
    robotMV = mult(robotMV, translate(0.0, LOWER_TREE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(60, 1, -1, 1) );
    robotMV = upperArm(robotMV);
    robotMV = mult(robotMV, rotate(-50, 1, 0, 1) );
    robotMV = branch(robotMV);
    robotMV = mult(robotMV, rotate(-70, 0, -1, 1) );
    robotMV = upperArm(robotMV);
    robotMV = mult(robotMV, translate(0.0, UPPER_TREE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(theta[UpperTree], 0, 0, 1) );
    robotMV = branch(robotMV);
    robotMV = mult(robotMV, rotate(theta[UpperTree], 0, 0, 1) );
    robotMV = branch(robotMV);
    robotMV = mult(robotMV, translate(0.0, BRANCH_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(30, 0, 0, 1) );
    robotMV = twig(robotMV);

    // NEW BRANCH LINE
    var robotMV = mult(viewMatrix(), translation );
    robotMV = base(robotMV);
    robotMV = mult(robotMV, translate(0.0, TREE_BASE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(theta[LowerTree], 0, 0, 1 ));
    robotMV = lowerArm(robotMV);
    robotMV = mult(robotMV, translate(0.0, LOWER_TREE_HEIGHT, 0.0));
    robotMV = mult(robotMV, rotate(60, 1, -1, 1) );
    robotMV = upperArm(robotMV);

}

function drawCylinder(){
    var cMV = viewMatrix(); 
    //cMV = mult(cMV, rotate(20, [1,0,0]))
    cMV = mult(cMV, scalem(5.0,10.0,1.0))
    gl.uniformMatrix4fv(modelView,  false, flatten(cMV) );
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, cylNormBuffer);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
    
    gl.drawArrays(gl.TRIANGLES, 0, cylinderVertices.length);
}

function drawFloor(){
    var transform_mat = mat4();
    var view = viewMatrix();
    var modelView_mat = mult(view, transform_mat);
    gl.uniformMatrix4fv(modelView,  false, flatten(modelView_mat) );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, floor_buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, floor_normals);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.drawArrays( gl.TRIANGLES, 0, 6 );
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    	if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.7, 0.9, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    initShaderVariables();

    initFloor();

    initRobot();

    initCow();

    render();
}

function render (){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setLightUniforms(lightAmbient[0], materialAmbient[0], lightDiffuse[0], materialDiffuse[0], lightSpecular[0], materialSpecular[0], materialShininess[0]);
    drawCow();

    // for the random forest generation
    for (let r = 0; r < 20; r++){
        let ranTranslate = translate(tree_positions[r][0], -3.5, tree_positions[r][1])
        drawRobot(theta[r], ranTranslate);
    }

    setLightUniforms(lightAmbient[1], materialAmbient[1], lightDiffuse[1], materialDiffuse[1], lightSpecular[1], materialSpecular[1], materialShininess[1]);
    drawFloor();

    window.requestAnimationFrame(render);
}
// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 2
// 17 October 2013


"use strict";
function RenderableModel(gl,model){
	function Drawable(attribLocations, vArrays, nVertices, indexArray, drawMode){
	  // Create a buffer object
	  var vertexBuffers=[];
	  var nElements=[];
	  var nAttributes = attribLocations.length;

	  for (var i=0; i<nAttributes; i++){
		  if (vArrays[i]){
			  vertexBuffers[i] = gl.createBuffer();
			  if (!vertexBuffers[i]) {
				console.log('Failed to create the buffer object');
				return null;
			  }
			  // Bind the buffer object to an ARRAY_BUFFER target
			  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[i]);
			  // Write date into the buffer object
			  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vArrays[i]), gl.STATIC_DRAW);
			  nElements[i] = vArrays[i].length/nVertices;
		  }
		  else{
			  vertexBuffers[i]=null;
		  }
	  }

	  var indexBuffer=null;
	  if (indexArray){
		indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
	  }
	  
	  this.draw = function (){
		for (var i=0; i<nAttributes; i++){
		  if (vertexBuffers[i]){
			  gl.enableVertexAttribArray(attribLocations[i]);
			  // Bind the buffer object to target
			  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[i]);
			  // Assign the buffer object to a_Position variable
			  gl.vertexAttribPointer(attribLocations[i], nElements[i], gl.FLOAT, false, 0, 0);
		  }
		  else{
			  gl.disableVertexAttribArray(attribLocations[i]); 
			  gl.vertexAttrib3f(attribLocations[i],1,1,1);
			  //console.log("Missing "+attribLocations[i])
		  }
		}
		if (indexBuffer){
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(drawMode, indexArray.length, gl.UNSIGNED_SHORT, 0);
		}
		else{
			gl.drawArrays(drawMode, 0, nVertices);
		}
	  }
	}
	
	// Vertex shader program
	var VSHADER_SOURCE =
		'attribute vec3 position;\n' + 
		'attribute vec3 normal;\n' + 
		'uniform mat4 modelT, viewT, projT;\n' + 
		'uniform mat4 normalMatrix;\n' + 
		'uniform vec3 lightColor, lightPosition, ambientLight;\n' + 
		'varying vec3 fcolor;\n' +
		'varying vec3 fragPosition;\n' + 
		'varying vec3 fragNormal;\n' + 
		'void main() {\n' +
		'  gl_Position = projT*viewT*modelT*vec4(position,1.0);\n' + 
		'  fragNormal = normalize((normalMatrix * vec4(normal, 0.0)).xyz);\n' +
		'  fragPosition = (modelT * vec4(position, 1.0)).xyz;\n' +
	     '  vec3 lightDirection = normalize(lightPosition - fragPosition);\n' +
		'  float cosThetaIn = max(dot(fragNormal, lightDirection), 0.0);\n' +
		'  vec3 diffuse = lightColor * vec3(0.8,0.8,0.8) * cosThetaIn;\n' +
		'  vec3 ambient = ambientLight * vec3(0.8,0.8,0.8);\n' +
		'  fcolor = (diffuse + ambient);\n' +
		'}\n';

	// Fragment shader program
	var FSHADER_SOURCE =
		'varying lowp vec3 fcolor;\n' +
		'varying lowp vec3 fragPosition;\n' +
		'varying lowp vec3 fragNormal;\n' +
		'void main() {\n' +
		'  gl_FragColor = vec4(fcolor, 1.0);\n' +
		'}\n';
	  
	var program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	if (!program) {
		console.log('Failed to create program');
		return false;
	}
	//else console.log('Shader Program was successfully created.');
	var a_Position = gl.getAttribLocation(program, 'position');		  
	//var a_Color = gl.getAttribLocation(program, 'color');
	var a_Normal = gl.getAttribLocation(program, 'normal');
	var a_Locations = [a_Position,a_Normal];
	//console.log(a_Locations);
	// Get the location/address of the uniform variable inside the shader program.
	var mmLoc = gl.getUniformLocation(program,"modelT");
	var vmLoc = gl.getUniformLocation(program,"viewT");
	var pmLoc = gl.getUniformLocation(program,"projT");
	//var mvpLoc = gl.getUniformLocation(program,"mvpT");
	var u_NormalMatrix = gl.getUniformLocation(program, 'normalMatrix');
	var u_LightColor = gl.getUniformLocation(program, 'lightColor');
	var u_LightPosition = gl.getUniformLocation(program, 'lightPosition');
	var u_AmbientLight = gl.getUniformLocation(program, 'ambientLight');

	var normalMat = new Matrix4();
	
	var drawables = [];
	var modelTransformations = [];
	var nDrawables = 0;
	var nNodes = (model.nodes)? model.nodes.length:1;
	var drawMode=(model.drawMode)?gl[model.drawMode]:gl.TRIANGLES;

	for (var i = 0; i < nNodes; i++){
		var nMeshes = (model.nodes)?(model.nodes[i].meshIndices.length):(model.meshes.length);
		for (var j = 0; j < nMeshes; j++){
			var index = (model.nodes)?model.nodes[i].meshIndices[j]:j;
			var mesh = model.meshes[index];
			// setup normal
			//a_Normal = mesh.vertexNormals;
			drawables[nDrawables] = new Drawable(
				a_Locations,[mesh.vertexPositions, mesh.vertexNormals],
				mesh.vertexPositions.length/3,
				mesh.indices, drawMode
			);
			
			var m = new Matrix4();
			if (model.nodes)
				m.elements=new Float32Array(model.nodes[i].modelMatrix);
			modelTransformations[nDrawables] = m;
			
			nDrawables++;
		}
	}
	// Get the location/address of the vertex attribute inside the shader program.
	this.draw = function (pMatrix,vMatrix,mMatrix)
	{
		gl.useProgram(program);
		gl.uniformMatrix4fv(pmLoc, false, pMatrix.elements);
		gl.uniformMatrix4fv(vmLoc, false, vMatrix.elements);
		
		// Set the light color (white)
		gl.uniform3f(u_LightColor, 1, 1, 1);
		// Set the light direction (in the world coordinate)
		gl.uniform3fv(u_LightPosition, camera.speclight);
		// Set the ambient light
		gl.uniform3f(u_AmbientLight, .1, .1, .1);
		
		//var vpMatrix = new Matrix4(pMatrix).multiply(vMatrix); // Right multiply
		for (var i = 0; i < nDrawables; i++){
			//var mMatrix=modelTransformations[i];
			//var mvpMatrix = new Matrix4(vpMatrix).multiply(mMatrix);
			//gl.uniformMatrix4fv(mvpLoc, false, mvpMatrix.elements);
			gl.uniformMatrix4fv(mmLoc, false, (mMatrix)?(new Matrix4(mMatrix).multiply(modelTransformations[i])).elements
				:modelTransformations[i].elements);

			// Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
			//normalMat = modelMatrixToNormalMatrix(vMatrix);
			normalMat.setInverseOf(vMatrix);
			normalMat.transpose();
			gl.uniformMatrix4fv(u_NormalMatrix, false, normalMat.elements);
			
			drawables[i].draw();
		}
		gl.useProgram(null);
	}
	this.getBounds=function() // Computes Model bounding box
	{		
		var xmin, xmax, ymin, ymax, zmin, zmax;
		var firstvertex = true;
		var nNodes = (model.nodes)?model.nodes.length:1;
		for (var k=0; k<nNodes; k++){
			var m = new Matrix4();
			if (model.nodes)m.elements=new Float32Array(model.nodes[k].modelMatrix);
			//console.log(model.nodes[k].modelMatrix);
			var nMeshes = (model.nodes)?model.nodes[k].meshIndices.length:model.meshes.length;
			for (var n = 0; n < nMeshes; n++){
				var index = (model.nodes)?model.nodes[k].meshIndices[n]:n;
				var mesh = model.meshes[index];
				for(var i=0;i<mesh.vertexPositions.length; i+=3){
					var vertex = m.multiplyVector4(new Vector4([mesh.vertexPositions[i],mesh.vertexPositions[i+1],mesh.vertexPositions[i+2],1])).elements;
					//if (i==0){
					//	console.log([mesh.vertexPositions[i],mesh.vertexPositions[i+1],mesh.vertexPositions[i+2]]);
					//	console.log([vertex[0], vertex[1], vertex[2]]);
					//}
					if (firstvertex){
						xmin = xmax = vertex[0];
						ymin = ymax = vertex[1];
						zmin = zmax = vertex[2];
						firstvertex = false;
					}
					else{
						if (vertex[0] < xmin) xmin = vertex[0];
						else if (vertex[0] > xmax) xmax = vertex[0];
						if (vertex[1] < ymin) ymin = vertex[1];
						else if (vertex[1] > ymax) ymax = vertex[1];
						if (vertex[2] < zmin) zmin = vertex[2];
						else if (vertex[2] > zmax) zmax = vertex[2];
					}
				}
			}
		}
		var dim = {};
		dim.min = [xmin,ymin,zmin];
		dim.max = [xmax,ymax,zmax];
		//console.log(dim);
		return dim;
	}
}
function modelMatrixToNormalMatrix(mat)
{ 
	var a00 = mat.elements[0], a01 = mat.elements[1], a02 = mat.elements[2],
	a10 = mat.elements[4], a11 = mat.elements[5], a12 = mat.elements[6],
	a20 = mat.elements[8], a21 = mat.elements[9], a22 = mat.elements[10],
	b01 = a22 * a11 - a12 * a21,
	b11 = -a22 * a10 + a12 * a20,
	b21 = a21 * a10 - a11 * a20,
	d = a00 * b01 + a01 * b11 + a02 * b21,
	id;

	if (!d) { return null; }
	id = 1 / d;

	var dest = new Matrix4();

	dest.elements[0] = b01 * id;
	dest.elements[4] = (-a22 * a01 + a02 * a21) * id;
	dest.elements[8] = (a12 * a01 - a02 * a11) * id;
	dest.elements[1] = b11 * id;
	dest.elements[5] = (a22 * a00 - a02 * a20) * id;
	dest.elements[9] = (-a12 * a00 + a02 * a10) * id;
	dest.elements[2] = b21 * id;
	dest.elements[6] = (-a21 * a00 + a01 * a20) * id;
	dest.elements[10] = (a11 * a00 - a01 * a10) * id;

	return dest;
}
function RenderableWireBoxModel(gl,d){
	var wireModel = new RenderableModel(gl,cubeLineObject);
	var factor = [(d.max[0]-d.min[0])/2,(d.max[1]-d.min[1])/2,(d.max[2]-d.min[2])/2];
	var center = [(d.min[0]+d.max[0])/2,(d.min[1]+d.max[1])/2,(d.min[2]+d.max[2])/2];
	var transformation = new Matrix4().
		translate(center[0], center[1],center[2]).
		scale(factor[0],factor[1],factor[2]);
	this.draw = function(mP,mV,mM){
		wireModel.draw(mP,mV,new Matrix4(mM).multiply(transformation));
	}
}
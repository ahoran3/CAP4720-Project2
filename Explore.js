// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 2
// 17 October 2013

// ... global variables ...
var canvas = null;
var messageField = null;

function setupMessageArea() 
{
    messageField = document.getElementById("messageArea");
  	// document.getElementById("messageClear").setAttribute("onclick", "messageField.value='';");
}

function addMessage(message) 
{
    var st = "->" + message + "\n";
    messageField.value += st;
}

//This function gets called when reading a JSON file. It stores the current xml information.
function parseJSON(jsonFile)
{
	var	xhttp = new XMLHttpRequest();
	xhttp.open("GET", jsonFile, false);
	xhttp.overrideMimeType("application/json");
	xhttp.send(null);	
	var Doc = xhttp.responseText;
	return JSON.parse(Doc);
}
var gl;
var model, camera, projMatrix;
var modelTextures = Array();
var numTextures;

function loadModel(modelfilename)
{
	addMessage("loading "+modelfilename+ "\\models\\model.json");
	model = new RenderableModel(gl,parseJSON(modelfilename+ "\\models\\model.json"));
	camera = new Camera(gl,model.getBounds(),[0,1,0]);
	projMatrix = camera.getProjMatrix();
	
	// geometry is loaded, now load textures
	var modelImage = new Image();

	for (var i=0; i < numTextures; i++) 
	{
	  addMessage("loading "+modelfilename+ "\\images\\texture"+i+".jpg");
	  modelImage.src = modelfilename+ "\\images\\texture"+i+".jpg";
	
	  var texture = gl.createTexture();
	  texture.image = modelImage;
	  modelTextures.push(texture);
	}
	
    modelImage.onload = function()
	{
      handleLoadedTexture(modelTextures)
    }

	function createTexture(imageFileName)
	{
	  var tex = gl.createTexture();
	  var img = new Image();
	  img.onload = function()
	  {
		  gl.bindTexture(gl.TEXTURE_2D, tex);
		  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		  gl.bindTexture(gl.TEXTURE_2D, null);
	  }
	}
}

function mainFunction(){
	
	setupMessageArea();
	
	canvas = document.getElementById("myCanvas");
	addMessage(((canvas)?"Canvas acquired":"Error: Can not acquire canvas"));
	gl = getWebGLContext(canvas);
	
	var angle=0;
	var modelList = document.getElementById("modelList");
	loadModel(modelList.options[modelList.selectedIndex].value);
	addMessage("Using model " + modelList.options[modelList.selectedIndex].value);
	
	switch (modelList.selectedIndex)
	{
		case 0:  numTextures= 204; break; //st peter
		case 1:  numTextures= 62;  break; //st basil
		case 2:  numTextures= 83;  break; //shrine
		case 3:  numTextures= 43;  break; //dijon
		case 4:  numTextures= 16;  break; //house
		default: numTextures= 0;   break; //whoops
	} 
	

	function draw(){
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		var viewMatrix = camera.getRotatedViewMatrix(angle);
		model.draw(projMatrix, viewMatrix);
		angle++; if (angle > 360) angle -= 360;
		window.requestAnimationFrame(draw);
	}

	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);

	draw();
	return 1;
}

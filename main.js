// This function gets called when reading a JSON file. It stores the current xml information.
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
function loadModel(modelfilename)
{
	//console.log(modelfilename);
	model = new RenderableModel(gl,parseJSON(modelfilename));
	camera = new Camera(gl,model.getBounds(),[0,1,0]);
	projMatrix = camera.getProjMatrix();
}

function main()
{
	// ... global variables ...
	var canvas = null;
	var messageField = null;
	function addMessage(message){
		console.log(message);
	}
	canvas = document.getElementById("myCanvas");
	addMessage(((canvas)?"Canvas acquired":"Error: Can not acquire canvas"));
	gl = getWebGLContext(canvas, true); // TODO - disable debugging before submitting
		
	var angle=0;
	var modelList = document.getElementById("modelList")
	loadModel(modelList.options[modelList.selectedIndex].value);
	
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
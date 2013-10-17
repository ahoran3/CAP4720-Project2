// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 2
// 17 October 2013

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

var currentlyPressedKeys = {};

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	// ASCII Values
	KeyboardEnum = 
	{
		W : 87,
		A : 65,
		S : 83,
		D : 68,
		Q : 81,
		E : 69,
		Z : 90,
		X : 88,
		UP_ARROW 	: 38,
		LEFT_ARROW	: 37,
		RIGHT_ARROW	: 39,
		DOWN_ARROW 	: 40
	}

	//functions for user camera control 
	//the '-1' or '+1' from the parameter allows user to use the same function with different directions
	
	if (currentlyPressedKeys[KeyboardEnum.Z]) {
	  // z - ZOOM IN 
	  console.log("z");
	  projMatrix = camera.getZoomedProjMatrix(-1);
	}

	if (currentlyPressedKeys[KeyboardEnum.X]) {
	  // x- ZOOM OUT 
	  console.log("x");
	  projMatrix = camera.getZoomedProjMatrix(1);
	}	

	if (currentlyPressedKeys[KeyboardEnum.W]) {
	  // w - DOLLY-IN (MOVE FORWARD)
	  console.log("w");
	  var viewMatrix = camera.getDolliedViewCameraPosition(1);
	}

	if (currentlyPressedKeys[KeyboardEnum.A]) {
	  // a - 	TRUCK LEFT 
	  console.log("a");
	  var viewMatrix = camera.getTruckedViewCameraPosition(1);
	}

	if (currentlyPressedKeys[KeyboardEnum.S]) {
	  // s - DOLLY-OUT (MOVE BACK)
	  console.log("s");
	  var viewMatrix = camera.getDolliedViewCameraPosition(-1);
	}

	if (currentlyPressedKeys[KeyboardEnum.D]) {
	  // d - TRUCK RIGHT
	  console.log("d");
	  var viewMatrix = camera.getTruckedViewCameraPosition(-1);
	}

	if (currentlyPressedKeys[KeyboardEnum.Q]) {
	  // q - PEDESTAL UP (CAMERA HEIGHT) 
	  console.log("q");
	  var viewMatrix = camera.getPedestaledViewCameraPosition(1);
	}

	if (currentlyPressedKeys[KeyboardEnum.E]) {
	  // e - PEDESTAL DOWN (CAMERA HEIGHT)
	  console.log("e");
	  var viewMatrix = camera.getPedestaledViewCameraPosition(-1);
	}
	
	if (currentlyPressedKeys[KeyboardEnum.LEFT_ARROW]) {
	  // Left cursor key - HORIZONTAL PAN (YAW) LEFT
	  console.log("<");
	  var viewMatrix = camera.getYawedViewCameraPosition(1);
	}
	
	if (currentlyPressedKeys[KeyboardEnum.RIGHT_ARROW]) {
	  // Right cursor key - HORIZONTAL PAN (YAW) RIGHT
	  console.log(">");
	  var viewMatrix = camera.getYawedViewCameraPosition(-1);
	}
	
	if (currentlyPressedKeys[KeyboardEnum.UP_ARROW]) {
	  // Up cursor key - VERTICAL PAN (TILT) UP 	
	  console.log("^");
	  var viewMatrix = camera.getTiltedViewCameraPosition(1);
	}
	
	if (currentlyPressedKeys[KeyboardEnum.DOWN_ARROW]) {
	  // Down cursor key - VERTICAL PAN (TILT) DOWN
	  console.log("V");
	  var viewMatrix = camera.getTiltedViewCameraPosition(-1);
	}
}

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


function main()
{
	// ... global variables ...
	var canvas = null;
	var messageField = null;

	setupMessageArea();

	//message for user controls
	//addMessage("Movement Controls:\nw\t- DOLLY-IN\na\t- TRUCK LEFT\ns\t- DOLLY-OUT\nd\t- TRUCK RIGHT\nq\t- PEDESTAL UP (CAMERA HEIGHT)\ne\t- PEDESTAL DOWN (CAMERA HEIGHT)\nLeft\t- HORIZONTAL PAN (YAW) LEFT\nRight\t- HORIZONTAL PAN (YAW) RIGHT\nUp\t- VERTICAL PAN (TILT) UP\nDown\t- VERTICAL PAN (TILT) DOWN");
	
	canvas = document.getElementById("myCanvas");
	console.log(((canvas)?"Canvas acquired":"Error: Can not acquire canvas"));
	gl = getWebGLContext(canvas, false); // TODO - disable debugging before submitting
	
	document.onkeydown = handleKeyDown;
    	document.onkeyup = handleKeyUp;
		
	var angle=0;
	var modelList = document.getElementById("modelList")
	loadModel(modelList.options[modelList.selectedIndex].value);
	
	function draw(){
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		var viewMatrix = camera.getRotatedViewMatrix(angle);
		model.draw(projMatrix, viewMatrix);
		if (angle > 360) angle -= 360;
		window.requestAnimationFrame(draw);
		handleKeys();
	}

	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);

	draw();
	return 1;
}
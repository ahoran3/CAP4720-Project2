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

	if (String.fromCharCode(event.keyCode) == "F") {
	  filter += 1;
	  if (filter == 3) {
		filter = 0;
	  }
	}
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
		UP_ARROW 	: 38,
		LEFT_ARROW	: 37,
		RIGHT_ARROW	: 39,
		DOWN_ARROW 	: 40
	}

	if (currentlyPressedKeys[KeyboardEnum.W]) {
	  // w
	  console.log("w");
	}
	if (currentlyPressedKeys[KeyboardEnum.A]) {
	  // a
	  console.log("a");
	}
	if (currentlyPressedKeys[KeyboardEnum.S]) {
	  // s
	  console.log("s");
	}
	if (currentlyPressedKeys[KeyboardEnum.D]) {
	  // d
	  console.log("d");
	}
	if (currentlyPressedKeys[KeyboardEnum.Q]) {
	  // q
	  console.log("q");
	}
	if (currentlyPressedKeys[KeyboardEnum.E]) {
	  // e
	  console.log("e");
	}
	if (currentlyPressedKeys[KeyboardEnum.LEFT_ARROW]) {
	  // Left cursor key
	  console.log("<");
	}
	if (currentlyPressedKeys[KeyboardEnum.RIGHT_ARROW]) {
	  // Right cursor key
	  console.log(">");
	}
	if (currentlyPressedKeys[KeyboardEnum.UP_ARROW]) {
	  // Up cursor key
	  console.log("^");
	}
	if (currentlyPressedKeys[KeyboardEnum.DOWN_ARROW]) {
	  // Down cursor key
	  console.log("V");
	}
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
	
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
		
	var angle=0;
	var modelList = document.getElementById("modelList")
	loadModel(modelList.options[modelList.selectedIndex].value);
	
	function draw(){
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		var viewMatrix = camera.getRotatedViewMatrix(angle);
		model.draw(projMatrix, viewMatrix);
		angle++; if (angle > 360) angle -= 360;
		window.requestAnimationFrame(draw);
		handleKeys();
	}

	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);

	draw();
	return 1;
}
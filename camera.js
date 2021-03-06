// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 2
// 17 October 2013

function Camera(gl,d,modelUp) // Compute a camera from model's bounding box dimensions
{
	var center = [(d.min[0]+d.max[0])/2,(d.min[1]+d.max[1])/2,(d.min[2]+d.max[2])/2];
	var diagonal = Math.sqrt(Math.pow((d.max[0]-d.min[0]),2)+Math.pow((d.max[1]-d.min[1]),2)+Math.pow((d.max[2]-d.min[2]),2));
	var ZoomDelta = Math.sqrt(Math.sqrt(diagonal/4));
	var angleDelta = Math.sqrt(diagonal/10);
	var moveDelta = diagonal/100;

	//console.log(center+" "+diagonal);
	
	//variables for automatic camera rotation	
	var name = "auto";
	var at = center;
	var eye = [center[0], center[1]+diagonal*0.5, center[2]+diagonal*1.5];
	var up = [modelUp[0],modelUp[1],modelUp[2]];
	var near = diagonal*0.1;
	var far = diagonal*3;
	var FOV = 32;
	var viewMatrix = null;

	this.neweye=eye;
	this.speclight=eye;
	this.getRotatedCameraPosition= function(angle){
		var m = new Matrix4().setTranslate(at[0],at[1],at[2]).rotate(angle,up[0],up[1],up[2]).translate(-at[0],-at[1],-at[2]);
		var e = m.multiplyVector4(new Vector4([eye[0],eye[1],eye[2],1])).elements;
		return [e[0],e[1],e[2]];
	};
	this.getViewMatrix=function(e){
		if (e==undefined) e = eye;
		//if (!viewMatrix)
			viewMatrix = new Matrix4().setLookAt(e[0],e[1],e[2],at[0],at[1],at[2],up[0],up[1],up[2]);
		return viewMatrix;
	}
	this.getRotatedViewMatrix=function(angle){
		neweye=this.getRotatedCameraPosition(angle);
		return this.getViewMatrix(neweye);
	}
	this.getProjMatrix=function(){
		return new Matrix4().setPerspective(FOV, gl.canvas.width / gl.canvas.height, near , far);
	}
	
	//functions for user camera control 
	//the '-1' or '+1' from the parameter in main.js allows us to use the same function with different directions
	
	this.getZoomedProjMatrix=function(direction){
		FOV = Math.min(60,Math.max((FOV + direction*ZoomDelta),5));
		return camera.getProjMatrix();
	}
	this.getTiltedViewCameraPosition=function(direction){
		center[1] += direction*angleDelta;
		//at[1] += direction*angleDelta;
		neweye = [center[0], center[1], center[2]];
		return this.getViewMatrix(neweye);
	}
	this.getYawedViewCameraPosition=function(direction){ 
		center[0] += direction*angleDelta;
		// at[0] += direction*angleDelta;
		neweye = [center[0], center[1], center[2]];
		return this.getViewMatrix(neweye);
	}
	this.getPedestaledViewCameraPosition=function(direction){ 
		// var delta = direction * diagonal * 0.02; // increment of movement
		// Check to make sure view matrix is not null
		// if (!viewMatrix){
			// this.getViewMatrix; // set the viewMatrix
		// }	
		// viewMatrix.translate(-up[0]*delta, -up[1]*delta, -up[2]*delta)*eye;
		// viewMatrix.translate(-up[0]*delta, -up[1]*delta, -up[2]*delta)*at;
		// return viewMatrix;
		eye[1] += direction*angleDelta;
		at[1] += direction*angleDelta;
	}
	this.getTruckedViewCameraPosition=function(direction){ 
		eye[0] += direction*moveDelta;
		at[0] += direction*moveDelta;
	}
	this.getDolliedViewCameraPosition=function(direction){ 
		eye[2] += direction*moveDelta;
		at[2] += direction*moveDelta;
	};


}

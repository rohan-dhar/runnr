/********************************************************************************

	Vectr.js: A general purpose JavaScript library for Vector operations.
	Developed by Rohan Dhar

**********************************************************************************/

//Main global constructor/
window.Vectr = function(p1, p2){
	//If coordinates are provided as discreet parameters
	if(typeof p1 === "number" || typeof p1 === "string" || typeof p2 === "number" || typeof p2 === "string"){
		this.x = ( !isNaN(p1) ) ? Number(p1) : 0;
		this.y = ( !isNaN(p2) ) ? Number(p2) : 0;		

	//If coordinates or angle and magnitude are provided as an object
	}else if(typeof p1 === "object"){
		if(p1.x || p1.x === 0 || p1.y || p1.y === 0){
			this.x = ( !isNaN(p1.x) ) ? Number(p1.x) : 0;
			this.y = ( !isNaN(p1.y) ) ? Number(p1.y) : 0;
		}else if(p1.magnitude && (p1.angleDeg || p1.angle || p1.angle === 0 || p1.angleDeg === 0)){			

			//If the angle is provided in degrees
			//If both angle and angleDeg are provided, angleDeg is given prefernece
			if(p1.angleDeg || p1.angleDeg === 0){
				this.x = p1.magnitude * Math.cos(this.toRadian(p1.angleDeg));
				this.y = p1.magnitude * Math.sin(p1.angleDeg * Math.PI / 180);
			}else{
				this.x = p1.magnitude * Math.cos(p1.angle);				
				this.y = p1.magnitude * Math.sin(p1.angle);				
			}
		}

	//If nothing is provided
	}else{
		this.x = 0;		
		this.y = 0;		
	}
}







/********************************************************************************

	Helper Methods OR zero Vectr methods
	Used to provide general utility and do not perform and vector operations

**********************************************************************************/
Vectr.toDegree = function(rad) {
	(isNaN(rad)) ? rad = 1 : rad = Number(rad);
	return rad * 180 / Math.PI;
};

Vectr.toRadian = function(deg) {
	(isNaN(deg)) ? deg = 1 : deg = Number(deg);
	return deg * Math.PI / 180;
}







/********************************************************************************

	Vectr representation methods
	Used to get a Vectr is a particular format

**********************************************************************************/
Vectr.prototype.magnitude = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y); //Math.pow avoided due to performance limitations
}

Vectr.prototype.angle = function(deg){
	if(deg){
		return Vectr.toDegree(Math.atan2(this.x , this.y));
	}else{
		return Math.atan2(this.x , this.y);
	}
}

Vectr.prototype.direction = function(deg){
	return this.angle(deg);
};

Vectr.prototype.verticalAngle = function(deg){
	return this.angle(deg) - (deg) ? 90 : Math.PI/2;
}

Vectr.prototype.getAs = function(type, angleAndMag, deg){

	if(type.toLowerCase() === "array"){
		if(angleAndMag){
			if(deg){
				return [this.angle(true), this.magnitude()]
			}else{
				return [this.angle(), this.magnitude()];
			}
		}else{
			return [this.x, this.y];
		}
	}else if(type.toLowerCase() === "object"){
		if(angleAndMag){
			if(deg){
				return {angle: this.angle(true), magnitude: this.magnitude()};
			}else{
				return {angle: this.angle(), magnitude: this.magnitude()};
			}
		}else{
			return {x: this.x, y: this.y}
		}
	}else{
		if(angleAndMag){
			if(deg){
				return "angle: "+this.angle(true)+", magnitude: "+this.magnitude();
			}else{
				return "angle: "+this.angle()+", magnitude: "+this.magnitude();
			}
		}else{
			return "x: "+this.x+", y: "+this.y;
		}
	}
}






/********************************************************************************

	Single Vectr operation methods
	Used to perform common single Vectr operations

**********************************************************************************/
Vectr.prototype.normalize = function(onNew){
	var magnitude =  this.magnitude();
	return this.divide(magnitude, onNew);
}


Vectr.prototype.invert = function(onNew){
	if(onNew){
		return new Vectr(-this.x, -this.y);
	}else{	
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
}
Vectr.prototype.invertX = function(onNew){
	if(onNew){
		return new Vectr(-this.x, this.y);
	}else{	
		this.x = -this.x;
		return this;
	}
}
Vectr.prototype.invertY = function(onNew){
	if(onNew){
		return new Vectr(this.x, -this.y);
	}else{	
		this.y = -this.y;
		return this;
	}
}

Vectr.prototype.abs = function(onNew){
	if(onNew){
		return new Vectr(Math.abs(this.x), Math.abs(this.y));
	}else{	
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		return this;
	}
}
Vectr.prototype.absX = function(onNew){
	if(onNew){
		return new Vectr(Math.abs(this.x), this.y);
	}else{	
		this.x = Math.abs(this.x);
		return this;
	}
}
Vectr.prototype.absY = function(onNew){
	if(onNew){
		return new Vectr(this.x, Math.abs(this.y));
	}else{	
		this.y = Math.abs(this.y);
		return this;
	}
}

Vectr.prototype.roundOff = function(onNew){
	if(onNew){
		return new Vectr(Math.round(this.x), Math.round(this.y));
	}else{
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);		
	}
}
Vectr.prototype.roundOffX = function(onNew){
	if(onNew){
		return new Vectr(Math.round(this.x),this.y);
	}else{
		this.x = Math.round(this.x);
	}

}
Vectr.prototype.roundOffY = function(onNew){
	if(onNew){
		return new Vectr(this.x, Math.round(this.y));
	}else{
		this.y = Math.round(this.y);		
	}
}

Vectr.prototype.swapXY = function(){
	var t = this.x;		
	this.x = this.y;
	this.y = t;
}

Vectr.prototype.rotateTo = function(angle, deg, onNew){
	if(isNaN(angle)){
		return false;
	}
	if(deg){
		angle = Vectr.toRadian(Number(angle));
	}

	var mag = this.magnitude();
	var x =  mag * Math.sin(angle), y = mag * Math.cos(angle);	

	if(onNew){
		return new Vectr(x, y);
	}else{
		this.x = x;
		this.y = y;		
		return this;
	}
}

Vectr.prototype.rotateBy = function(angle, deg, onNew){
	if(isNaN(angle)){
		return false;
	}
	if(deg){
		angle = Vectr.toRadian(Number(angle));
	}

	angle += this.angle();
	return this.rotateTo(angle, false, onNew);

}







/********************************************************************************

	Vectr arithmetic methods
	Used to perform common arethmetic operations on Vectrs

**********************************************************************************/
Vectr.prototype.operation = function(conf){

	//Unpacking the supplied object
	var x = conf.x, y = conf.y, n = conf.operant, onNew = conf.onNew, opt = conf.operation; 

	if(opt === "+"){	
		if(n instanceof Vectr){
			if(onNew){
				if(x && y){
					return new Vectr(this.x + n.x, this.y + n.y);
				}else if(x){
					return new Vectr(this.x + n.x, this.y);
				}else if(y){
					return new Vectr(this.x, this.y + n.y);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x += n.x;
				}
				if(y){
					this.y += n.y;	
				}
				return this;
			}
		}else if(!isNaN(n)){
			n = Number(n);

			if(onNew){
				if(x && y){
					return new Vectr(this.x + n, this.y + n);
				}else if(x){
					return new Vectr(this.x + n, this.y);
				}else if(y){
					return new Vectr(this.x, this.y + n);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x += n;
				}
				if(y){
					this.y += n;	
				}
				return this;
			}		
		}else{
			return false;
		}	
	}else if(opt === "*"){
		if(n instanceof Vectr){
			if(onNew){
				if(x && y){
					return new Vectr(this.x * n.x, this.y * n.y);
				}else if(x){
					return new Vectr(this.x * n.x, this.y);
				}else if(y){
					return new Vectr(this.x, this.y * n.y);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x *= n.x;
				}
				if(y){
					this.y *= n.y;	
				}
				return this;
			}
		}else if(!isNaN(n)){
			n = Number(n);

			if(onNew){
				if(x && y){
					return new Vectr(this.x * n, this.y * n);
				}else if(x){
					return new Vectr(this.x * n, this.y);
				}else if(y){
					return new Vectr(this.x, this.y * n);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x *= n;
				}
				if(y){
					this.y *= n;	
				}
				return this;
			}		
		}else{
			return false;
		}	
	}else if(opt === "-"){
		if(n instanceof Vectr){
			if(onNew){
				if(x && y){
					return new Vectr(this.x - n.x, this.y - n.y);
				}else if(x){
					return new Vectr(this.x - n.x, this.y);
				}else if(y){
					return new Vectr(this.x, this.y - n.y);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x -= n.x;
				}
				if(y){
					this.y -= n.y;	
				}
				return this;
			}
		}else if(!isNaN(n)){
			n = Number(n);

			if(onNew){
				if(x && y){
					return new Vectr(this.x - n, this.y - n);
				}else if(x){
					return new Vectr(this.x - n, this.y);
				}else if(y){
					return new Vectr(this.x, this.y - n);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x -= n;
				}
				if(y){
					this.y -= n;	
				}
				return this;
			}		
		}else{
			return false;
		}	
	}else if(opt === "/"){
		if(n instanceof Vectr){
			if(onNew){
				if(x && y){
					return new Vectr(this.x / n.x, this.y / n.y);
				}else if(x){
					return new Vectr(this.x / n.x, this.y);
				}else if(y){
					return new Vectr(this.x, this.y / n.y);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x /= n.x;
				}
				if(y){
					this.y /= n.y;	
				}
				return this;
			}
		}else if(!isNaN(n)){
			n = Number(n);

			if(onNew){
				if(x && y){
					return new Vectr(this.x / n, this.y / n);
				}else if(x){
					return new Vectr(this.x / n, this.y);
				}else if(y){
					return new Vectr(this.x, this.y / n);					
				}else{
					return false;
				}
			}else{
				if(x){
					this.x /= n;
				}
				if(y){
					this.y /= n;	
				}
				return this;
			}		
		}else{
			return false;
		}	
	}else{
		return false;
	}
}

//Wrapper to operation: ADDITION
Vectr.prototype.add = function(n, onNew){
	return this.operation({
		operation: "+",
		operant: n,
		x: true,
		y: true,
		onNew: onNew
	});
}
Vectr.prototype.addX = function(n, onNew){
	return this.operation({
		operation: "+",
		operant: n,
		x: true,
		y: false,
		onNew: onNew
	});
}
Vectr.prototype.addY = function(n, onNew){
	return this.operation({
		operation: "+",
		operant: n,
		x: false,
		y: true,
		onNew: onNew
	});
}

//Wrapper to operation: MULTIPLICATION
Vectr.prototype.multiply = function(n, onNew){
	return this.operation({
		operation: "*",
		operant: n,
		x: true,
		y: true,
		onNew: onNew
	});
}
Vectr.prototype.multiplyX = function(n, onNew){
	return this.operation({
		operation: "*",
		operant: n,
		x: true,
		y: false,
		onNew: onNew
	});
}
Vectr.prototype.multiplyY = function(n, onNew){
	return this.operation({
		operation: "*",
		operant: n,
		x: false,
		y: true,
		onNew: onNew
	});
}

//Wrapper to operation: SUBTRACTION
Vectr.prototype.subtract = function(n, onNew){
	return this.operation({
		operation: "-",
		operant: n,
		x: true,
		y: true,
		onNew: onNew
	});
}
Vectr.prototype.subtractX = function(n, onNew){
	return this.operation({
		operation: "-",
		operant: n,
		x: true,
		y: false,
		onNew: onNew
	});
}
Vectr.prototype.subtractY = function(n, onNew){
	return this.operation({
		operation: "-",
		operant: n,
		x: false,
		y: true,
		onNew: onNew
	});
}

//Wrapper to operation: DIVISION
Vectr.prototype.divide = function(n, onNew){
	return this.operation({
		operation: "/",
		operant: n,
		x: true,
		y: true,
		onNew: onNew
	});
}
Vectr.prototype.divideX = function(n, onNew){
	return this.operation({
		operation: "/",
		operant: n,
		x: true,
		y: false,
		onNew: onNew
	});
}
Vectr.prototype.divideY = function(n, onNew){
	return this.operation({
		operation: "/",
		operant: n,
		x: false,
		y: true,
		onNew: onNew
	});
}

Vectr.prototype.dotProduct = function(vec){
	if(!vec instanceof Vectr){
		return false;
	}
	return this.multiply(vec, true).magnitude();	
}

Vectr.prototype.crossProduct = function(vec, onNew){
	if(!vec instanceof Vectr){
		return false;
	}
	return this.magnitude() * vec.magnitude() * Math.sin(this.angleBetween(vec));
}







/********************************************************************************

	General Vectr methods
	Used to perform other common operations on Vectrs

**********************************************************************************/




Vectr.prototype.distanceX = function(vec, abs){
	if(!vec instanceof Vectr){
		return false;
	}
	if(abs){
		return Math.abs(this.x - vec.x);
	}else{
		return this.x - vec.x;
	}
}

Vectr.prototype.distanceY = function(vec, abs){
	if(!vec instanceof Vectr){
		return false;
	}
	if(abs){
		return Math.abs(this.y - vec.y);
	}else{
		return this.y - vec.y;
	}
}

Vectr.prototype.distance = function(vec){
	if(!vec instanceof Vectr){
		return false;
	}
	return this.subtract(vec, true).magnitude();
}

Vectr.prototype.angleBetween = function(vec, deg){
	if(!vec instanceof Vectr){
		return false;
	}
	var theta = Math.acos(this.dotProduct(vec)/(this.magnitude() * vec.magnitude()));
	if(deg){
		return Vectr.toDegree(theta);
	}else{
		return theta;
	}
}

Vectr.prototype.project = function(vec){
	if(!vec instanceof Vectr){
		return false;
	}
	var scaleFactor = this.magnitude() * Math.cos(this.angleBetween(vec));
	return vec.normalize(true).multiply(scaleFactor);
}

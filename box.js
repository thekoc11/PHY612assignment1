var Box = {
	size: 200,
	p: [],
	temperature: 0,
	vCOM: 0,
	TotalMomentumX: 0,
	TotalMomentumY: 0,
	TotalMomentumZ: 0,
	TotalFx: 0,
	TotalFy: 0,
	TotalFz: 0,
	sigma: 0,
	epsilon: 0,
	scalingFactor: 0,
	DeltaT: 0,

	create: function(boxSize, noOfParticles, initialTemp, DeltaT){
		var obj = Object.create(this);
		obj.size = boxSize;
		var tempP = Particle.create(0, 0, 0, 0);
		var _dist = 0;
		var c = 0;
		while(obj.p.length < noOfParticles){
   			tempP = Particle.create((Math.random()*2 - 1/*generatees a random number between -1, 1*/) * 100, (Math.random()*2 - 1) * 100, (Math.random()*2 - 1) * 100, obj.p.length);
		    var l = obj.p.length;
		    if(l != 0){
		      for(var j = 0; j < l; j+=1){
		        _dist = tempP.distanceTo(obj.p[j], obj.size);
		        if(_dist < 2*obj.p[j].radius){
		          c = c+1;
		        }
		      }
		    }
		    if(c == 0){
		      obj.p.push(tempP);
		    }
		    c = 0;
		}
		var _vx = 0, _vy = 0, _vz = 0, _px = 0, _py = 0, _pz = 0, _p = 0;
		for (var i = 0; i < obj.p.length; i++) {
		 	_vx = _vx + obj.p[i].vx;
		 	_vy = _vy + obj.p[i].vy;
		 	_vz = _vz + obj.p[i].vz;
		 	//console.log("Particle Velocity", obj.p[i].getVelocity());
		 	_p = _p + obj.p[i].mass*obj.p[i].getVelocity();
		}

		_vx = _vx/obj.p.length;
		_vy = _vy/obj.p.length;
		_vz = _vz/obj.p.length;

		var _v = Math.sqrt(_vx**2 + _vy**2 + _vz**2);
		obj.vCOM = _v;
		_p = _p/obj.p.length;
		obj.TotalMomentum = _p;
		var totvsquared = 0;
		for (var i = 0; i < obj.p.length; i++) {
			
			obj.p[i].vx = obj.p[i].vx - _vx;
			obj.p[i].vy = obj.p[i].vy - _vy;
			obj.p[i].vz = obj.p[i].vz - _vz;

			//obj.p[i].normaliseVelocity(obj.vCOM);
			totvsquared = totvsquared + obj.p[i].getVelocitySquare();
		}
		totvsquared = totvsquared/obj.p.length;
		obj.temperature = totvsquared/3.0;
		obj.scalingFactor = (initialTemp/ obj.temperature);

		for (var i = 0; i < obj.p.length; i++) {
			obj.p[i].rescaleVelocity(obj.scalingFactor*200);
			// console.log("Current rescaled velocities are ", obj.p[i].vx, obj.p[i].vy, obj.p[i].vz);

		}

		obj.DeltaT = DeltaT;
		for (var i = 0; i < obj.p.length; i++) {
			obj.p[i].calcPreviousPosition(obj.DeltaT, obj.size);
			// console.log("Xp values", obj.p[i].xp)

		}

		obj.sigma = 2 * obj.p[0].radius;
		obj.epsilon = 0.01;

		return obj;
	},
	calcTotalForce: function(){

		for (var i = 0; i < this.p.length; i++) {
			this.TotalFx = this.TotalFx + this.p[i].ax;

			this.TotalFy = this.TotalFy + this.p[i].ay;
			this.TotalFz = this.TotalFz + this.p[i].az;
		}
	},
	calcTotalMomentum: function() {
		var x = 0, y = 0, z = 0;
		for (var i = 0; i < this.p.length; i++) {
			x = x + this.p[i].vx;
			y = y + this.p[i].vy;
			z = z + this.p[i].vz;
		}
		this.TotalMomentumX = x;
		this.TotalMomentumY = y;
		this.TotalMomentumZ = z;		
	},

	calcTemperature: function() {
		var totvsquared = 0;
		for (var i = 0; i < this.p.length; i++) {

			totvsquared = totvsquared + this.p[i].getVelocitySquare();
		}
		this.temperature = totvsquared/3.0;
	},
	updateVerlet: function() {
		// console.log("The length of aray is", this.p.length);
		for (var i = 0; i < this.p.length; i++) {
			for (var j = 0; j < this.p.length; j++) {
				var x = this.p[i].distanceTo(this.p[j], this.size);
				// console.log("distcance is", this.p[i].xp, this.p[j].xp);
				// console.log("distcance is", x);
				this.p[i].calcForce(this.p[j], this.sigma, this.epsilon, this.size);
			}
			//TODO: Check total Collision
			this.p[i].updateVerlet(this.DeltaT, this.size);
			for(var j = 0; j < this.p.length; j++){
				this.p[i].isForceCalculated[this.p[i].index][this.p[j].index] = false;
			}
			// this.p[i].display();

		}
		for (var i = 0; i < this.p.length; i++) {
			// console.log("Particle accelaration", this.p[i].ax);
		}
		
	},

	updateVelocityVerlet: function() {
		//console.log("The length of aray is", this.p.length);
		for (var i = 0; i < this.p.length; i++) {
			for (var j = 0; j < this.p.length; j++) {
				this.p[i].calcForce(this.p[j], this.sigma, this.epsilon);
			}
		}
		for (var i = 0; i < this.p.length; i++) {
			this.p[i].updateVelocityVerlet(this.DeltaT, this.size);
			// console.log("the velocities are", this.p[i].vx, this.p[i].xp)
		}	
	},
};
var Box = {
	size: 200,
	p: [],
	temperature: 0,
	vCOM: 0,
	TotalMomentum: 0,
	TotalKE: 0,
	sigma: 0,
	epsilon: 0,
	scalingFactor: 0,

	create: function(boxSize, noOfParticles, initialTemp){
		var obj = Object.create(this);
		obj.size = boxSize;
		var tempP = Particle.create(0, 0, 0);
		var _dist = 0;
		var c = 0;
		while(obj.p.length < noOfParticles){
   			tempP = Particle.create((Math.random()*2 - 1/*generatees a random number between -1, 1*/) * 100, (Math.random()*2 - 1) * 100, (Math.random()*2 - 1) * 100);
		    var l = obj.p.length;
		    if(l != 0){
		      for(var j = 0; j < l; j+=1){
		        _dist = tempP.distanceTo(p[j]);
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
	},
};
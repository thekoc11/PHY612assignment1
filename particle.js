var Particle = {
  index: -Infinity,
  radius: 10,
  mass: 2,
  x: 0,
  y: 0,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  ax: 0,
  ay: 0,
  az: 0,
  KE: 0,
  xp: 0,
  yp: 0,
  zp: 0,
  vxp: 0,
  vyp: 0,
  vzp: 0,
  axp: 0,
  ayp: 0,
  azp: 0,
  _x: 0,
  _y: 0,
  _z: 0, 

  create: function(x, y, z, i){
    var obj = Object.create(this);
    obj.setX(x);
    obj.setY(y);
    obj.setZ(z);
    obj.setVx(-10, 10);
    obj.setVy(-10, 10);
    obj.setVz(-10, 10);
    obj.KE = obj.vx**2 + obj.vy**2 + obj.vz**2;
    obj.xp = -Infinity; obj.yp = -Infinity; obj.zp = -Infinity;
    obj.index = i;
    return obj;
  },

  setX: function(x){
    this.x = x;
  },
  setY: function(y){
    this.y = y;
  },
  setZ: function(z){
    this.z = z;
  },
  setVx : function(lb, ub){
    this.vx = Math.random() * (ub - lb) + lb;
  },
  setVy : function(lb, ub){
    this.vy = Math.random() * (ub - lb) + lb;
  },
  setVz : function(lb, ub){
    this.vz = Math.random() * (ub - lb) + lb;
  },
  getX: function(){
    return this.x;
  },
  getY: function(){
    return this.y;
  },
  getZ: function(){
    return this.z;
  },

  getKE: function(){
    return this.KE
  },

  getVx: function(){
    return this.vx;
  },
  getVy: function(){
    return this.vy;
  },
  getVz: function(){
    return this.vz;
  },

  getVelocity: function(){
    return Math.sqrt(this.vx ** 2 + this.vy ** 2 + this.vz ** 2);
  },

  getVelocitySquare: function(){
    return (this.vx ** 2 + this.vy ** 2 + this.vz ** 2);
  },

  distanceTo: function(p2, boxLength){//follows nearest image convenction
    var X = p2.getX(), Y = p2.getY(), Z = p2.getZ();
    var x = this.x, y = this.y, z = this.z;
    var _x = X - x, _y = Y - y, _z = Z - z;
    _x = _x - boxLength * Math.floor(_x/boxLength);
    _y = _y - boxLength * Math.floor(_y/boxLength);
    _z = _z - boxLength * Math.floor(_z/boxLength);	
    var dist = Math.sqrt(_x**2 + _y**2 + _z**2);
    this._x = _x; this._y = _y; this._z = _z;
    return dist;
  },
  
  updateVerlet: function(t, boxLength){
    var xtemp = this.x, ytemp = this.y, ztemp = this.z;
    this.setX(2*this.x - this.xp + this.ax*t**2);
    this.setY(2*this.y - this.yp + this.ay*t**2);
    this.setZ(2*this.z - this.zp + this.az*t**2);

    this.vx = (this.x - this.xp)/2*t;
    this.vy = (this.y - this.yp)/2*t;
    this.vz = (this.z - this.zp)/2*t;

    this.xp = xtemp;
    this.yp = ytemp;
    this.zp = ztemp;

    this.boundaryCheck(boxLength);

  },

  updateVelocityVerlet: function(t, boxLength){
    var xtemp = this.x, ytemp = this.y, ztemp = this.z;
    var vxtemp = this.vx, vytemp = this.vy, vztemp = this.vz;
    var axtemp = this.ax, aytemp = this.ay, aztemp = this.az;
    this.setX(this.xp + this.vxp*t + 0.5*this.axp*t**2);
    this.setY(this.yp + this.vyp*t + 0.5*this.ayp*t**2);
    this.setZ(this.zp + this.vzp*t + 0.5*this.azp*t**2);

    this.vx = this.vxp + 0.5*(this.axp + this.ax)*t;
    this.vy = this.vyp + 0.5*(this.ayp + this.ay)*t;
    this.vz = this.vzp + 0.5*(this.azp + this.az)*t;

    this.xp = this.x;
    this.yp = this.y;
    this.zp = this.z;
    this.vxp = this.vx;
    this.vyp = this.vy;
    this.vzp = this.vz;
    this.axp = this.ax;
    this.ayp = this.ay;
    this.azp = this.az;    

    this.boundaryCheck(boxLength);

  },

  boundaryCheck: function(boxLength){//Periodic Boundary Condition
    if(this.x < -boxLength/2)
      this.x = this.x + boxLength;
    else if (this.x > boxLength/2)
      this.x = this.x - boxLength;
    if(this.y < -boxLength/2)
      this.y = this.y + boxLength;
    else if (this.y > boxLength/2)
      this.y = this.y - boxLength;
    if(this.z < -boxLength/2)
      this.z = this.z + boxLength;
    else if (this.z > boxLength/2)
      this.z = this.z - boxLength;
    
  },
  normaliseVelocity: function(avgVelocity){
    this.vx = this.vx - avgVelocity;
    this.vy = this.vy - avgVelocity;
    this.vz = this.vz - avgVelocity;
  },
  rescaleVelocity: function(scalingFactor){
    this.vx = this.vx * scalingFactor;
    this.vy = this.vy * scalingFactor;
    this.vz = this.vz * scalingFactor;
  },
  calcPreviousPosition: function(DeltaT, boxLength){
    this.xp = this.x - this.vx * DeltaT;
    this.yp = this.y - this.vy * DeltaT;
    this.zp = this.z - this.vz * DeltaT;
    if(this.xp < -boxLength/2)
      this.xp = this.xp + boxLength;
    else if (this.xp > boxLength/2)
      this.xp = this.xp - boxLength;
    if(this.yp < -boxLength/2)
      this.yp = this.yp + boxLength;
    else if (this.yp > boxLength/2)
      this.yp = this.yp - boxLength;
    if(this.zp < -boxLength/2)
      this.zp = this.zp + boxLength;
    else if (this.zp > boxLength/2)
      this.zp = this.zp - boxLength;
  },

  calcForce: function(p2, sigma, epsilon, boxLength){
      var X = p2.getX(), Y = p2.getY(), Z = p2.getZ();
    var x = this.x, y = this.y, z = this.z;
    var _x = X - x, _y = Y - y, _z = Z - z;
    _x = _x - boxLength * Math.floor(_x/boxLength);
    _y = _y - boxLength * Math.floor(_y/boxLength);
    _z = _z - boxLength * Math.floor(_z/boxLength); 
    var dist = Math.sqrt(_x**2 + _y**2 + _z**2);
    if(p2.index == this.index)
      dist = Infinity;
    this._x = _x; this._y = _y; this._z = _z;
    var r = this.distanceTo(p2, boxLength);
    r = dist;
    var ljcut = (2**(1/6))*sigma;
    var xforce = 0, yforce = 0, zforce = 0;
    // console.log("dist annd ljcut", r, p2.index);
    if (r < ljcut) {
       xforce =  (48 * epsilon * this._x) * ((sigma / r) ** 12 - 0.5*(sigma/r)**6)/(r**2)
       //(48*eps*xr(i,j)*((sig/r(i,j))**12 - 0.5*(sig/r(i,j))**6))/(r(i,j)**2)
       yforce =  (48 * epsilon * this._y) * ((sigma / r) ** 12 - 0.5*(sigma/r)**6)/(r**2)
       zforce =  (48 * epsilon * this._z) * ((sigma / r) ** 12 - 0.5*(sigma/r)**6)/(r**2)
      // console.log("updated accelaration is now", xforce);
  
    }
    this.ax = this.ax + xforce;
    p2.ax = p2.ax - xforce;
    this.ay = this.ay + yforce;
    p2.ay = p2.ay - yforce;
    this.az = this.az + zforce;
    p2.az = p2.az - zforce;

  }
};

var p = []; //Array of particles
var tempP = Particle.create(0, 0, 0);
var _dist = 0.0;//distance between two particles
var c = 0;
var noOfParticles = 50;
var x_data = [], y_data = [], z_data = [];
var fs = 0.0;
var dt = 0.01;
var Xp = [];

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  main();//function where all the magic happens
}

function draw(){
  background(0);
  //lights();
  noFill();
  stroke(255);
  // pushMatrix();
  // noStroke();
  box(200);//a cube of side 200
  // popMatrix();


  noStroke();
  fill(255);

  for(var i = 0; i < p.length; i+= 1){
    push();//reset the pointer, bring it back to origin
    translate(p[i].getX(), p[i].getY(), p[i].getZ());
    sphere(p[i].radius);
    pop();
  }
}

function main(){
  while(p.length < noOfParticles){
    tempP = Particle.create((Math.random()*2 - 1/*generatees a random number between -1, 1*/) * 100, (Math.random()*2 - 1) * 100, (Math.random()*2 - 1) * 100);
    var l = p.length;
    if(l != 0){
      for(var j = 0; j < l; j+=1){
        _dist = tempP.distanceTo(p[j]);
        //console.log("the value of dist is ", _dist);
        if(_dist < 2*p[j].radius){
          c = c+1;
        }
      }
    }
    //console.log("The valur of C is ", c);
    if(c == 0){
      //console.log("The X, Y, Z spawn points are", tempP.getX(), tempP.getY(), tempP.getZ());
      p.push(tempP);
      //console.log("length of tye array is", p.length);
    }
    c = 0;
  }
  
  var T = calcTemp();
  scaleVelocity(fs);
  console.log("Temperature of the system is: ", T);
  Update(dt);
  plotData();
}

function calcTemp(){
  var l = p.length;
  var K = []; var sum = 0;
  for ( var i = 0; i < l; i += 1 ){
    K.push(p[i].getKE());
    sum = sum + p[i].getKE();
  }
  sum = sum/l;
  var T = sum * (2/3);
  fs = Math.sqrt(3 * T / sum);
  return T;
	
}

function scaleVelocity(fs){
  var l = p.length;
  var sumX = 0, sumY = 0, sumZ = 0;
  for(var i = 0; i < l; i+=1){
    sumX = sumX + p[i].getVx()
    sumY = sumY + p[i].getVy()
    sumZ = sumZ + p[i].getVz()
  }
  console.log("The sum of Momentums are", sumX, sumY, sumZ);
  for(var i = 0; i < l; i+=1){
    p[i].vx = (p[i].vx - sumX/l) * fs;
    p[i].vy = (p[i].vy - sumY/l) * fs;
    p[i].vy = (p[i].vz - sumZ/l) * fs;
  }
}

function Update(dt){
  var l = p.length;
  for(var  i = 0; i < l; i++){
    Xp.push(p[i].getX() - p[i].getVx()*dt);
  }
}

function plotData(){
  var dist = [[]]
  for (var i = 0; i < p.length; i+=1){
    dist.push([]);
    for(var j = 0; j < p.length; j+=1){
      if(i == j){
	dist[i].push(0); 	
      }
      else{
        dist[i].push(p[i].distanceTo(p[j]));	
      }
      x_data.push(i);
      y_data.push(j);
      z_data.push(dist[i][j]);
    }
    
  }
  console.log(x_data.length, y_data.length, z_data.length);
  var data = [{
	     x: x_data,
             y: y_data,
             z: z_data,
             type: 'scatter3d'  
  }];
  var layout = {};

  Plotly.newPlot('myDiv', data, layout);
}



var b;

var time = [], t = 0, timeVV = [];
var Fx = [], FxVV = [], Fy = [], FyVV = [], Fz = [], FzVV = [];
var Px = [], Py = [], Pz = []; var PxVV = [], PyVV = [], PzVV = [];
var T = []; var TVV = [];

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  b = Box.create(200, 50, 0.3, 0.01);
  // b.updateVelocityVerlet();
  while(t<30){
      time.push(t);
  b.updateVerlet();
  b.calcTotalForce();
  Fx.push(b.TotalFx);
  // console.log("Total FX is", b.TotalFx);
  Fy.push(b.TotalFy);
  Fz.push(b.TotalFz);
  b.calcTotalMomentum();
  Px.push(b.TotalMomentumX);
  Py.push(b.TotalMomentumY);
  Pz.push(b.TotalMomentumZ);
  b.calcTemperature();
  T.push(b.temperature);
  t++;
  }
  t = 0;
while(t<30){
  timeVV.push(t);
  b.updateVelocityVerlet();
  b.calcTotalForce();
  FxVV.push(b.TotalFx);
  FyVV.push(b.TotalFy);
  FzVV.push(b.TotalFz);
  b.calcTotalMomentum();
  PxVV.push(b.TotalMomentumX);
  PyVV.push(b.TotalMomentumY);
  PzVV.push(b.TotalMomentumZ);
  b.calcTemperature();
  TVV.push(b.temperature);
  t++;
  }
  plot();
}

function draw(){
  background(0);
  //lights();
  noFill();
  stroke(255);
  // pushMatrix();
  // noStroke();
  box(b.size);//a cube of side 200
  // popMatrix();


  noStroke();
  fill(255);

  for(var i = 0; i < b.p.length; i+= 1){
    push();//reset the pointer, bring it back to origin
    translate(b.p[i].x, b.p[i].y, b.p[i].z);
    sphere(b.p[i].radius);
    pop();
  }
  b.updateVerlet();
  
  //requestAnimationFrame(draw);
}

function plot() {
  var data1 = {
    x: time,
    y: Fx,
    type: 'scatter',
    mode: 'lines',
    name: 'Total Force in X'
  };
  var data2 = {
    x: time,
    y: Fy,
    type: 'scatter',
    mode: 'lines',
    name: 'Total Force in Y'
  };
  var data3 = {
    x: time,
    y: Fz,
    type: 'scatter',
    mode: 'lines',
    name: 'Total Force in Z'
  };

  var mdata1 = {
    x: time,
    y: Px,
    type: 'scatter',
    mode: 'lines',
    name: 'Total momentum in X'
  };
  var mdata2 = {
    x: time,
    y: Py,
    type: 'scatter',
    mode: 'lines',
    name: 'Total momentum in Y'
  };
  var mdata3 = {
    x: time,
    y: Pz,
    type: 'scatter',
    mode: 'lines',
    name: 'Total momentum in Z'
  };
  var tdata1 = {
    x: time,
    y: T,
    type: 'scatter',
    mode: 'lines',
    name: 'Temperature'
  };

  var data = [data1, data2, data3];
  var mdata = [mdata1, mdata2, mdata3];
  var tdata = [tdata1];
  var layout = {};

  Plotly.newPlot('myDiv1', data, layout);
  Plotly.newPlot('myDiv2', mdata, layout);
  Plotly.newPlot('myDiv3', tdata, layout);

  var VVdata1 = {
    x: timeVV,
    y: FxVV,
    type: 'scatter',
    mode: 'lines',
    name: 'Velocity Verlet Total Force in X'
  };

  var VVdata2 = {
    x: timeVV,
    y: FyVV,
    type: 'scatter',
    mode: 'lines',
    name: 'Velocity Verlet Total Force in Y'
  };
  var VVdata3 = {
    x: timeVV,
    y: FzVV,
    type: 'scatter',
    mode: 'lines',
    name: 'Velocity Verlet Total Force in Z'
  };

var VVdata = [VVdata1, VVdata2, VVdata3];

  var VVmdata1 = {
    x: timeVV,
    y: PxVV,
    type: 'scatter',
    mode: 'lines',
    name: 'Velocity Verlet Total Momentum in X'
  };
  var VVmdata2 = {
    x: timeVV,
    y: PyVV,
    type: 'scatter',
    mode: 'lines',
    name: 'Velocity Verlet Total Momentum in Y'
  };
  var VVmdata3 = {
    x: timeVV,
    y: PzVV,
    type: 'scatter',
    mode: 'lines',
    name: 'Velocity Verlet Total Momentum in Z'
  };

  var VVmdata = [VVmdata1, VVmdata2, VVmdata3];

  var VVtdata1 = {
    x: timeVV,
    y: TVV,
    type: 'scatter',
    mode: 'lines',
    name: 'Velocity Verlet Temperature'
  };  

  var VVtdata = [VVtdata1];

  Plotly.newPlot('myDivP1', VVdata, layout);
  Plotly.newPlot('myDivP2', VVmdata, layout);
  Plotly.newPlot('myDivP3', VVtdata, layout);

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

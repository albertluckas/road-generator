
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth=200;
canvas.width = canvas.clientWidth;
canvas.height=canvas.clientHeight;
let ratio = 100/canvas.width

let buildings = [];
let dists={}
const roadmodes= ["1closest","2closest","3closest"]
let roadmode = roadmodes[0];
const destroyDist = 3;

let ticker = 0;
function nextid(){return ticker++;}

document.addEventListener('click', click, true);
function click(e) {
  let p={x:e.x*ratio,y:e.y*ratio, id:"b"+nextid()}
  if (buildings.length>0 && dist(p, closest(p)) <= destroyDist) {
    p=closest(p)
    buildings.splice(buildings.indexOf(p), 1)
    for (let b of buildings){
      delete dists[b.id][p.id];
      delete dists[p.id][b.id];
    }
    delete dists[p.id]
  }
  else {

    dists[p.id]={}
    for (let b of buildings){
      dists[b.id][p.id]=dist(b,p)
      dists[p.id][b.id]=dist(b,p)
    }
    buildings.push(p)
  }
  redraw();

}
function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
function closest(p1) {
  let closest = buildings[0];
  let closestDist = 10000;
  for (let i = 0; i < buildings.length; i++) {
    let d = dist(p1, buildings[i]);
    if (d < closestDist &&p1.id!=buildings[i].id) {
      closest = buildings[i];
      closestDist = d;
    }
  }
  return closest;

}
function road(p1,p2){
  ctx.strokestyle = "grey";
  ctx.beginPath();
  ctx.moveTo(p1.x/ratio,p1.y/ratio);
  ctx.lineTo(p2.x/ratio,p2.y/ratio);
  ctx.stroke();
  
  
}
function redraw(){
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  switch(roadmode){
    case "1closest":
      for(const p of buildings){
        road(p,closest(p));
      
    }
  }  

  
  ctx.fillStyle="black";
 
  for(const p of buildings){
    ctx.beginPath();
    ctx.arc(p.x/ratio, p.y/ratio, 1/ratio, 0, 2 * Math.PI);
    
    ctx.fill();
    ctx.stroke();
  }
  
}
redraw();

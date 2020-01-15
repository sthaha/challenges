const sketch = (p : p5) =>  {

const instructions = "ffffrffflfff";
//const instructions = "ffffrffflfffrfffrffflffflffffffffrfffrr";
const steps = instructions.split("");

 //const steps = [
     //'f', 'a', 'f', 'b', 'r',
     ////'f', 'f', 'f', 'l',
     ////'f', 'f','f', 'r',
     ////'f', 'f', 'f', 'r',
     ////'f', 'f', 'f', 'f', 'l',
     ////'f', 'f', 'f', 'r',
     ////'b', 'b', 'b', 'l', 'f', 'f', 'f', 'f', 'r',
 //];




const gridSize = 30;

let beebot = {
    x: 10,
    y: 10,
    angle: 0,
};

const drawBeebot = () => {

  let x = beebot.x * gridSize + gridSize /2;
  let y = beebot.y * gridSize + gridSize /2;

  p.push();
  p.translate(x,y);
  p.stroke(255, 0, 0);
  p.point(0, 0);

  p.rotate(beebot.angle);
  p.stroke(255, 0, 0);
  p.fill(255, 0, 0);
  p.ellipse(0, 0, 11, 11);

  p.stroke(71, 17, 17);
  p.fill(77, 9, 9);
  p.ellipse(-4, -4, 4, 4);
  p.ellipse(+4, -4, 4, 4);

  p.pop();

};

const clearBeebot = () => {
  const x = beebot.x * gridSize + 2;
  const y = beebot.y * gridSize + 2;
  const s = gridSize - 5;

  p.stroke(255, 150);
  p.fill(255, 150);
  p.rect(x, y, s, s);

};



const move = (x: number, y: number, angle: number) => {
  clearBeebot();
  beebot.x = x;
  beebot.y = y;
  beebot.angle = angle;
  drawBeebot();
};

const forward = () => {
  clearBeebot();
  switch (beebot.angle % 360) {
      case 0: beebot.y--; break;
      case 90: beebot.x++; break;
      case 180: beebot.y++; break;
      case 270: beebot.x--; break;
  }

  drawBeebot();
};

const back = () => {
  clearBeebot();
  switch (beebot.angle % 360) {
    case 0: beebot.y++; break;
    case 90: beebot.x--; break;
    case 180: beebot.y--; break;
    case 270: beebot.x++; break;
  }

  drawBeebot();
};

const turnRight = () => {
  clearBeebot();
  beebot.angle = (beebot.angle + 90)  % 360;

  drawBeebot();
};

const turnLeft = () => {
  clearBeebot();
  beebot.angle = (beebot.angle - 90)  % 360;
  drawBeebot();
};

const abouturn  = () => {
  clearBeebot();
  beebot.angle = (beebot.angle + 180)  % 360;
  drawBeebot();
};






  let isLooping = true
  const noLoop = () => {isLooping = false; p.noLoop()}
  const loop = () => {isLooping = true; p.loop()}
  const toggleLoop = () => isLooping ? noLoop() :  loop()

  p.keyPressed = () => {
    switch(p.keyCode) {
      case p.ESCAPE: toggleLoop(); return;
      case 32: p.redraw(); return
    }
    switch (p.key) {
      case 'i':
        p.redraw()
        break
    }
  }


  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.angleMode(p.DEGREES)
    p.frameRate(2)
    for (let i = 0; i< p.width; i+= gridSize) {
        p.line(0, i, p.width, i);
        p.line(i, 0, i, p.height);
    }

    move(0, 0, 90);
    //noLoop()
  }


  let next = 0;
  const reset = ()=> {
    move(0, 0, 90)
    next = 0;
  }

  p.draw = () => {
    if (next >= steps.length) {
      reset()
      return;
    }

    switch (steps[next]) {
        case 'f': forward(); break;
        case 'r': turnRight(); break;
        case 'l': turnLeft(); break;
        case 'b': back(); break;
        case 'a': abouturn(); break;
    }
    next++;
  }
}

new p5(sketch)

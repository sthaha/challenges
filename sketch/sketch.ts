class BeeBot {
  p: p5
  x: number
  y: number
  angle: number
  gridSize: number

  constructor(p: p5, gs: number) {
    this.p = p
    this.gridSize = gs

    this.x = 0
    this.y = 0
    this.angle = 0
  }

  run(step: string) {
    this.clear()
    switch(step){
      case 'f': this.forward(); break;
      case 'r': this.turnRight(); break;
      case 'l': this.turnLeft(); break;
      case 'b': this.back(); break;
      case 'u': this.uTurn(); break;
    }
    this.draw()
  }

  clear () {
    const {x, y, gridSize, p} = this

    const rx = x * gridSize + 2;
    const ry = y * gridSize + 2;

    const s = gridSize - 5;

    p.stroke(255, 150);
    p.fill(255, 150);
    p.rect(rx, ry, s, s);

  }

  draw() {
    const {x, y, angle, gridSize, p} = this

    let tx = x * gridSize + gridSize /2;
    let ty = y * gridSize + gridSize /2;

    p.push();
      p.translate(tx, ty);
      p.rotate(angle);

      // body
      p.stroke(255, 0, 0);
      p.fill(255, 0, 0);
      p.ellipse(0, 0, 9, 13);

      // eyes
      p.stroke(71, 17, 17);
      p.fill(77, 9, 9);
      p.ellipse(-4, -4, 4, 4);
      p.ellipse(+4, -4, 4, 4);

    p.pop();

  }

  move(x: number, y: number, angle: number) {
    this.clear();
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.draw();
  }

  forward() {
    switch (this.angle % 360) {
      case 0: this.y--; break;
      case 90: this.x++; break;
      case 180: this.y++; break;
      case 270: this.x--; break;
    }
  };

  back() {
    switch (this.angle % 360) {
      case 0: this.y++; break;
      case 90: this.x--; break;
      case 180: this.y--; break;
      case 270: this.x++; break;
    }
  }

  turnRight() {
    this.angle = (this.angle + 90) % 360;
  }

  turnLeft = () => {
    this.angle = (this.angle - 90) % 360;
  }

  uTurn(){
    this.angle = (this.angle + 180) % 360;
  }
}

const sketch = (p : p5) =>  {

  const instructions = "rrrrrffffrffflfffrfffrffflffflffffffffrfffrr";
  const steps = instructions.split("");

 //const steps = [
     //'f', 'a', 'f', 'b', 'r',
     //'f', 'f', 'f', 'l',
     //'f', 'f','f', 'r',
     //'f', 'f', 'f', 'r',
     //'f', 'f', 'f', 'f', 'l',
     //'f', 'f', 'f', 'r',
     //'b', 'b', 'b', 'l', 'f', 'f', 'f', 'f', 'r',
 //];




const gridSize = 30;

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

  let beebot = new BeeBot(p, gridSize)

  let next = 0;
  const reset = ()=> {
    beebot.move(0, 0, 0)
    next = 0;
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.angleMode(p.DEGREES)
    p.frameRate(2)
    for (let i = 0; i< p.width; i+= gridSize) {
        p.line(0, i, p.width, i);
        p.line(i, 0, i, p.height);
    }
    reset()
    //noLoop()
  }



  p.draw = () => {
    if (next >= steps.length) {
      reset()
      return;
    }

    beebot.run(steps[next])
    next++;
  }
}

new p5(sketch)

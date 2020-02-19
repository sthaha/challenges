const sketch = (p : p5) =>  {

  let isLooping = true
  const noLoop = () => {isLooping = false; p.noLoop()}
  const loop = () => {isLooping = true; p.loop()}
  const toggleLoop = () => isLooping ? noLoop() :  loop()

  p.keyPressed = () => {
    switch(p.keyCode) {
      case p.ESCAPE: toggleLoop(); return;
      case 32: p.redraw(); return
    }
  }


  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    //noLoop()
  }

  let x = 120;
  let y = 20;
  let size = 80;
  let dx = 2;
  let dy = 2;


  p.draw = () => {
    p.background(180)
    p.fill(20, 200)
    p.noStroke()
    p.circle(x, y, size)
    p.stroke("red")
    p.point(x,y)
    dx = p.map(p.mouseX, 0, p.width, -3, 3)
    dy = p.map(p.mouseY, 0, p.height, -3, 3)
    //console.log("dx:", dx)
    x += dx
    y += dy

    const r = size/2
    let right = x + r;
    let left = x - r;
    if (right > p.width || left < 0) {
      x = left < 0 ? r : p.width - r
      dx = dx * -1  // 2 * -1 = -2  | -2 * -1 = 2
    }

    let top = y - r;
    let bottom = y + r;
    if (bottom > p.height || top < 0) {
      y = top < 0 ? r : p.height - r
      dy = dy * -1  // 2 * -1 = -2  | -2 * -1 = 2
    }
  }
}

new p5(sketch)

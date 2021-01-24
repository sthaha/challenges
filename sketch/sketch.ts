
// ref: https://www.youtube.com/watch?v=LaarVR1AOvs&t=749s
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
    p.background(0)
    p.stroke(255)
    p.strokeWeight(4)
    p.colorMode(p.HSB)
    // noLoop()
  }


  const x1 = (t: number) => p.sin(t/10) * 180  + p.sin(t/5) * 30;
  const y1 = (t: number) => p.cos(t/10) * 120

  const x2 = (t: number) => p.sin(t/7) * 280 + p.sin(t) * 2;
  const y2 = (t: number) => p.cos(t/2) * 20 + p.sin(t/7) * 75;
  let hue = 0
  const h = (t: number) => hue++ % 255 // p.map(p.sin(t/8), -1, 1, 0, 255);

  let t = 0
  p.draw = () => {
    p.translate(p.width/2, p.height/2)

    p.background(0)
    p.stroke(h(t), 80, 80, 20)
    // p.point(x1(t), y1(t))
    // p.point(x2(t), y2(t))
    for (let i = 0; i < 12; i++){
      const ti = t + i;
      p.line(x1(ti), y1(ti), x2(ti), y2(ti))

    }
    t += 0.215
  }
}

new p5(sketch)

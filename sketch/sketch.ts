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
    noLoop()
  }


  p.draw = () => {
    p.background(0)
    p.translate(p.width/2, p.height/2)
    p.stroke(222, 16, 16, 170)
    p.strokeWeight(2)
    p.fill(170, 160)

    const scale = 1.058
    let len = 100
    let p0 = p.createVector()
    let p1 = p.createVector(len, 0)
    p.line(p0.x, p0.y, p1.x, p1.y)

    let angle = p.PI/2 + p.PI/8
    //len *= scale
    const x = len * p.cos(angle) + p1.x
    const y = len * p.sin(angle) + p1.y
    let c = p.createVector(x, y)
    p.line(p1.x, p1.y, c.x, c.y)


    const N = 68
    for (let i = 0; i< N; i++){
      let v = p0.sub(c)
      v.mult(scale)
      const next = p5.Vector.add(c, v)
      p.line(c.x, c.y, next.x, next.y)
      p0 = p1
      p1 = c
      c = next
    }

  }
}

new p5(sketch)

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

  const superFormula = (
      theta: number, m: number,
      a: number, b:number,
      n1: number, n2: number, n3: number) => {

    const mT_4 = m * theta  * 0.25   // m * T / 4
    const cos_a = p.abs(p.cos(mT_4) / a)
    const cosN2 = p.pow(cos_a, n2)

    const sin_b = p.abs(p.sin(mT_4) / b)
    const sinN3 = p.pow(sin_b, n3)

    return p.pow(cosN2 + sinN3, -1.0/n1)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    // noLoop()
  }

  let t  = 0
  p.draw = () => {
    p.background(0)
    p.translate(p.width/2, p.height/2)

    p.noFill()
    p.stroke(255)
    p.strokeWeight(3)

    p.beginShape()

    for (let theta = 0; theta <= p.TWO_PI; theta+= 0.005){
      const rad = superFormula(
        theta,
        6,
        1.4,
        1.4,
        1.2,
        p.sin(t) * 0.5 + 0.5,
        p.cos(t) * 0.5 + 0.5,
      )
      const x  = rad * p.cos(theta) * 90
      const y  = rad * p.sin(theta) * 90
      p.vertex(x,y)
    }
    p.endShape("close")
    t += 0.1
  }
}

new p5(sketch)

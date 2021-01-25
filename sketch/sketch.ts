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

  const superFormula = (t:number, a: number, b:number, m: number, n1: number, n2: number, n3: number) => {
    return 1
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

    p.noFill()
    p.stroke(255)
    p.strokeWeight(3)
    p.beginShape()

    for (let theta = 0; theta < p.TWO_PI; theta+= 0.01){
      const rad = superFormula(theta)
      const x  = rad * p.cos(theta) * 50
      const y  = rad * p.sin(theta) * 50
      p.vertex(x,y)
    }
    p.endShape()
  }
}

new p5(sketch)

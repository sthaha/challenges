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


  p.windowResized = () => { p.resizeCanvas(p.windowWidth, p.windowHeight) }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    noLoop()
  }

  interface point {
    x: number
    y: number
  }


  const computePoints = (r: number, n: number) => {
    const points: point[] = []
    for (let i = 0; i<n; i++) {
      const x = p.cos(i/n *p.TWO_PI) * r;
      const y = p.sin(i/n *p.TWO_PI) * r;
      points.push({x,y})
    }
    return points;
  }


  const radius = 200;
  const slices = 99;

  let mult = 1.00;
  p.draw = () => {
    p.translate(p.width/2, p.height/2)
    p.background(0)
    p.noFill()
    p.stroke(128, 100, 100)
    p.strokeWeight(4)
    p.circle(0, 0, radius*2)
    p.point(0,0)

    p.stroke(18, 180, 210)

    const points = computePoints(radius, slices)
    for (const pt of points) {
      p.circle(pt.x, pt.y, 4)
    }

    p.strokeWeight(2)

    for (let i=1; i<slices; i++) {
      const p1 = points[i]
      const x = p.cos(i * mult/slices * p.TWO_PI) * radius;
      const y = p.sin(i * mult/slices * p.TWO_PI) * radius;
      p.line(p1.x, p1.y, x, y)
    }
    mult += 0.005
  }
}

new p5(sketch)

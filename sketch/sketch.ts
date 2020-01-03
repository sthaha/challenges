
class FourierPlot {
  p: p5

  x: number
  y: number
  radius: number
  time: number

  color: p5.Color
  points: number[]
  n: number

  plotX:number

  constructor(p: p5, x: number, y: number, radius: number, iterations: number) {
    this.p = p
    this.x = x
    this.y = y
    this.radius = radius

    this.color = p.color(20, 244, 180, 190)
    this.time = 0
    this.points = []
    this.n = iterations

    this.plotX = x + FourierPlot.computePointAt(p, 0, radius, iterations).x + 20
  }

  draw() {
    const {p, x, y, radius, color, time} = this


    this.drawCircle()
    const dot = this.computePoint()
    this.drawPoints(dot)
  }

  drawPoints(pt: p5.Vector) {
    const {p, points, x, y, radius, n, plotX} = this

    const len = points.length
    this.points.unshift(pt.y)
    if (len > (p.width - plotX)) {
      this.points.pop()
    }


    const lineClr = p.color(100,100,224, 150)
    p.stroke(lineClr)


    p.line(x + pt.x, y + pt.y, plotX, y + pt.y )
    p.line(plotX, y + pt.y, plotX - 4, y + pt.y -4)
    p.line(plotX, y + pt.y, plotX - 4, y + pt.y +4)
    p.ellipse(plotX, y + pt.y, 2 )

    p.translate(plotX, y)
    const plotColor = p.color(lineClr.toString("rgba"))
    plotColor.setAlpha(190)
    const pointColor = p.color(lineClr.toString("rgba"))
    pointColor.setAlpha(160)


    p.strokeWeight(3)
    p.noFill()

    p.beginShape()
    for(let i = 0; i < points.length; i++){
      p.stroke(plotColor)
      p.vertex(i, points[i])

      p.stroke(pointColor)
      p.strokeWeight(2)
      p.ellipse(i, points[i], 2)
    }

    p.endShape()
  }

  drawCircle() {
    const {p, x, y, radius, color} = this

    const clr = p.color(this.color.toString("rgba"))
    clr.setAlpha(50)
    const d = radius * 2
    p.noFill()
    p.stroke(clr)
    p.strokeWeight(3)
    p.ellipse(x, y, d, d)

  }

  static computePointAt(p: p5, time: number, radius: number, iterations: number) {
    let x = 0
    let y = 0

    for (let i =0; i< iterations; i++) {
        const n = i * 2 + 1
        const r = radius *  (4 / ( n *  p.PI))

        x +=  r * p.cos(n * time)
        y +=  r * p.sin(n * time)
    }
    return p.createVector(x, y)

  }

  computePoint(): p5.Vector {
    const {p, x, y, time} = this

    const N = this.n

    p.translate(x, y)
    p.strokeWeight(2)

    let dotX = 0
    let dotY = 0
    const circleClr = p.color(this.color.toString("rbga"))
    circleClr.setAlpha(80)

    for (let i =0; i<N; i++) {
        const n = i * 2 + 1
        const radius = this.radius *  (4 / ( n *  p.PI))

        const [prevX, prevY]  = [dotX, dotY]
        dotX +=  radius * p.cos(n * time)
        dotY +=  radius * p.sin(n * time)

        p.stroke(this.color)
        p.line(prevX, prevY, dotX, dotY)
        p.fill(this.color)
        p.ellipse(dotX, dotY, 4)

        p.noFill()
        p.stroke(circleClr)
        p.ellipse(prevX, prevY, radius*2)

    }
    p.translate(-x, -y)
    return p.createVector(dotX, dotY)

  }
}

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

  let f : FourierPlot
  const dt = 0.0135

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    const radius = 80
    f = new FourierPlot(p, radius * 1.5 *  p.PI, p.height/2, radius, 11)
    noLoop()
  }

  p.draw = () => {
    p.background(0)
    p.translate(0, p.height)
    p.scale(1, -1)

    f.time += dt
    f.draw()
  }
}

new p5(sketch)

enum Orientation {
  Vertical,
  Horizontal,
}

type repeatFn = () => boolean

class Plotter {
  p: p5
  h: Circle
  v: Circle
  points: p5.Vector[]
  repeating: repeatFn

  color: p5.Color
  dotColor: p5.Color

  constructor(p: p5, h: Circle, v: Circle, repeating: repeatFn ) {
    this.p = p
    this.h = h
    this.v = v
    this.repeating = repeating

    this.points = []

    this.color = p.lerpColor(h.color, v.color, 0.5)
    this.color.setAlpha(180)

    this.dotColor = p.color(this.color.toString('rgba'))
    this.dotColor.setAlpha(120)

  }

  draw() {
    const {p, h, v, points} = this
    const x  = h.knob.x
    const y  = v.knob.y

    const pt = p.createVector(x, y)

    //console.log("point:", points)

    const repeating = this.repeating()
    const store = !repeating &&
      (points.length == 0 || pt.dist(points[points.length -1]) > 1)

    if (store){
      this.points.push(pt)
    }

    if (!repeating) {
      p.stroke(this.color)
    } else {
      p.stroke(200, 200)
    }

    p.noFill()
    p.strokeWeight(2)

    p.beginShape()
    for (const pt of points){
      p.vertex(pt.x, pt.y)
    }
    p.endShape()


    p.stroke(this.dotColor)
    p.fill(this.dotColor)
    p.ellipse(pt.x, pt.y, 5,5)
  }

}

class Circle {
  p: p5
  orientation: Orientation

  x: number
  y: number
  radius: number

  speed: number
  angle: number

  color: p5.Color

  showLines: boolean = false

  constructor(p: p5, o: Orientation,  x: number, y : number, radius: number,
              angle: number, speed: number,
              color: p5.Color) {
    this.p = p
    this.orientation = o
    this.x = x
    this.y = y
    this.radius = radius
    this.angle = angle
    this.speed = speed
    this.color = color
  }

  get knob(): p5.Vector {
    const {p, x, y, radius, angle} = this

    const kx = x + radius * p.cos(angle)
    const ky = y + radius * p.sin(angle)
    return p.createVector(kx, ky)
  }

  draw() {
    const {p, x, y, radius, color, angle} = this

    p.noFill()
    p.stroke(color)
    p.strokeWeight(3)
    p.ellipse(x, y, 2*radius, 2*radius)

    const knob = this.knob
    const knobColor =  p.color(color.toString('rgba'))
    knobColor.setAlpha(p.alpha(color) - 10)

    p.fill(knobColor)
    p.strokeWeight(4)
    p.ellipse(knob.x, knob.y, 5, 5)

    if (!this.showLines) {
      return
    }

    const lineColor = p.color(color.toString('rgba'))
    lineColor.setAlpha(p.alpha(color) - 80)

    p.strokeWeight(2)
    p.stroke(lineColor)

    if (this.orientation == Orientation.Horizontal) {
      p.line(knob.x, 0, knob.x, p.height)
    } else {
      p.line(0, knob.y, p.width, knob.y)
    }

  }

  toggleLines() {
    this.showLines = !this.showLines
  }

  update() {
    this.angle += this.speed
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
        for (const c of circles) {
          c.toggleLines()
        }
        p.redraw()
        break
    }
  }


  const radius = 50
  const padding = 50
  const speed = -p.TWO_PI/(360)
  const startAngle = -p.HALF_PI

  const circles: Circle[] = []
  const plotters: Plotter[] = []


  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)

    const d = radius * 2
    const top = radius + padding/4
    const hNum = (p.width - top) / (d+padding)
    //const hNum = (p.width - padding*2)  / (d + padding)
    const vNum = (p.height - padding*2) / (d + padding)
    //const vNum = (p.height - padding*2) / (d + padding)


    const horizontal: Circle[] = []
    for (let i =  1; i <= hNum; i++) {
      const x = top + i * (d + padding)

      const hColor = p.color(120 + 25 * i, 225, 28, 200)
      const h = new Circle(p, Orientation.Horizontal, x, top, radius,
                           startAngle, speed*i, hColor)
      horizontal.push(h)
      circles.push(h)
    }

    const vertical: Circle[] = []
    for (let i =  1; i <= vNum; i++) {
      const y = top + i * (d + padding)
      const vColor = p.color(28, 225, 120 + 25 * i, 200)
      const v = new Circle(p, Orientation.Vertical, top, y, radius,
                           startAngle, speed*i, vColor)
      vertical.push(v)
      circles.push(v)
    }

    // detect first loop
    const rotation = startAngle + p.TWO_PI * Math.sign(speed)
    const repeating = () => circles[0].angle < rotation

    //const repeating = () => {
      //const ret = circles[0].angle < rotation
      //console.log(" ... angle", circles[0].angle,  "rotation", rotation,  "ret: ", ret)
      //return ret
    //}

    // horizontal
    for (const h of horizontal) {
      for (const v of vertical) {
        plotters.push(new Plotter(p, h, v, repeating))
      }
    }

    noLoop()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.background(0)
    for (const c of circles) {
      c.draw()
    }
    for (const pl of plotters) {
      pl.draw()
    }

    for (const c of circles) {
      c.update()
    }

 }
}

new p5(sketch)

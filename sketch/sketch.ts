enum Orientation {
  Vertical,
  Horizontal,
}

class Plotter {
  p: p5
  h: Circle
  v: Circle
  points: p5.Vector[]

  constructor(p: p5, h: Circle, v: Circle) {
    this.p = p
    this.h = h
    this.v = v

    this.points = []
  }

  draw() {
    const {p, h, v} = this
    const x  = h.knob.x
    const y  = v.knob.y

    const pt = p.createVector(x, y)
    const store = this.points.length < 200 || this.points.length == 0 ||
         pt.dist(this.points[this.points.length-1]) > 1

    if (store){
      this.points.push(pt)
    }

    const clr = p.lerpColor(h.color, v.color, 0.3)
    clr.setAlpha(120)
    p.color(clr)

    p.noFill()
    p.beginShape()
    for (const pt of this.points){
      p.vertex(pt.x, pt.y)
    }
    p.endShape()
    const dotColor = p.color(clr.toString('rgba'))
    dotColor.setAlpha(100)
    p.ellipse(pt.x, pt.y, 3,3)
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

  constructor(p: p5, o: Orientation,  x: number, y : number, radius: number, speed: number, color: p5.Color) {
    this.p = p
    this.orientation = o
    this.x = x
    this.y = y
    this.radius = radius
    this.speed = speed
    this.color = color
    this.angle = 0
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
    console.log(p.alpha(knobColor))
    knobColor.setAlpha(p.alpha(color) - 10)

    p.fill(knobColor)
    p.strokeWeight(4)
    p.ellipse(knob.x, knob.y, 5, 5)

    if (!this.showLines) {
      return
    }

    const lineColor = p.color(color.toString('rgba'))
    lineColor.setAlpha(p.alpha(color) - 20)

    p.strokeWeight(2)

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
        break
    }
  }



  const startX = 100
  const startY = 100
  const radius = 50
  const padding = 40
  const speed = p.TWO_PI/(360*1.8)

  const circles: Circle[] = []
  const horizontal: Circle[] = []
  const vertical: Circle[] = []

  const plotters: Plotter[] = []



  for (let i =  1; i <= 5; i++) {
    const x = startX + i * (radius * 2 + padding)

    const hColor = p.color(120 + 25 * i, 225, 28, 200)
    const h = new Circle(p, Orientation.Horizontal, x, startX, radius, speed*i, hColor)
    horizontal.push(h)

    const y = startY + i * (radius * 2 + padding)
    const vColor = p.color(28, 225, 120 + 25 * i, 200)
    const v = new Circle(p, Orientation.Vertical, startY, y, radius, speed*i, vColor)
    v.angle = p.PI/2
    vertical.push(v)
    circles.push(h,v)
  }

  // horizontal
  for (let i =  0; i < 5; i++) {
    const h =  horizontal[i]
    for (let j =  0; j < 5; j++) {
      const v =  vertical[j]
      plotters.push(new Plotter(p, h, v))
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
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

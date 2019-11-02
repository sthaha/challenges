const boids = 400
const sharks = 5
const BoidRadius = 8
const SharkRadius = 2.5 * BoidRadius

const nearBy = BoidRadius * 10
const MinSeperation = BoidRadius * 3.5
const EscapeDistance = BoidRadius * 24

const MaxForce =  2.0
const MaxVelocity =  8

const factor = {
  alignment: 0.8,
  separation: 1.0,
  cohesion: 0.35,
  repell: 1.8,
}
const render = {
  radius: false,
  separation: false,
}

class Boid {
  p : p5

  pos : p5.Vector
  velocity : p5.Vector
  maxVelocity : number
  neighbours : Boid[]
  repell : boolean

  constructor(p : p5) {
    this.p = p
    this.pos = p.createVector(p.random(p.width), p.random(p.height))

    this.velocity = p5.Vector.random2D()
    this.velocity.setMag(p.random(2, MaxVelocity))

    this.maxVelocity = MaxVelocity
    this.repell = false
  }


  get x() : number { return this.pos.x }
  get y() : number { return this.pos.y }
  get proximity(): Circle {return new Circle(this.pos.x, this.pos.y, nearBy)}

 setRepell(v: boolean) {this.repell = v}

  draw() {
    const {p, pos, neighbours, repell} = this
    p.noStroke()

    if (render.radius) {
      p.fill(130, 130, 210, 50 + 140 * 1/(neighbours.length + 1))
      p.ellipse(pos.x, pos.y, nearBy + BoidRadius, nearBy +BoidRadius)
    }
    if (render.separation) {
      p.fill(220, 100, 200, 50 + 140 * 1/(neighbours.length + 1))
      p.ellipse(pos.x, pos.y, MinSeperation + BoidRadius, MinSeperation +BoidRadius)
    }
    if (repell) {
      p.fill(220, 180, 40, 240)
      p.ellipse(pos.x, pos.y, SharkRadius, SharkRadius)

    } else {
      p.fill(20, 180, 240, 240)
      p.ellipse(pos.x, pos.y, BoidRadius, BoidRadius)
    }
  }


  align() {
    const {neighbours,velocity, maxVelocity, p } = this

    let steer = p.createVector()
    for (let b of neighbours) {
      steer.add(b.velocity)
    }
    steer.div(neighbours.length)

    // find the steering vector
    steer.sub(velocity)

    steer.setMag(maxVelocity)
    steer.limit(MaxForce)
    return steer
  }

  cohesion() {
    const {neighbours, pos, maxVelocity, velocity, p} = this

    let steer = p.createVector()
    // avg position
    for (let b of neighbours) {
      steer.add(b.pos)
    }
    steer.div(neighbours.length)

    // find the steering vector to that position
    steer.sub(pos)

    // find the change in my velocity to reach there
    steer.sub(velocity)

    steer.setMag(maxVelocity)
    steer.limit(MaxForce)
    return steer
  }

  seperation() {
    const {pos, maxVelocity, velocity, neighbours,  p} = this

    let steer = p.createVector()

    // avg position
    let inRange = 0
    for (let b of neighbours) {
      const dist = pos.dist(b.pos) + BoidRadius
      if (dist > MinSeperation) {
        continue
      }
      // vector Other -> me
      let sepForce = p5.Vector.sub(pos, b.pos)
      sepForce.div(dist)
      steer.add(sepForce)
      inRange++
    }
    if (inRange == 0) {
      return p.createVector()
    }

    // take the average
    steer.div(inRange)

    steer.setMag(maxVelocity)
    steer.limit(MaxForce)
    return steer

  }
  keepAway() {
    const {pos, maxVelocity, velocity, neighbours,  p} = this


    const sharks = neighbours.filter(x => x.repell)
    if (sharks.length == 0) {
      return p.createVector()
    }

    let steer = p.createVector()
    const fish = neighbours.filter(x => !x.repell)



    // find avg position

    // avg position
    let inRange = 0
    for (let s of sharks) {
      const dist = pos.dist(s.pos) + BoidRadius
      if (dist > EscapeDistance) {
        continue
      }
      // vector Other -> me
      let sepForce = p5.Vector.sub(pos, s.pos)
      sepForce.div(dist)
      steer.add(sepForce)
      inRange++
    }
    if (inRange == 0) {
      return p.createVector()
    }

    // take the average
    steer.div(inRange)

    steer.setMag(maxVelocity)
    steer.limit(MaxForce)
    return steer
  }

  update(qtree : QuadTree) {
    const {pos, velocity, p} = this

    this.neighbours  = qtree.query(this.proximity)
      .map(x => x.data)
      .filter(x => x != this)

    let accel = p.createVector()

    if (this.neighbours.length > 0 ) {

      const cohesion = this.cohesion()
      cohesion.mult(factor.cohesion)
      accel.add(cohesion)


      const align = this.align()
      align.mult(factor.alignment)
      accel.add(align)

      const sep = this.seperation()
      sep.mult(factor.separation)
      accel.add(sep)

      const repell = this.keepAway()
      repell.mult(factor.repell)
      accel.add(repell)
    }


    accel.limit(MaxForce)
    velocity.add(accel)
    velocity.limit(MaxVelocity)

    pos.add(velocity)
    this.wrap()
  }

  wrap() {
    let {pos} = this

    if (pos.x < 0)  {
      pos.x = this.p.width
    }
    if (pos.y < 0) {
      pos.y = this.p.height
    }

    if (pos.x > this.p.width) {
      pos.x = 0
    }
    if (pos.y > this.p.height) {
      pos.y = 0
    }
  }

}

const sketch = (p : p5) =>  {
  let flock : Boid[] = []

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    for (let i = 0; i < boids; i++) {
      flock.push(new Boid(p))
    }
    for (let i = 0; i < sharks; i++) {
      const shark = new Boid(p)
      shark.setRepell(true)
      flock.push(shark)
    }

    //p.noLoop()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }



  p.draw = () => {
    p.background(0)
    p.fill(0)
    let qtree = new QuadTree(new Rect(0, 0, p.width, p.height), 4)
    for (let f of flock) {
      qtree.insert({x: f.x, y: f.y, data: f})
    }

    //const snapshot = [...flock]
    for (let f of flock) {
      f.update(qtree)
      f.draw()
    }

  }
  p.mousePressed = () =>  { console.log(p.frameRate()) }
}

new p5(sketch)

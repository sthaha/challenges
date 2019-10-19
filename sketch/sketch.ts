const boids = 200
const BoidRadius = 8

const nearBy = BoidRadius * 5
const MinSeperation = BoidRadius * 3

const MaxForce =  2.0
const MaxSpeed =  8
const showRadius = false

class Boid {
  p : p5
  pos : p5.Vector
  velocity : p5.Vector
  accel : p5.Vector
  speed : number
  neighbours : Boid[]

  constructor(p : p5) {
    this.p = p
    this.pos = p.createVector(p.random(p.width), p.random(p.height))

    this.velocity = p5.Vector.random2D()
    this.velocity.setMag(p.random(2, MaxSpeed))
    this.accel = p.createVector()

    this.speed = MaxSpeed
  }

  draw() {
    const {p, pos, neighbours} = this
    p.noStroke()

    if (showRadius) {
      p.fill(130, 130, 210, 50 + 140 * 1/(neighbours.length + 1))
      p.ellipse(pos.x, pos.y, nearBy + BoidRadius, nearBy +BoidRadius)
    }
    p.fill(20, 140, 220, 200)
    p.ellipse(pos.x, pos.y, BoidRadius, BoidRadius)
  }


  align() {
    const {neighbours,velocity, speed, p } = this
    let steer = p.createVector()
    if (neighbours.length == 0) {
      return steer
    }

    for (let b of neighbours) {
      steer.add(b.velocity)
    }
    steer.div(neighbours.length)

    // find the steering vector
    steer.sub(velocity)

    steer.setMag(speed)
    steer.limit(MaxForce)
    return steer
  }

  cohesion() {
    const {neighbours, pos, speed, velocity, p} = this

    let steer = p.createVector()
    if (neighbours.length == 0) {
      return steer
    }

    // avg position
    for (let b of neighbours) {
      steer.add(b.pos)
    }
    steer.div(neighbours.length)

    // find the steering vector to that position
    steer.sub(pos)

    // find the change in my velocity to reach there
    steer.sub(velocity)

    steer.setMag(speed)
    steer.limit(MaxForce)
    return steer
  }

  seperation() {
    const {pos, speed, velocity, neighbours,  p} = this

    let steer = p.createVector()
    if (neighbours.length == 0) {
      return steer
    }

    // avg position
    let inRange = 0
    for (let b of neighbours) {
      const dist = pos.dist(b.pos)
      if (dist > MinSeperation || dist === 0) {
        continue
      }
      // vector Other -> me
      let sepForce = p5.Vector.sub(pos, b.pos)
      sepForce.div(dist)
      steer.add(sepForce)
      inRange++
    }
    steer.div(p.max(inRange, 1))

    steer.setMag(speed)
    steer.limit(MaxForce)
    return steer

  }

  update(flock : Boid[]) {
    const {pos, velocity, p} = this
    this.neighbours = flock.filter(x => x != this && pos.dist(x.pos) <= nearBy)


    let accel = p.createVector()

    const sep = this.seperation()
    accel.add(sep)

    const cohesion = this.cohesion()
    accel.add(cohesion)


    const steer = this.align()
    accel.add(steer)


    accel.limit(MaxForce)
    velocity.add(accel)
    velocity.limit(MaxSpeed)

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
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }



  p.draw = () => {
    p.background(0)
    p.fill(0)

    const snapshot = [...flock]
    for (let f of flock) {
      f.update(snapshot)
      f.draw()
    }

  }
}

new p5(sketch)

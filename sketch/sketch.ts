const boids = 50

const nearBy = 80
const MaxForce =  0.95
const MaxSpeed =  7

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
    this.velocity.setMag(p.random(2, 5))
    this.accel = p.createVector()

    this.speed = MaxSpeed
  }

  draw() {
    const {p, pos, neighbours} = this
    p.noStroke()
    p.fill(130, 130, 210, 50 + 140 * 1/(neighbours.length + 1))
    p.ellipse(pos.x, pos.y, nearBy +16, nearBy +16)
    p.fill(160)
    p.ellipse(pos.x, pos.y, 16, 16)
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
    // ensure the turn is ma
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
    steer.setMag(speed)

    // find the change in my velocity to reach there
    steer.sub(velocity)
    steer.limit(MaxForce)
    return steer
  }

  update(flock : Boid[]) {
    const {pos, velocity, accel, p} = this
    this.neighbours = flock.filter(x => x != this && pos.dist(x.pos) <= nearBy)

    //const steer = this.align()
    //this.accel = steer

    const cohesion = this.cohesion()
    this.accel = cohesion

    //steer.add(cohesion).limit(MaxForce)
    //this.accel = steer

    pos.add(velocity)
    velocity.add(accel)
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
    for (let f of flock) {
      f.update(flock)
      f.draw()
    }
  }
}

new p5(sketch)

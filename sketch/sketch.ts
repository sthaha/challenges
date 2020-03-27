const InfectionRadius = 25
const Movement = 3.5
const N = 100;
const diameter = 6
const Recovery = 20
const RecoveryRate = 0.05

class Person {
  p: p5
  population: Person[]

  pos: p5.Vector
  v: p5.Vector
  infected = false
  recovery: number = 0

  constructor(p: p5, pos: p5.Vector, population: Person[]){
    this.p = p
    this.pos = pos
    this.v = p.createVector(p.random(-Movement, Movement), p.random(-Movement, Movement))
    this.population = population
  }

  infect(){
    if (this.infected){
      return
    }

    this.infected = true
    this.recovery = Recovery
  }

  recovered() {
    if (!this.infected){
      return true
    }

    this.recovery -= RecoveryRate
    this.infected = this.recovery >= 0
    return !this.infected
  }

  update(){
    const {p, pos, v, infected, population} = this

    this.pos.add(v)
    const r = p.createVector(p.random(-0.8, 0.8), p.random(-0.8, 0.8))
    this.pos.add(r)

    this.wrap()

    if (this.recovered()){
      return
    }

    for (const other of population) {
      if (other == this){
        continue
      }
      if (this.pos.dist(other.pos) < InfectionRadius) {
        other.infect()
      }
    }
  }

  draw() {
    const {p, pos, infected} = this

    if (infected) {
      p.fill(250,10, 120, 80)
    } else {
      p.fill(25,210, 120, 20)
    }
    p.circle(pos.x, pos.y, InfectionRadius)

    if (infected) {
      p.fill(250,10, 120)
    } else {
      p.fill(70,120, 180)
    }
    p.circle(pos.x, pos.y, diameter)
  }

  wrap() {
    const {p, pos} = this
    const {x, y} = pos
    const {width, height} = p

    const d = diameter
    const r = d/2

    if (x-d  > width){
      this.pos.x = -r
    }else if (x+d < 0){
      this.pos.x = width+r
    }

    if (y-d > height){
      this.pos.y = -r
    }else if (y+d < 0){
      this.pos.y = height+r
    }

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
  }


  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  const population: Person[] = []

  const randV = (x: number, y: number) => p.createVector(p.random(x), p.random(y))

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    for(let i = 0; i < N; i++) {
      population.push(new Person(p, randV(p.width, p.height), population))
    }
    population[Math.trunc(p.random(N))].infect()

    p.noStroke()
    noLoop()

  }

  p.draw = () => {
    if (population.filter((x) => x.infected == false).length == 0) {
      noLoop()
    }

    p.background(17)
    for (const person of population) {
      person.update()
      person.draw()
    }
  }
}

new p5(sketch)

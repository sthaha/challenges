const InfectionRadius = 20
const Movement = 1.5
const N = 200;
const diameter = 5
const Recovery = 20
const RecoveryRate = 0.05

enum Stage {
  Uninfected,
  Infected,
  Recovered,
  Terminated,
}

class Person {
  p: p5
  population: Person[]

  pos: p5.Vector
  v: p5.Vector

  stage = Stage.Uninfected
  infection: number = 0
  health: number


  constructor(p: p5, pos: p5.Vector, population: Person[]){
    this.p = p
    this.pos = pos
    this.v = p.createVector(p.random(-Movement, Movement), p.random(-Movement, Movement))
    this.population = population
    this.health = p.random(5, 20)
  }

  infect(){
    if (this.stage == Stage.Uninfected  ){
      this.stage = Stage.Infected
      this.infection = Recovery
    }
  }

  recover() {
    const {stage} = this
    if (stage != Stage.Infected ){
      return
    }

    this.health -= 0.023
    if (this.health <= 0.0) {
      this.stage = Stage.Terminated
      return
    }

    this.infection -= RecoveryRate
    if (this.infection <= 0) {
      this.stage = Stage.Recovered
    }
  }

  update(){
    const {p, pos, v, population, stage} = this

    if (stage == Stage.Terminated){
      return
    }

    this.pos.add(v)
    const r = p.createVector(p.random(-0.8, 0.8), p.random(-0.8, 0.8))
    this.pos.add(r)

    this.wrap()

    if (this.stage != Stage.Infected){
      return
    }
    this.recover()

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

    const {p, pos, stage} = this

    switch (stage) {
    case Stage.Uninfected: p.fill(50,180, 220, 100); break;
    case Stage.Infected: p.fill(250,10, 120, 80); break;
    case Stage.Recovered: p.fill(150,120, 220, 180); break;
    case Stage.Terminated: p.fill(110,110, 110, 80); break;
    }
    p.circle(pos.x, pos.y, InfectionRadius)

    switch (stage) {
    case Stage.Uninfected: p.fill(70,120, 180); break;
    case Stage.Infected: p.fill(250,10, 120); break;
    case Stage.Recovered: p.fill(150,120, 220); break;
    case Stage.Terminated: p.fill(130,130, 130); break;
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
    if (population.filter((x) => x.stage == Stage.Infected).length == 0) {
      const fatality = population.reduce((a, x) => x.stage == Stage.Terminated ? a+1 : a, 0)
      console.log("Fatalities: ", fatality)
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

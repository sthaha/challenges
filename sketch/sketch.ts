const InfectionRadius = 25
const Movement = 1.2
const N = 100;

const PersonSize = 5
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
    const range = 1.2
    const r = p.createVector(
      p.random(-range, range),
      p.random(-range, range))
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
    case Stage.Uninfected: p.fill(50,180, 220, 80); break;
    case Stage.Infected: p.fill(250,10, 120, 80); break;
    case Stage.Recovered: p.fill(150,120, 220, 80); break;
    case Stage.Terminated: p.fill(110,110, 110, 80); break;
    }
    p.circle(pos.x, pos.y, InfectionRadius)

    switch (stage) {
    case Stage.Uninfected: p.fill(70,120, 180); break;
    case Stage.Infected: p.fill(250,10, 120); break;
    case Stage.Recovered: p.fill(150,120, 220); break;
    case Stage.Terminated: p.fill(230,130, 130); break;
    }
    p.circle(pos.x, pos.y, PersonSize)
  }

  wrap() {
    const {p, pos} = this
    const {x, y} = pos
    const {width, height} = p

    const d = PersonSize
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

  const stageCount = (s: Stage ) => population.reduce((a, x) => x.stage == s ? a+1: a, 0)

  const infected: number[] = []
  const recovered: number[] = []
  const fatal:  number[]= []
  const uninfected:  number[]= []

  const stats = () => {

    const i = stageCount(Stage.Infected)
    const f = stageCount(Stage.Terminated)
    const r = stageCount(Stage.Recovered)
    const u = population.length - (i + r + f)


    infected.push(i)
    fatal.push(f)
    recovered.push(r)
    uninfected.push(u)

    const border = 2
    const w = p.width - border* 2
    //const w = population.length * 2.5
    const h = population.length * 1.15

    const x = 0 // p.width - w -2
    //const x = (p.width - w - border) /2
    const y = p.height - h - border

    p.strokeWeight(border)
    p.stroke(113, 113, 113, 200)
    p.fill(13, 13, 13, 178)

    p.rect(x, y, w, h)

    const graph = (data : number[]) => {
      p.beginShape()
      const start = x + border
      const base = y + h - border

      const l = data.length
      const trim = p.max(0, l - (w - border * 2))
      for (let i = 0;  i < l; i++) {
        p.vertex(start+i, base - data[i+trim])
      }
      p.endShape()
      p.circle(start -trim + l-1, base - data[l - 1], 3)
    }

    p.stroke(78, 148, 178)
    graph(uninfected)

    p.stroke(218, 88, 18)
    graph(infected)

    p.stroke(240, 18, 18)
    graph(fatal)

    p.stroke(150,120, 220)
    graph(recovered)
  }

  p.draw = () => {
    const infections = stageCount(Stage.Infected)
    if ( infections == 0 ) {
      stats()
      noLoop()
    }

    p.background(17)
    p.noStroke()
    for (const person of population) {
      person.update()
      person.draw()
    }
    stats()
  }
}

new p5(sketch)

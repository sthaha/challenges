const rose = (p : p5) =>  {

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }


  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.angleMode(p.DEGREES)
  }

  const n = 3
  const d = 29


  p.draw = () => {
    p.background(0)
    p.translate(p.width/2, p.height/2)
    // inner lines
    p.stroke(200)
    p.strokeWeight(1)
    p.noFill()
    p.beginShape()

    for (let i = 0; i < 360; i++) {
      const k = i * d
      const r = p.sin(n * k) * 250

      const x = p.cos(k) * r
      const y = p.sin(k) * r
      p.vertex(x,y)
    }
    p.endShape(p.CLOSE)


    // plot movement of the radius
    p.stroke(200, 100, 122, 200)
    p.strokeWeight(3)
    p.beginShape()
    for (let i = 0; i < 360; i++) {
      const k = i // note i * d
      const r = p.sin(n * k) * 250

      const x = p.cos(k) * r
      const y = p.sin(k) * r
      p.vertex(x,y)
    }
    p.endShape()
  }
}
new p5(rose)

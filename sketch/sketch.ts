const sketch = (p : p5) =>  {

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  let points : Point[] = []
  let qtree: QuadTree

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)

    qtree = new QuadTree(new Rect(0, 0, p.width, p.height), 5)
    for (let i = 0; i < 100; i++) {
      const x = p.random(0, p.width)
      const y = p.random(0, p.height)
      const pt = {x, y}
      points.push(pt)
      qtree.insert(pt)
    }

  }


  p.draw = () => {
    p.background(0)

    p.fill(200)
    p.noStroke()
    for(let pt of points) {
      p.ellipse(pt.x, pt.y, 8, 8)
    }
    qtree.draw(p)



    const r = new Rect(p.mouseX - 150, p.mouseY-40, 300, 180)

    const highlight = qtree.query(r)
    p.stroke(0, 222, 160, 160)
    p.fill(0, 200, 140, 180)
    for (let pt of highlight) {
      p.ellipse(pt.x, pt.y, 12, 12)
    }

    p.rectMode(p.CENTER)
    p.noFill()
    p.stroke(0, 200, 120, 100)
    p.strokeWeight(2)
    p.rect(r.midX, r.midY, r.w, r.h)
  }

  p.mouseMoved = () => {
  }

  p.mouseDragged = () => {
    console.log("pressed: ", p.mouseIsPressed)
    if (!p.mouseIsPressed) {
      return
    }
    const pt = {x: p.mouseX, y: p.mouseY}
    points.push(pt)
    qtree.insert(pt)
  }
}

new p5(sketch)

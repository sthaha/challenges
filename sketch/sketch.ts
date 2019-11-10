
type Point = {x: number, y: number}

const sketch = (p : p5) =>  {
  // parameters inputs
  let outerCircleSlider: p5.Element
  let innerCircleSlider: p5.Element
  let dotSpeedSlider: p5.Element
  let trackSlider: p5.Element
  let ratioSlider: p5.Element

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight - 50)

    outerCircleSlider = p.createSlider(10, 350, 200 , 1)
    innerCircleSlider = p.createSlider(10, 350, 100 , 1)
    dotSpeedSlider = p.createSlider(1, 50, 5, 1)

    trackSlider = p.createSlider(0, 2.0, 1.0 , 0.1)
    ratioSlider = p.createSlider(0, 16.0, 1.0 , 0.1)

    p.angleMode(p.DEGREES)
    p.noLoop()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
  // angle keeps incrementing at innerSpeed
  let innerAngle = 0
  let angle = 0

  let outerRadius = 300
  let innerRadius = outerRadius * 0.5
  let innerSpeed = 5

  // dot is the point that draws the dots; 1.0 means the dot is on the
  // inner-circle; < 1.0 inside and > outside the inner-circle
  // actualPoint = innerRadius * dot
  let dot = 0.5

  let ratio = 0.25

  p.draw = () => {
    p.background(0)
    p.translate(p.width/2, p.height/2)
    p.scale(1, -1)
    drawAxis()

    // vars

    outerRadius = <number> outerCircleSlider.value()
    innerRadius = <number> innerCircleSlider.value()
    innerSpeed = <number> dotSpeedSlider.value()

    dot = <number> trackSlider.value()
    ratio = <number> ratioSlider.value()



    const radiusRatio = innerRadius/outerRadius

    // outer
    drawOuterCirle()

    // path of the inner circle
    drawInnerCirlcePath()

    angle =  (ratio * -innerAngle * radiusRatio) % 360
    console.log("inner:",  innerAngle, " | outer: ", angle,  "ratio: ", radiusRatio,
                "completed: ",  cycleCompleted, "points:", points.length  )

    // center of the inner circle
    const x = p.cos(angle) * (outerRadius - innerRadius)
    const y = p.sin(angle) * (outerRadius - innerRadius)


    // inner circle
    drawInnerCirlce(x, y)


    // mark a point in the inner circle at innerAngle
    const innerX = x + p.cos(innerAngle) * innerRadius * dot
    const innerY = y + p.sin(innerAngle) * innerRadius * dot
    if (!cycleCompleted) {
      points.push({x: innerX, y:innerY})
    }

    //p.fill(200, 180)
    p.stroke(20, 225, 245, 215)
    p.strokeWeight(5)
    p.noFill()
    p.ellipse(innerX, innerY, 6, 6)

    plotPoints()


    if (angle == 0 && innerAngle != 0 && innerAngle % 360 == 0) {
      innerAngle = 0
      cycleCompleted = true
    }

    innerAngle += innerSpeed

  }

  function plotPoints() {
    p.stroke(0, 225, 145, 165)
    p.strokeWeight(2)
    p.beginShape()
    for (let pt of points) {
      p.vertex(pt.x, pt.y)
    }

    p.endShape(cycleCompleted ? p.CLOSE : undefined)
    //if (cycleCompleted) {
      //p.endShape(p.CLOSE)

    //} else {
      //p.endShape()
    //}
  }



  function drawAxis() {
    // Y
    p.strokeWeight(3)
    p.stroke(230,0,0, 180)
    p.line(0,0, 0,p.height)

    p.stroke(160,0,0, 120)
    p.line(0,0, 0, -p.height)

    // X
    p.stroke(0,230,0, 180)
    p.line(0,0, p.width, 0)

    p.stroke(0,160,0, 120)
    p.line(0,0, -p.width, 0)

    p.noStroke()
    p.fill(120,122, 128, 180)
    p.ellipse(0, 0, 8, 8)
  }

  function drawOuterCirle() {
    p.noFill()
    p.stroke(122, 155, 205, 200)
    p.strokeWeight(3)
    p.ellipse(0, 0, outerRadius*2, outerRadius*2)
  }

  function drawInnerCirlcePath() {
    p.noFill()
    p.strokeWeight(2)
    p.stroke(122, 100, 55, 180)
    p.ellipse(0, 0, (outerRadius-innerRadius)*2 , (outerRadius-innerRadius)*2)
  }

  function drawInnerCirlce(x: number, y: number) {
    p.noFill()
    p.stroke(222, 125, 105, 225)
    p.strokeWeight(2)
    p.ellipse(x, y, innerRadius*2, innerRadius*2)

    p.stroke(222, 125, 105, 225)
    p.strokeWeight(5)
    p.ellipse(x, y, 4, 4)
  }

  let points: Point[] = []
  let cycleCompleted = false


  p.mousePressed = () => p.redraw()

  let stopped : boolean = true
  p.keyPressed = ()=> {
    if (p.keyCode == 27) {
      cycleCompleted = false
      points = []
      angle = 0
      innerAngle = 0
      return
    }

    if (p.keyCode == 32 )   {

      if (stopped) {
          p.loop()
      } else
          p.noLoop()
      }
      stopped = !stopped
    }

}


//new p5(controls)
new p5(sketch)

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
        p.redraw()
        break
    }
  }


  p.windowResized = () => {
    const min = p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight
    p.resizeCanvas(min, min)
  }


  let minSlider: p5.Element
  let maxSlider: p5.Element

  p.setup = () => {
    const min = p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight
    p.createCanvas(min, min)
    p.createDiv()
    minSlider = p.createSlider(-2, 2, -1, 0.01 )
    maxSlider = p.createSlider(-2, 2, 1, 0.01 )
    noLoop()
  }

  const maxIterations = 80;
  p.draw = () => {
    p.background(0)
    p.pixelDensity(1)
    p.loadPixels()

    const min = minSlider.value()
    const max = maxSlider.value()
    for (let y = 0; y < p.height; y++) {
      const row = y * p.width

      for (let x = 0; x < p.width; x++){

        // a + bi
        const a = p.map(x, 0, p.width, min, max)
        const b = p.map(y, 0, p.height, min, max)

        let real = a
        let img  = b
        let growth = 0

        for (let i = 0; i < maxIterations; i++ ) {
          // a2 - b2 + 2abi
          // r = a2 = b2
          // i = 2abi

          const r =  real * real - img * img
          const i =  2 * real * img

          real = r + a
          img = i + b

          if (real*real + img*img > 30) {
            break
          }
          growth++
        }

        const brightness = p.map(growth, 0, maxIterations, 0, 255)


        const pix = (row + x) * 4
        p.pixels[pix + 0] = brightness // rbga
        p.pixels[pix + 1] = brightness
        p.pixels[pix + 2] = brightness
        p.pixels[pix + 3] = 200
      }
    }
    p.updatePixels()
  }
}

new p5(sketch)



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
  let divergenceSlider: p5.Element

  p.setup = () => {
    const min = p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight
    p.createCanvas(min, min)
    p.createDiv()
    minSlider = p.createSlider(-4.5, 4.5, -3.4, 0.01 )
    p.createDiv()
    maxSlider = p.createSlider(-4.5, 4.5, 3.2, 0.01 )
    p.createDiv()
    divergenceSlider = p.createSlider(1, 20, 5, 0.5)
    //noLoop()
  }

  const prev = {
    min : 0, max: 0, divergence: 0
  };

  const maxIterations = 150;
  p.draw = () => {
    const min = <number>minSlider.value()
    const max = <number>maxSlider.value()
    const divergence = <number>divergenceSlider.value()
    if (prev.min == min && prev.max == max && prev.divergence == divergence) {
      return
    }

    p.background(0)
    p.pixelDensity(1)
    p.loadPixels()



    const divering = p.map(p.mouseX, 0, p.width, 10, 100)
    for (let y = 0; y < p.height; y++) {
      const row = y * p.width

      for (let x = 0; x < p.width; x++){

        // a + bi
        const a = p.map(x, 0, p.width, min, max)
        const b = p.map(y, 0, p.height, min, max)

        let real = a
        let img  = b
        let n = 0 // number of iter
        for (n = 0; n < maxIterations; n++ ) {
          // a2 - b2 + 2abi
          // r = a2 = b2
          // i = 2abi

          const r =  real * real - img * img
          const i =  2 * real * img

          real = r + a
          img = i + b

          if (real*real + img*img > divergence) {
            break
          }
        }

        // normalize the brightness of the pixel
        const norm = p.map(n, 0, maxIterations, 0.0, 1.0)
        const brightness = p.map(p.sqrt(norm), 0, 1.0, 200, 0)


        const pix = (row + x) * 4
        p.pixels[pix + 0] = brightness // rbga
        p.pixels[pix + 1] = brightness
        p.pixels[pix + 2] = brightness
        p.pixels[pix + 3] = 255
      }
    }
    p.updatePixels()
  }
}

new p5(sketch)



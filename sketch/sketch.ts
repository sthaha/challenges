
const puzzle=`
 asbtcdeseussitf
 torangestsoapss
 ouxezlvwseuecrq
 mpympaunekcihcu
 aasprstqlatpeua
 tbandaerbceveqs
 odbcaccpadagsph
 eocrneootedweng
 sguimrbgesfapeh
 rfdslehdgesxozi
 eoopmahselistos
 aonsklievkzyjrp
 fdklimcjkcaalfo
 hgitjivhlimbmkh
 gtekramrepusnjs
`
const words = `
  apples
  bakedbeans
  bread
  cake
  cereal
  cheese
  chicked
  crips
  dogfood
  eggs
  frozen
  jam
  list
  meat
  milk
  oranges
  peas
  pickle
  pie
  rice
  shampoo
  shops
  soap
  soup
  squash
  supermarket
  tea
  tissues
  tomatoes
  vegetables
`
type Cell = {
  row : number
  col : number
}

class Board {
  p : p5
  rows : number
  cols : number
  table : string[]
  border : number  = 50
  cell : number  = 50
  location :  any = {}
  marked :  any = {}

  constructor(p : p5, table: string[]) {
    this.p = p
    this.table = table
    this.rows = table.length
    this.cols = table[0].length
    this.createIndex()
  }

  createIndex() {
    this.location = {}
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const ch = this.table[r][c]
        this.location[ch] = this.location[ch] || []
        this.location[ch] = [...this.location[ch], {row: r, col:c}]
      }
    }
  }

  at(row: number, col: number) {
    return this.table[row][col]
  }

  mark(cells: Cell[]) {
    const {map, random, color} = this.p
    const g = map(random(), 0, 1.0, 120, 255)

    cells.forEach((c, i) => {
      this.marked[c.row] = this.marked[c.row] || {}
      const clr = this.p.color(10, g - i*6, 170)
      this.marked[c.row][c.col] = clr
    })
  }

  draw() {
    this.drawCells()
    this.drawMarked()
    this.drawLetters()
  }

  get left() { return this.border }
  get top() { return this.border }
  get height() { return this.rows * this.cell  }
  get width () { return this.cols * this.cell }
  get dr() { return this.height / this.rows }
  get dc() { return this.width / this.cols }

  reveal(word: string) {
    const impl =() => {
      let x = word[0]
      if (! (x in this.location)) {
        console.log(x, "not in index")
        return
      }

      const hits = this.location[x]
      console.log("x: ", x, "hits:", hits)

      for (let cell of hits) {
        let dirs = this.dirForLetter(cell, word[1])
        console.log("dirs:", dirs)

        for (let d of  dirs) {
          console.log("exploring from:", cell.row, cell.col, " in  dir:", d.row, d.col)
          let cells = this.wordFrom(cell, d, word)
          if (cells.length > 0) {
            console.log("found word", word, cells)
            this.mark(cells)
            return
          }
        }
      }
    }
    console.group(word)
    const ret = impl()
    console.groupEnd()
    return ret
  }

  wordFrom(x : Cell, dir: Cell, word: string): Cell[]{
    const len = word.length

    const end = {row: x.row + dir.row * (len-1), col: x.col + dir.col * (len - 1)}
    console.log("  ending ... :", end.row, end.col)
    if (end.row <0 || end.row >= this.rows ||
        end.col < 0 || end.col >= this.cols) {
        console.log(" ... out of bound ", end)
        return []
    }

    if (this.at(end.row, end.col) != word[len-1] ) {
      console.log("  last index does not match")
      return []
    }

    let found = []
    for(let i =0; i< len; i++) {
      const row = x.row + dir.row * i
      const col = x.col + dir.col * i
      const ch = this.at(row, col)
      if (word[i] != ch) {
        console.log("    at:(", row, col, ") is not ", word[i])
        return []
      }
      found.push({row, col})
    }
    return found
  }

  dirForLetter(x: Cell, target: string){
    let all = [
      {row: x.row - 1, col: x.col - 1},
      {row: x.row - 1, col: x.col },
      {row: x.row - 1, col: x.col + 1},

      {row: x.row, col: x.col - 1},
      {row: x.row, col: x.col + 1},

      {row: x.row + 1, col: x.col - 1},
      {row: x.row + 1, col: x.col },
      {row: x.row + 1, col: x.col + 1},
    ]
    return all.filter(c =>
      c.row >=0 && c.row < this.rows &&
      c.col >= 0 && c.col < this.cols &&
      this.at(c.row, c.col) == target
    ).map(c => ({row: c.row - x.row, col: c.col - x.col }) )
  }

  drawLetters() {
    const {p, left, top,  dr, dc, cell} = this
    p.fill(0)
    p.stroke(0)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c  * dc  + left + cell /2.5
        const y = r  * dr  + top + cell/1.85
        p.text(this.at(r, c).toUpperCase(), x, y)
      }
    }
  }

  drawMarked() {
    const {p, left, top,  dr, dc, cell} = this

    for (let r = 0; r < this.rows; r++) {
      if (!this.marked[r]){
        continue
      }

      for (let c = 0; c < this.cols; c++) {
        const clr = this.marked[r][c]
        if (!clr) {
          continue
        }

        const x = c  * dc  + left
        const y = r  * dr  + top

        p.fill(clr);
        p.rect(x, y, cell, cell)

        console.log(" mark", r, c, " | rect", x, y, cell, cell, " | clr", clr)
      }
    }
    p.noFill()
  }


  drawCells() {
    const {p, left, top, height, width, dr, dc} = this

    p.stroke(200, 100, 200)
    p.rect(top, left, width, height);

    p.stroke(0)
    for (let r = 1 ; r < this.rows; r++) {
      const y = top + r * dr
      p.line(left, y, left+width, y)
    }

    for (let c = 1 ; c < this.cols; c++) {
      const x =left + c * dc
      p.line(x, top, x, top + height)
    }

  }
}

const wordfinder = (p : p5) => {

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  const table = puzzle
      .split("\n")
      .map(x => x.trim())
      .filter(x => x.length > 0)

  console.table(table)
  let board = new Board(p,table)

  const lookFor = words
    .split("\n")
    .map(x => x.trim())
    .filter(x => x.length > 0)

    console.table(lookFor)
    lookFor.forEach(w => board.reveal(w))

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.noLoop()
  }

  p.draw = () => {
    p.fill(255)
    board.draw()
  }

  p.mousePressed = () => { }
}


const p  = new p5(wordfinder)

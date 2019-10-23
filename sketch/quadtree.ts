
type Point = {x: number, y:number}


interface Container {
  contains(p: Point): boolean
  intersects(other: Container): boolean
}

class Rect implements Container {
  x: number
  y: number
  w: number
  h: number

  constructor(x : number, y:number, w:number, h:number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  get midX(): number {
    return this.x + this.w/2
  }
  get midY(): number {
    return this.y + this.h/2
  }

  contains(p: Point): boolean {
    const {x, y, w, h} = this

    return x <= p.x && p.x <= x + w &&
           y <= p.y && p.y <= y + h
  }

  intersects(o: Rect): boolean {
    const {x,y} = this
    const left = (x <= o.x) ? this : o
    const right = (x > o.x) ? this : o
    const rTopLeft = {x: right.x, y: right.y}
    const rBottomLeft = {x: right.x, y: right.y+right.h}
    return left.contains(rTopLeft) || left.contains(rBottomLeft)
  }
}

class QuadTree {
  bounds : Rect
  threshold : number
  points : Point[]

  divided : boolean  = false
  ne: QuadTree
  nw: QuadTree
  se: QuadTree
  sw: QuadTree

  constructor(bounds: Rect, threshold: number) {
    this.bounds = bounds
    this.threshold = threshold
    this.points = []
    this.divided = false
  }

  insert(p: Point): boolean {
    const {bounds, points, divided, threshold} = this
    if (!bounds.contains(p)) {
      return false
    }

    console.log("points: ", points)
    if (points.length < this.threshold) {
      points.push(p)
      return true
    }

    this.split()
    const {ne, nw, se, sw} = this
    return ne.insert(p) || nw.insert(p) ||
            se.insert(p) || sw.insert(p)

  }

  split() {
    if (this.divided) {
      return
    }

    const {x, y, w, h} = this.bounds
    const {threshold} = this

    this.ne = new QuadTree(new Rect(x, y, w/2, h/2), threshold)
    this.se = new QuadTree(new Rect(x, y + h/2, w/2, h/2), threshold)
    this.nw = new QuadTree(new Rect(x+w/2, y, w/2, h/2), threshold)
    this.sw = new QuadTree(new Rect(x+w/2, y + h/2, w/2, h/2), threshold)
    this.divided = true
  }

  query(c : Rect): Point[] {
    if (!this.bounds.intersects(c)) {
      return []
    }
    const points = this.points.filter(pt => c.contains(pt) )
    if (!this.divided) {
      return points
    }

    const ne = this.ne.query(c)
    const nw = this.nw.query(c)
    const se = this.se.query(c)
    const sw = this.sw.query(c)

    return [...points, ...ne, ...nw, ...se, ...sw]
  }

  draw(p : p5) {

    const {x, y, w, h} = this.bounds
    p.noFill()
    p.stroke(200)
    p.rectMode(p.CORNER)
    p.rect(x, y, w, h)

    if(this.divided) {
      this.ne.draw(p)
      this.nw.draw(p)
      this.se.draw(p)
      this.sw.draw(p)
    }
  }
}

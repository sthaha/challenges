
type Point = {x: number, y:number}


interface Container {
  contains(p: Point): boolean
  intersects(other: Container): boolean
}

class Circle implements Container {
  x: number
  y: number
  r: number

  constructor(x : number, y:number, r:number) {
    this.x = x
    this.y = y
    this.r = r
  }

  contains(p: Point): boolean {
    const {x, y, r} = this
    const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y)**2)

    if (!this.boundingRect().contains(p) && dist <= r) {
      console.log("me", x, y, r)
      console.log("pt", p.x, p.y,  "| dist", dist)
    }

    return dist <= r
  }

  intersects(o: Rect): boolean {
    //const {x, y, r} = this

    //const sq = this.boundingRect()
    //console.log("me", x, y, r)
    //console.log("sq", sq.x, sq.y, sq.w, sq.h)
    //console.log("other", o.x, o.y, o.w, o.h)

    return this.boundingRect().intersects(o)
  }

  draw(p: p5) {
    const {x, y, r} = this
    const d = r * 2

    p.noFill()
    p.stroke(220, 220, 0, 200)
    p.ellipse(x, y, d, d)
    this.boundingRect().draw(p)
  }

  boundingRect(): Rect {
    const {x, y, r} = this
    const left = Math.max(x -r, 0)
    const w = x+r - left

    const top = Math.max(y -r, 0)
    const h = y+r - top
    return new Rect(left,top, w, h)
  }

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

    // find left and right rect
    const [l, r] = this.x < o.x ? [this, o] : [o, this]
    // top and bottom rect
    const [t, b] = this.y < o.y ? [this, o] : [o, this]

    console.group()
      console.log([this.x, this.y, this.w, this.h],  [o.x, o.y, o.w, o.h])
      console.log(l.x + l.w + r.w, r.x + r.w)
      console.log(t.y + t.h + b.h, b.y + b.h)
    console.groupEnd()
    // see if the
    // - right rect x is inside left rect
    // - the bottom rect is inside top rect
    return (l.x + l.w) > r.x && (t.y + t.h) > b.y
  }


  draw(p: p5) {
    const {x, y, w, h} = this

    p.noFill()
    p.stroke(0, 200, 120, 100)
    p.strokeWeight(2)
    p.rect(x, y, w, h)
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

    //console.log("points: ", points)
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

  query(c : Container): Point[] {
    if (!c.intersects(this.bounds) ) { //this.bounds.intersects(c)) {
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
    //p.rectMode(p.CORNER)

    const {x, y, w, h} = this.bounds
    p.noFill()
    p.stroke(200)
    p.rect(x, y, w, h)

    if(this.divided) {
      this.ne.draw(p)
      this.nw.draw(p)
      this.se.draw(p)
      this.sw.draw(p)
    }
  }
}

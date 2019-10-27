var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Rect = (function () {
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Object.defineProperty(Rect.prototype, "midX", {
        get: function () {
            return this.x + this.w / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "midY", {
        get: function () {
            return this.y + this.h / 2;
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.contains = function (p) {
        var _a = this, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        return x <= p.x && p.x <= x + w &&
            y <= p.y && p.y <= y + h;
    };
    Rect.prototype.intersects = function (o) {
        var _a = this.x < o.x ? [this, o] : [o, this], l = _a[0], r = _a[1];
        var _b = this.y < o.y ? [this, o] : [o, this], t = _b[0], b = _b[1];
        return (l.x + l.w) > r.x && (t.y + t.h) > b.y;
    };
    return Rect;
}());
var QuadTree = (function () {
    function QuadTree(bounds, threshold) {
        this.divided = false;
        this.bounds = bounds;
        this.threshold = threshold;
        this.points = [];
        this.divided = false;
    }
    QuadTree.prototype.insert = function (p) {
        var _a = this, bounds = _a.bounds, points = _a.points, divided = _a.divided, threshold = _a.threshold;
        if (!bounds.contains(p)) {
            return false;
        }
        console.log("points: ", points);
        if (points.length < this.threshold) {
            points.push(p);
            return true;
        }
        this.split();
        var _b = this, ne = _b.ne, nw = _b.nw, se = _b.se, sw = _b.sw;
        return ne.insert(p) || nw.insert(p) ||
            se.insert(p) || sw.insert(p);
    };
    QuadTree.prototype.split = function () {
        if (this.divided) {
            return;
        }
        var _a = this.bounds, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        var threshold = this.threshold;
        this.ne = new QuadTree(new Rect(x, y, w / 2, h / 2), threshold);
        this.se = new QuadTree(new Rect(x, y + h / 2, w / 2, h / 2), threshold);
        this.nw = new QuadTree(new Rect(x + w / 2, y, w / 2, h / 2), threshold);
        this.sw = new QuadTree(new Rect(x + w / 2, y + h / 2, w / 2, h / 2), threshold);
        this.divided = true;
    };
    QuadTree.prototype.query = function (c) {
        if (!this.bounds.intersects(c)) {
            return [];
        }
        var points = this.points.filter(function (pt) { return c.contains(pt); });
        if (!this.divided) {
            return points;
        }
        var ne = this.ne.query(c);
        var nw = this.nw.query(c);
        var se = this.se.query(c);
        var sw = this.sw.query(c);
        return __spreadArrays(points, ne, nw, se, sw);
    };
    QuadTree.prototype.draw = function (p) {
        var _a = this.bounds, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        p.noFill();
        p.stroke(200);
        p.rectMode(p.CORNER);
        p.rect(x, y, w, h);
        if (this.divided) {
            this.ne.draw(p);
            this.nw.draw(p);
            this.se.draw(p);
            this.sw.draw(p);
        }
    };
    return QuadTree;
}());
var sketch = function (p) {
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    var points = [];
    var qtree;
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        qtree = new QuadTree(new Rect(0, 0, p.width, p.height), 5);
        for (var i = 0; i < 100; i++) {
            var x = p.random(0, p.width);
            var y = p.random(0, p.height);
            var pt = { x: x, y: y };
            points.push(pt);
            qtree.insert(pt);
        }
    };
    p.draw = function () {
        p.background(0);
        p.fill(200);
        p.noStroke();
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var pt = points_1[_i];
            p.ellipse(pt.x, pt.y, 8, 8);
        }
        qtree.draw(p);
        var r = new Rect(p.mouseX - 150, p.mouseY - 40, 300, 180);
        var highlight = qtree.query(r);
        p.stroke(0, 222, 160, 160);
        p.fill(0, 200, 140, 180);
        for (var _a = 0, highlight_1 = highlight; _a < highlight_1.length; _a++) {
            var pt = highlight_1[_a];
            p.ellipse(pt.x, pt.y, 12, 12);
        }
        p.rectMode(p.CENTER);
        p.noFill();
        p.stroke(0, 200, 120, 100);
        p.strokeWeight(2);
        p.rect(r.midX, r.midY, r.w, r.h);
    };
    p.mouseMoved = function () {
    };
    p.mouseDragged = function () {
        console.log("pressed: ", p.mouseIsPressed);
        if (!p.mouseIsPressed) {
            return;
        }
        var pt = { x: p.mouseX, y: p.mouseY };
        points.push(pt);
        qtree.insert(pt);
    };
};
new p5(sketch);
//# sourceMappingURL=build.js.map
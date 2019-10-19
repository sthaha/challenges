var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var boids = 200;
var BoidRadius = 8;
var nearBy = BoidRadius * 5;
var MinSeperation = BoidRadius * 3;
var MaxForce = 2.0;
var MaxSpeed = 8;
var showRadius = false;
var Boid = (function () {
    function Boid(p) {
        this.p = p;
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(p.random(2, MaxSpeed));
        this.accel = p.createVector();
        this.speed = MaxSpeed;
    }
    Boid.prototype.draw = function () {
        var _a = this, p = _a.p, pos = _a.pos, neighbours = _a.neighbours;
        p.noStroke();
        if (showRadius) {
            p.fill(130, 130, 210, 50 + 140 * 1 / (neighbours.length + 1));
            p.ellipse(pos.x, pos.y, nearBy + BoidRadius, nearBy + BoidRadius);
        }
        p.fill(20, 140, 220, 200);
        p.ellipse(pos.x, pos.y, BoidRadius, BoidRadius);
    };
    Boid.prototype.align = function () {
        var _a = this, neighbours = _a.neighbours, velocity = _a.velocity, speed = _a.speed, p = _a.p;
        var steer = p.createVector();
        if (neighbours.length == 0) {
            return steer;
        }
        for (var _i = 0, neighbours_1 = neighbours; _i < neighbours_1.length; _i++) {
            var b = neighbours_1[_i];
            steer.add(b.velocity);
        }
        steer.div(neighbours.length);
        steer.sub(velocity);
        steer.setMag(speed);
        steer.limit(MaxForce);
        return steer;
    };
    Boid.prototype.cohesion = function () {
        var _a = this, neighbours = _a.neighbours, pos = _a.pos, speed = _a.speed, velocity = _a.velocity, p = _a.p;
        var steer = p.createVector();
        if (neighbours.length == 0) {
            return steer;
        }
        for (var _i = 0, neighbours_2 = neighbours; _i < neighbours_2.length; _i++) {
            var b = neighbours_2[_i];
            steer.add(b.pos);
        }
        steer.div(neighbours.length);
        steer.sub(pos);
        steer.sub(velocity);
        steer.setMag(speed);
        steer.limit(MaxForce);
        return steer;
    };
    Boid.prototype.seperation = function () {
        var _a = this, pos = _a.pos, speed = _a.speed, velocity = _a.velocity, neighbours = _a.neighbours, p = _a.p;
        var steer = p.createVector();
        if (neighbours.length == 0) {
            return steer;
        }
        var inRange = 0;
        for (var _i = 0, neighbours_3 = neighbours; _i < neighbours_3.length; _i++) {
            var b = neighbours_3[_i];
            var dist_1 = pos.dist(b.pos);
            if (dist_1 > MinSeperation || dist_1 === 0) {
                continue;
            }
            var sepForce = p5.Vector.sub(pos, b.pos);
            sepForce.div(dist_1);
            steer.add(sepForce);
            inRange++;
        }
        steer.div(p.max(inRange, 1));
        steer.setMag(speed);
        steer.limit(MaxForce);
        return steer;
    };
    Boid.prototype.update = function (flock) {
        var _this = this;
        var _a = this, pos = _a.pos, velocity = _a.velocity, p = _a.p;
        this.neighbours = flock.filter(function (x) { return x != _this && pos.dist(x.pos) <= nearBy; });
        var accel = p.createVector();
        var sep = this.seperation();
        accel.add(sep);
        var cohesion = this.cohesion();
        accel.add(cohesion);
        var steer = this.align();
        accel.add(steer);
        accel.limit(MaxForce);
        velocity.add(accel);
        velocity.limit(MaxSpeed);
        pos.add(velocity);
        this.wrap();
    };
    Boid.prototype.wrap = function () {
        var pos = this.pos;
        if (pos.x < 0) {
            pos.x = this.p.width;
        }
        if (pos.y < 0) {
            pos.y = this.p.height;
        }
        if (pos.x > this.p.width) {
            pos.x = 0;
        }
        if (pos.y > this.p.height) {
            pos.y = 0;
        }
    };
    return Boid;
}());
var sketch = function (p) {
    var flock = [];
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (var i = 0; i < boids; i++) {
            flock.push(new Boid(p));
        }
    };
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = function () {
        p.background(0);
        p.fill(0);
        var snapshot = __spreadArrays(flock);
        for (var _i = 0, flock_1 = flock; _i < flock_1.length; _i++) {
            var f = flock_1[_i];
            f.update(snapshot);
            f.draw();
        }
    };
};
new p5(sketch);
//# sourceMappingURL=build.js.map
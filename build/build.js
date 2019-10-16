var boids = 50;
var nearBy = 80;
var MaxForce = 0.95;
var MaxSpeed = 7;
var Boid = (function () {
    function Boid(p) {
        this.p = p;
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(p.random(2, 5));
        this.accel = p.createVector();
        this.speed = MaxSpeed;
    }
    Boid.prototype.draw = function () {
        var _a = this, p = _a.p, pos = _a.pos, neighbours = _a.neighbours;
        p.noStroke();
        p.fill(130, 130, 210, 50 + 140 * 1 / (neighbours.length + 1));
        p.ellipse(pos.x, pos.y, nearBy + 16, nearBy + 16);
        p.fill(160);
        p.ellipse(pos.x, pos.y, 16, 16);
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
        steer.setMag(speed);
        steer.sub(velocity);
        steer.limit(MaxForce);
        return steer;
    };
    Boid.prototype.update = function (flock) {
        var _this = this;
        var _a = this, pos = _a.pos, velocity = _a.velocity, accel = _a.accel, p = _a.p;
        this.neighbours = flock.filter(function (x) { return x != _this && pos.dist(x.pos) <= nearBy; });
        var cohesion = this.cohesion();
        this.accel = cohesion;
        pos.add(velocity);
        velocity.add(accel);
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
        for (var _i = 0, flock_1 = flock; _i < flock_1.length; _i++) {
            var f = flock_1[_i];
            f.update(flock);
            f.draw();
        }
    };
};
new p5(sketch);
//# sourceMappingURL=build.js.map
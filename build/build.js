var rose = function (p) {
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.angleMode(p.DEGREES);
    };
    var n = 3;
    var d = 29;
    p.draw = function () {
        p.background(0);
        p.translate(p.width / 2, p.height / 2);
        p.stroke(200);
        p.strokeWeight(1);
        p.noFill();
        p.beginShape();
        for (var i = 0; i < 360; i++) {
            var k = i * d;
            var r = p.sin(n * k) * 250;
            var x = p.cos(k) * r;
            var y = p.sin(k) * r;
            p.vertex(x, y);
        }
        p.endShape(p.CLOSE);
        p.stroke(200, 100, 122, 200);
        p.strokeWeight(3);
        p.beginShape();
        for (var i = 0; i < 360; i++) {
            var k = i;
            var r = p.sin(n * k) * 250;
            var x = p.cos(k) * r;
            var y = p.sin(k) * r;
            p.vertex(x, y);
        }
        p.endShape();
    };
};
new p5(rose);
//# sourceMappingURL=build.js.map
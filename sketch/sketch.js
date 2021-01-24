var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var neighbours = function (index, rows, cols) {
    var row = index[0], col = index[1];
    var n = [
        [row, col - 1],
        [row, col + 1],
        [row - 1, col],
        [row + 1, col],
    ].filter(function (_a) {
        var r = _a[0], c = _a[1];
        return r >= 0 && r < rows && c >= 0 && c < cols;
    });
    return n;
};
var validate = function (grid) {
    //neighbours(0, rows, cols)
    var rows = grid.length;
    var cols = grid[0].length;
    //console.groupCollapsed()
    //console.log("grid", rows, cols)
    for (var r = 0; r < rows; r++) {
        var _loop_1 = function (c) {
            //console.log("check", r,c, ": ", neighbours([r, c], rows, cols).join(" | "), )
            var current = grid[r][c];
            var matches = neighbours([r, c], rows, cols).some(function (_a) {
                var nr = _a[0], nc = _a[1];
                return grid[nr][nc] == current;
            });
            if (!matches) {
                return { value: false };
            }
        };
        for (var c = 0; c < cols; c++) {
            var state_1 = _loop_1(c);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    //console.groupEnd()
    return true;
};
// const sketch = (p : p5) =>  {
var grid = [
    [0, 0, 0],
    [0, 0, 0],
];
var rows = grid.length;
var cols = grid[0].length;
var count = 0;
for (var n = 0; n < Math.pow(2, rows * cols); n++) {
    var bin = n.toString(2).split("").map(function (x) { return parseInt(x); });
    var padded = __spreadArrays(Array(rows * cols - bin.length).fill(0), bin);
    //console.log("bin: ", padded, padded.slice(3), padded.slice(0, 3))
    grid[0] = padded.slice(0, cols);
    grid[1] = padded.slice(cols);
    if (validate(grid)) {
        count++;
        // console.log(count, " | pattern: ", padded.join(""), " > ", n)
        console.log(count, " | pattern: ");
        console.log("     ", grid[0].map(function (x) { return x == 0 ? "g" : "b"; }).join(""));
        console.log("     ", grid[1].map(function (x) { return x == 0 ? "g" : "b"; }).join(""));
    }
}
console.log("valid grids are", count);
// }
// new p5(sketch)

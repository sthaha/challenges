const puzzle = `
   -----------
   .---d-----.
   .invention.
   .mass oe  .
   .   ind   .
   .   gne   .
   .   night .
   magic     .
   -----------
`;
const words = [
    "invention",
    "sing",
    "mass",
    "design",
];
class Board {
    constructor(p, table) {
        this.border = 50;
        this.cell = 50;
        this.location = {};
        this.marked = {};
        this.dirty = true;
        this.p = p;
        this.table = table;
        this.rows = table.length;
        this.cols = table[0].length;
        this.createIndex();
    }
    createIndex() {
        this.location = {};
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const ch = this.table[r][c];
                this.location[ch] = this.location[ch] || [];
                this.location[ch] = [...this.location[ch], { row: r, col: c }];
            }
        }
    }
    at(row, col) {
        return this.table[row][col];
    }
    mark(row, col) {
        this.marked[row] = this.marked[row] || {};
        this.marked[row][col] = true;
    }
    draw() {
        if (!this.dirty) {
            return;
        }
        this.dirty = false;
        this.drawCells();
        this.drawMarked();
        this.drawLetters();
    }
    get left() { return this.border; }
    get top() { return this.border; }
    get height() { return this.rows * this.cell; }
    get width() { return this.cols * this.cell; }
    get dr() { return this.height / this.rows; }
    get dc() { return this.width / this.cols; }
    reveal(word) {
        let x = word[0];
        if (!(x in this.location)) {
            console.log(x, "not in index");
            return;
        }
        for (let i = 0, hits = this.location[x]; i < hits.length; i++) {
            console.log("x: ", x, "hits:", hits);
            let c = hits[i];
            let dirs = this.dirForLetter(c, word[1]);
            console.log("dirs:", dirs);
            for (let d of dirs) {
                console.log("    exploring from:", c.row, c.col, " in  dir:", d.row, d.col);
                let cells = this.wordFrom(c, d, word);
                if (cells) {
                    console.log("found word", word);
                    cells.forEach(x => this.mark(x.row, x.col));
                    return;
                }
            }
        }
    }
    wordFrom(x, dir, word) {
        const len = word.length;
        const end = { row: x.row + dir.row * (len - 1), col: x.col + dir.col * (len - 1) };
        console.log("  ending ... :", end.row, end.col);
        if (end.row < 0 || end.row >= this.rows ||
            end.col < 0 || end.col >= this.cols) {
            console.log(" ... out of bound ", end);
            return "";
        }
        if (this.at(end.row, end.col) != word[len - 1]) {
            console.log("  last index does not match");
            return "";
        }
        let found = [];
        for (let i = 0; i < len; i++) {
            const row = x.row + dir.row * i;
            const col = x.col + dir.col * i;
            const ch = this.at(row, col);
            if (word[i] != ch) {
                console.log("    at:(", row, col, ") is not ", word[i]);
                return [];
            }
            found.push({ row, col });
        }
        return found;
    }
    dirForLetter(x, target) {
        let all = [
            { row: x.row - 1, col: x.col - 1 },
            { row: x.row - 1, col: x.col },
            { row: x.row - 1, col: x.col + 1 },
            { row: x.row, col: x.col - 1 },
            { row: x.row, col: x.col + 1 },
            { row: x.row + 1, col: x.col - 1 },
            { row: x.row + 1, col: x.col },
            { row: x.row + 1, col: x.col + 1 },
        ];
        return all.filter(c => c.row >= 0 && c.row <= this.rows &&
            c.col >= 0 && c.col <= this.cols &&
            this.at(c.row, c.col) == target).map(c => ({ row: c.row - x.row, col: c.col - x.col }));
    }
    drawLetters() {
        const { p, left, top, dr, dc, cell } = this;
        p.fill(0);
        p.stroke(0);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * dc + left + cell / 2.5;
                const y = r * dr + top + cell / 1.85;
                p.text(this.at(r, c).toUpperCase(), x, y);
            }
        }
    }
    drawMarked() {
        const { p, left, top, dr, dc, cell } = this;
        p.fill(0, 200, 0);
        for (let r = 0; r < this.rows; r++) {
            if (!this.marked[r]) {
                continue;
            }
            for (let c = 0; c < this.cols; c++) {
                if (!this.marked[r][c]) {
                    continue;
                }
                const x = c * dc + left;
                const y = r * dr + top;
                p.rect(x, y, cell, cell);
            }
        }
        p.noFill();
    }
    drawCells() {
        const { p, left, top, height, width, dr, dc } = this;
        p.stroke(200, 100, 200);
        p.rect(top, left, width, height);
        p.stroke(0);
        for (let r = 1; r < this.rows; r++) {
            const y = top + r * dr;
            p.line(left, y, left + width, y);
        }
        for (let c = 1; c < this.cols; c++) {
            const x = left + c * dc;
            p.line(x, top, x, top + height);
        }
    }
}
const wordfinder = (p) => {
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    const table = puzzle
        .split("\n")
        .map(x => x.trim())
        .filter(x => x.length > 0);
    console.table(table);
    let board = new Board(p, table);
    words.forEach(w => board.reveal(w));
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noLoop();
    };
    p.draw = () => { board.draw(); };
    p.mousePressed = () => { };
};
const p = new p5(wordfinder);
//# sourceMappingURL=build.js.map
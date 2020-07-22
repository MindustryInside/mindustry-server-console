class Generator {
    constructor(array) {
        this.array = array;
        this.pos = 0;
    }

    next() {
        if (this.pos + 1 > this.array.length) this.pos = 0;
        this.pos += 1;
        return this.array[this.pos - 1];
    }
}

module.exports = Generator;

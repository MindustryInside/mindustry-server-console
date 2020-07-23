/**
 * Generator class; Used for getting next element in the array.
 */
class Generator {
    constructor(array) {
        this.array = array;
        this.pos = 0;
    }

    /**
     * Get next element in the array.
     * @returns {*} - Element in the array.s
     */
    next() {
        if (this.pos + 1 > this.array.length) this.pos = 0;
        this.pos += 1;
        return this.array[this.pos - 1];
    }
}

module.exports = Generator;

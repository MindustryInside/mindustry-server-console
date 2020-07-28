/**
 * Generator class; Used for getting next element in the array.
 */
class Generator {
    /**
     * Generator.
     * @param {Array<*>} array - Array used for generator.
     * @param {number} [start] - Number to start generate from.
     */
    constructor(array, start = 0) {
        this.array = array;
        this.pos = start;
    }

    /**
     * Get next element in the array.
     * @returns {*} - Element in the array.
     */
    next() {
        if (this.pos + 1 > this.array.length) this.pos = 0;
        this.pos += 1;
        return this.array[this.pos - 1];
    }
}

module.exports = Generator;

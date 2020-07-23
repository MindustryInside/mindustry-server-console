const colors = require('../colors.json');
const Generator = require('../utils/generator');

/**
 * Class for operating with console colors.
 */
class ColorSwitcher {
    /**
     * Color switcher.
     * @param {string} defaultColor - Default console color.
     */
    constructor(defaultColor = 'red') {
        this.colors = colors;
        this.currentColor = localStorage.getItem('menu-color') || defaultColor;
        this.generator = new Generator(Object.keys(this.colors));

        this.update();
    }

    /**
     * Update console color.
     */
    update() {
        document.documentElement.style.setProperty('--main-menu-color', this.getColor());
        localStorage.setItem('menu-color', this.currentColor);
    }

    /**
     * Set console color.
     * @param {string} color - Color to be set.
     */
    setColor(color) {
        this.currentColor = color;
        this.update();
    }

    /**
     * Get current console color.
     * @returns {string} - Color in hex format.
     */
    getColor() {
        return this.colors[this.currentColor];
    }

    /**
     * Switch to the next color.
     */
    nextColor() {
        this.setColor(this.generator.next());
    }
}

module.exports = ColorSwitcher;

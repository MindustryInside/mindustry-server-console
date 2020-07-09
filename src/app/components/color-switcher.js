const colors = require('../colors.json');
const Generator = require('../utils/generator');

class ColorSwitcher {
    constructor(defaultColor = 'red') {
        this.scrollbarStyleElement = document.createElement('style');
        this.colors = colors;
        this.currentColor = localStorage.getItem('menu-color') || defaultColor;
        this.generator = new Generator(Object.keys(this.colors));

        this.setup();
    }

    setup() {
        this.update();
        document.head.appendChild(this.scrollbarStyleElement);
    }

    update() {
        document.documentElement.style.setProperty('--main-menu-color', this.getColor());
        this.setScrollbarColor(this.getColor());

        localStorage.setItem('menu-color', this.currentColor);
    }

    setColor(color) {
        this.currentColor = color;
        this.update();
    }

    getColor() {
        return this.colors[this.currentColor];
    }

    nextColor() {
        this.setColor(this.generator.next());
    }

    setScrollbarColor(color) {
        this.scrollbarStyleElement.innerText = `::-webkit-scrollbar-thumb {background: ${color};`;
    }
}

module.exports = ColorSwitcher;

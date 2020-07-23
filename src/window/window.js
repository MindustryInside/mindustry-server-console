const Console = require('./components/console/console');

// Main point to the renderer process.
document.addEventListener('DOMContentLoaded', () => {
    // Load custom HTML elements.
    require('./custom-elements/gear-icon/gear-icon');

    /**
     * Class for operating with renderer side.
     * @type {Console}
     */
    window.ConsoleControl = new Console();
});

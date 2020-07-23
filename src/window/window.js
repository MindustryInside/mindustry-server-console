const Console = require('./components/console/console');

// Main point to the renderer process.
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Class for operating with renderer side.
     * @type {Console}
     */
    window.ConsoleControl = new Console();
});

const Console = require('./components/console');

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Class for operating with renderer side.
     * @type {Console}
     */
    window.ConsoleControl = new Console();
});

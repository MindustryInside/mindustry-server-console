/**
 * Class for operating with console keybinds.
 */
class Keybinds {
    /**
     * Keybinds.
     */
    constructor() {
        this.binds = {};
        this.ctrlBinds = {};

        document.addEventListener('keydown', (event) => {
            const { key, ctrlKey } = event;

            if (this.binds[key]) {
                this.binds[key]();
            } else if (ctrlKey && this.ctrlBinds[key]) {
                this.ctrlBinds[key]();
            }
         });
    }

    /**
     * Add keybind.
     * @param {string} key - Keyboard key.
     * @param {function} listener - Listener for button clicked.
     */
    add(key, listener) {
        this.binds[key] = listener;
    }

    /**
     * Add keybind with Control (Command on Mac) key.
     * @param {string} key - Keyboard key.
     * @param {function} listener - Listener for button clicked.
     */
    addCtrl(key, listener) {
        this.ctrlBinds[key] = listener;
    }
}

module.exports = Keybinds;

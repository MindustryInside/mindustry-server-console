class Keybinds {
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

    add(key, listener) {
        this.binds[key] = listener;
    }

    addCtrl(key, listener) {
        this.ctrlBinds[key] = listener;
    }
}

module.exports = Keybinds;

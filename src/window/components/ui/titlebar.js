const { getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

/**
 * Titlebar buttons class.
 */
class Titlebar {
    /**
     * Titlebar.
     */
    constructor() {
        this.buttons = Array.from(document.getElementsByClassName('titlebar-button'));

        this.closeBtn = document.getElementById('close');
        this.maximizeBtn = document.getElementById('maximize');
        this.minimizeBtn = document.getElementById('minimize');

        this.set();
    }

    /**
     * Set titlebar buttons.
     */
    set() {
        this.buttons.forEach((button) => {
            button.addEventListener('mouseover', () => button.classList.add('titlebar-button-hover'));
            button.addEventListener('mouseleave', () => button.classList.remove('titlebar-button-hover'));
            button.addEventListener('click', () => button.classList.remove('titlebar-button-hover'));
        });

        this.closeBtn.addEventListener('click', () => ipcRenderer.send('exit'));

        this.maximizeBtn.addEventListener('click', () => {
            if (getCurrentWindow().isMaximized()) {
                getCurrentWindow().unmaximize();
            } else if (getCurrentWindow().isFullScreen()) {
                getCurrentWindow().setFullScreen(false);
            } else {
                getCurrentWindow().maximize();
            }
        });

        this.minimizeBtn.addEventListener('click', () => getCurrentWindow().minimize());
    }
}

module.exports = Titlebar;

const Console = require('./components/console');

document.addEventListener('DOMContentLoaded', () => {
    const console = new Console();

    class ConsoleControl {
        static getPlayersSize() {
            return console.getPlayers().length;
        }

        static setColor(color) {
            console.setColor(color);
        }

        static setLang(language) {
            console.setLang(language);
        }
    }

    window.ConsoleControl = ConsoleControl;
});

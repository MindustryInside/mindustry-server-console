const { app, ipcMain } = require('electron');
const Server = require('./server');
const ServerWindow = require('./server-window');

/**
 * Main app class.
 */
class ServerApplication {
    /**
     * Start point to an app.
     * @param options - Configuration options file.
     * @param options.rendererPath - Path to main .html file.
     * @param options.serverPath - Path to Mindustry server folder.
     */
    static open(options) {
        if (this.opened) throw new Error('App cannot be opened twice!');

        this.opened = true;
        this.serverWindow = new ServerWindow(options);
        this.server = new Server(options);

        ipcMain.on('exit', this.exit);
    }

    /**
     * Exit app.
     */
    static exit() {
        app.quit();
    }
}

module.exports = ServerApplication;

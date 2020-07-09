const { app, ipcMain } = require('electron');
const Server = require('./server');
const ServerWindow = require('./server-window');
const StartupTime = require('../startup-time');

class ServerApplication {
    static open(options) {
        if (this.opened) throw new Error('App cannot be opened twice!');

        this.opened = true;
        this.serverWindow = new ServerWindow(options);
        this.server = new Server(options);

        ipcMain.on('exit', this.exit);
    }

    static exit() {
        console.log(`Timestamp: ${StartupTime.getTimestamp()}s`);
        app.quit();
    }
}

module.exports = ServerApplication;

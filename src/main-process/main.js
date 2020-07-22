const path = require('path');
const { app, dialog } = require('electron');
const ServerApplication = require('./server-application');
const errorHandler = require('../error-handler');
const parseCommandLine = require('../parse-command-line');

process.on('unhandledRejection', errorHandler);
process.on('uncaughtException', errorHandler);

const options = parseCommandLine(process.argv);
options.rendererPath = path.join(__dirname, '..', 'window', 'window.html');
options.serverPath = options.dev
    ? path.join(__dirname, '..', '..', 'server')
    : path.join(__dirname, '..', '..', '..', 'server');

app.allowRendererProcessReuse = true;

app.once('ready', () => {
    try {
        if (!process.env.JAVA_HOME) {
            showJavaError().then(app.quit);
        } else {
            ServerApplication.open(options);
        }
    } catch (error) {
        errorHandler(error);
    }
});

function showJavaError() {
    return dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'No Java Found',
        detail: 'For Mindustry server you need to install Java.',
    });
}

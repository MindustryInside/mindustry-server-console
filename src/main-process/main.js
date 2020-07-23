const { app, dialog } = require('electron');
const path = require('path');
const ServerApplication = require('./server-application');
const errorHandler = require('./utils/error-handler');
const parseCommandLine = require('./utils/parse-command-line');

// Handle every error.
process.on('unhandledRejection', errorHandler);
process.on('uncaughtException', errorHandler);

const options = parseCommandLine(process.argv);
options.rendererPath = path.join(__dirname, '..', 'window', 'window.html');
options.serverPath = options.dev
    ? path.join(__dirname, '..', '..', 'server')
    : path.join(__dirname, '..', '..', '..', 'server');

// Remove deprecated warning.
app.allowRendererProcessReuse = true;

// Once app is ready start console.
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

/**
 * Throw an error on the absence of Java.
 * @returns {Promise<Electron.MessageBoxReturnValue>} - Promise with button clicked.
 */
function showJavaError() {
    return dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'No Java Found',
        detail: 'For Mindustry server you need to install Java.',
    });
}

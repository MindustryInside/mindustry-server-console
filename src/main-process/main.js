const path = require('path');
const { app } = require('electron');
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
        ServerApplication.open(options);
    } catch (error) {
        errorHandler(error);
    }
});

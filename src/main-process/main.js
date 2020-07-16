const path = require('path');
const { app } = require('electron');
const ServerApplication = require('./server-application');
const errorHandler = require('../error-handler');
const parseCommandLine = require('../parse-command-line');

process.on('unhandledRejection', errorHandler);
process.on('uncaughtException', errorHandler);

const options = parseCommandLine(process.argv);
options.resourcePath = path.resolve();
options.serverPath = path.resolve(options.resourcePath, 'server');

app.allowRendererProcessReuse = true;

app.once('ready', () => {
    try {
        ServerApplication.open(options);
    } catch (error) {
        errorHandler(error);
    }
});

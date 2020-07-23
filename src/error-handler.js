/**
 * Handle any server-side error.
 * @param {Error} error - Error to be handled.
 */
function errorHandler(error) {
    if (error.message != null) {
        console.log(error.message);
    }

    if (error.stack != null) {
        console.log(error.stack);
    }

    process.exit();
}

module.exports = errorHandler;

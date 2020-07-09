module.exports = (error) => {
    if (error.message != null) {
        console.log(error.message);
    }

    if (error.stack != null) {
        console.log(error.stack);
    }

    process.exit();
};

let startupTime;

module.exports = {
    set() {
        startupTime = new Date();
    },

    getTimestamp() {
        const now = new Date();
        const nowSeconds = now.getSeconds()
            + now.getMinutes() * 60
            + now.getHours() * 3600;

        const startupSeconds = startupTime.getSeconds()
            + startupTime.getMinutes() * 60
            + startupTime.getHours() * 3600;

        return nowSeconds - startupSeconds;
    },
};

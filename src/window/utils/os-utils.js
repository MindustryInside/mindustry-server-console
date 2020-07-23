const os = require('os');

/**
 * Get a CPU usage percent.
 * @returns {Promise<number>} - Percent.
 */
function cpuUsagePercent() {
    return new Promise((resolve) => {
        const cpus = os.cpus();

        let startTotal = 0;
        let startIdle = 0;
        cpus.forEach((cpu) => {
            Object.keys(cpu.times).forEach((type) => {
                startTotal += cpu.times[type];
            });

            startIdle += cpu.times.idle;
        });

        setTimeout(() => {
            const cpus2 = os.cpus();

            let endTotal = 0;
            let endIdle = 0;
            cpus2.forEach((cpu) => {
                Object.keys(cpu.times).forEach((type) => {
                    endTotal += cpu.times[type];
                });

                endIdle += cpu.times.idle;
            });

            const totalDiff = endTotal - startTotal;
            const idleDiff = endIdle - startIdle;
            const percent = Math.round((100 - 100 * (idleDiff / totalDiff)) * 10) / 10;

            resolve(percent);
        }, 1000);
    });
}

/**
 * Get a RAM usage percent.
 * @returns {Promise<number>} - Percent.
 */
function ramUsagePercent() {
    return new Promise((resolve) => {
        resolve(Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100));
    });
}

module.exports = { cpuUsagePercent, ramUsagePercent };

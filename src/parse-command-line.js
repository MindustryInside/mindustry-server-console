module.exports = (argv) => {
    const result = {};

    const args = argv.slice(2);
    for (let i = 0; i < args.length; i++) {
        const value = args[i];
        if (value.startsWith('--')) {
            if (args[i + 1] && !args[i + 1].startsWith('--')) {
                result[value.split('').splice(2).join('')] = args[i + 1];
            } else {
                result[value.split('').splice(2).join('')] = true;
            }
        }
    }

    return result;
};

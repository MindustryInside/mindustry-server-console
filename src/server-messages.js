module.exports = {
    playerConnected: (str) => / connected\./.test(str),
    playerDisconnected: (str) => / \(closed\)/.test(str),
};

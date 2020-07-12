module.exports = {
    playerJoin: (str) => / connected\./.test(str),
    playerLeave: (str) => / \(closed\)/.test(str),
};

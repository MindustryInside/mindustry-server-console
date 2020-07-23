/**
 * An object of server message testers.
 * @type {{}}
 */
const serverMessages = {
    playerJoin: (str) => / connected\./.test(str),
    playerLeave: (str) => / \(closed\)/.test(str),
};

module.exports = serverMessages;

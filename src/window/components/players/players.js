const { ipcRenderer } = require('electron');
const parseName = require('../../utils/color-parser');

/**
 * Class for operating with players bar.
 */
class Players {
    /**
     * Players.
     */
    constructor() {
        this.playersElement = document.getElementById('console-players');
        this.players = new Set();

        this.handleEvents();
    }

    /**
     * Handle player join and player leave events.
     */
    handleEvents() {
        ipcRenderer.on('playerJoin', (event, args) => {
            this.handleJoin(args);
        });

        ipcRenderer.on('playerLeave', (event, args) => {
            this.handleLeave(args);
        });
    }

    /**
     * Handle player join.
     * @param {string} playerName - Name of joined player.
     */
    handleJoin(playerName) {
        const parsedName = parseName(playerName);
        this.players.add(parsedName);

        this.updatePlayers();
    }

    /**
     * Handle player leave.
     * @param {string} playerName - Name of leaved player.
     */
    handleLeave(playerName) {
        const parsedName = parseName(playerName);
        this.players.delete(parsedName);

        this.updatePlayers();
    }

    /**
     * Sync array with players bar.
     */
    updatePlayers() {
        const allPlayers = [];
        this.players.forEach((player) => allPlayers.push(player));

        this.playersElement.innerHTML = allPlayers.join(' ');
    }
}

module.exports = Players;

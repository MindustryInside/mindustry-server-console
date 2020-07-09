const { ipcRenderer } = require('electron');
const parseName = require('../utils/color-parser');

class Players {
    constructor() {
        this.playersElement = document.getElementById('console-players');
        this.players = new Set();

        this.handleEvents();
    }

    handleEvents() {
        ipcRenderer.on('playerConnect', (event, args) => {
            this.handleConnect(args);
        });

        ipcRenderer.on('playerDisconnect', (event, args) => {
            this.handleDisconnect(args);
        });
    }

    handleConnect(playerName) {
        const parsedName = parseName(playerName);
        this.players.add(parsedName);

        this.updatePlayers();
    }

    handleDisconnect(playerName) {
        const parsedName = parseName(playerName);
        this.players.delete(parsedName);

        this.updatePlayers();
    }

    updatePlayers() {
        const allPlayers = [];
        this.players.forEach((player) => allPlayers.push(player));

        this.playersElement.innerHTML = allPlayers.join(' ');
    }
}

module.exports = Players;

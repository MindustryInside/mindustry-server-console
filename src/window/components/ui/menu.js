const { ipcRenderer } = require('electron');
const { cpuUsagePercent, ramUsagePercent } = require('../../utils/os-utils');

/**
 * Menu / Statistics class.
 */
class Menu {
    /**
     * Menu.
     */
    constructor() {
        this.cpuRotateElement = document.getElementById('cpu-rotate');
        this.cpuValueElement = document.getElementById('cpu-value');
        this.ramRotateElement = document.getElementById('ram-rotate');
        this.ramValueElement = document.getElementById('ram-value');

        this.playersValue = document.getElementById('menu-info-players-value');
        this.mapsValue = document.getElementById('menu-info-maps-value');
        this.modsValue = document.getElementById('menu-info-mods-value');
        this.pluginsValue = document.getElementById('menu-info-plugins-value');

        this.hostButton = document.getElementById('menu-host');
        this.stopButton = document.getElementById('menu-stop');
        this.breakButton = document.getElementById('menu-break');
        this.folderButton = document.getElementById('menu-server-folder');

        this.setup();
        setInterval(() => this.update(), 1000);
    }

    /**
     * Setup menu.
     */
    setup() {
        this.update();
        this.setupInfo();
        this.hostButton.addEventListener('click', () => ipcRenderer.send('command', 'host'));
        this.stopButton.addEventListener('click', () => ipcRenderer.send('command', 'stop'));
        this.breakButton.addEventListener('click', () => ipcRenderer.send('exit'));
        this.folderButton.addEventListener('click', () => ipcRenderer.send('openFolder'));
    }

    /**
     * Setup statistics info.
     */
    setupInfo() {
        // TODO: Rewrite
        ipcRenderer.on('playerJoin', () => this.setPlayers(parseInt(this.playersValue.innerText, 10) + 1));
        ipcRenderer.on('playerLeave', () => this.setPlayers(parseInt(this.playersValue.innerText, 10) - 1));
    }

    /**
     * Async menu update.
     * @returns {Promise<void>} - Promise returned from async function call.
     */
    async update() {
        this.setCpuUsage(await cpuUsagePercent());
        this.setRamUsage(await ramUsagePercent());

        // Get custom maps + 12 default
        this.setMaps(ipcRenderer.sendSync('maps').length + 12);

        // TODO: Plugins are not supported
        const mods = ipcRenderer.sendSync('mods').length;
        this.setMods(mods);
        this.setPlugins(mods);
    }

    /**
     * Set RAM bar usage percent.
     * @param {number} value - Percent.
     */
    setRamUsage(value) {
        this.ramValueElement.innerHTML = `${value}%<br>RAM`;
        this.ramRotateElement.style.transform = `rotate(${45 + value * 1.8}deg)`;
    }

    /**
     * Set CPU bar usage percent.
     * @param {number} value - Percent.
     */
    setCpuUsage(value) {
        this.cpuValueElement.innerHTML = `${value}%<br>CPU`;
        this.cpuRotateElement.style.transform = `rotate(${45 + value * 1.8}deg)`;
    }

    /**
     * Set players value.
     * @param {number} value - Number of players.
     */
    setPlayers(value) {
        this.playersValue.innerText = value.toString();
    }

    /**
     * Set maps value.
     * @param {number} value - Number of maps.
     */
    setMaps(value) {
        this.mapsValue.innerText = value.toString();
    }

    /**
     * Set mods value.
     * @param {number} value - Number of mods.
     */
    setMods(value) {
        this.modsValue.innerText = value.toString();
    }

    /**
     * Set plugins value.
     * @param {number} value - Number of plugins.
     */
    setPlugins(value) {
        this.pluginsValue.innerText = value.toString();
    }
}

module.exports = Menu;

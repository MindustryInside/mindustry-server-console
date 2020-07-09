const { ipcRenderer } = require('electron');
const { cpuUsagePercent, ramUsagePercent } = require('../utils/os-utils');

class Menu {
    constructor() {
        this.cpuRotateElement = document.getElementById('cpu-rotate');
        this.cpuValueElement = document.getElementById('cpu-value');
        this.ramRotateElement = document.getElementById('ram-rotate');
        this.ramValueElement = document.getElementById('ram-value');

        this.hostButton = document.getElementById('menu-host');
        this.stopButton = document.getElementById('menu-stop');
        this.breakButton = document.getElementById('menu-break');
        this.folderButton = document.getElementById('menu-server-folder');

        this.setup();
        setInterval(() => this.update(), 1000);
    }

    setup() {
        this.update();
        this.hostButton.addEventListener('click', () => ipcRenderer.send('command', 'host'));
        this.stopButton.addEventListener('click', () => ipcRenderer.send('command', 'stop'));
        this.breakButton.addEventListener('click', () => ipcRenderer.send('exit'));
        this.folderButton.addEventListener('click', () => ipcRenderer.send('openFolder'));
    }

    async update() {
        this.setCpuUsage(await cpuUsagePercent());
        this.setRamUsage(ramUsagePercent());
    }

    setRamUsage(value) {
        this.ramValueElement.innerHTML = `${value}%<br>RAM`;
        this.ramRotateElement.style.transform = `rotate(${45 + value * 1.8}deg)`;
    }

    setCpuUsage(value) {
        this.cpuValueElement.innerHTML = `${value}%<br>CPU`;
        this.cpuRotateElement.style.transform = `rotate(${45 + value * 1.8}deg)`;
    }
}

module.exports = Menu;

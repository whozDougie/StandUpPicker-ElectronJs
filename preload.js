// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path');
const url = require('url');
const isWin = process.platform === "win32";

//https://github.com/AlexTorresSk/custom-electron-titlebar
const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
    var titlebar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#3f487e'),
        icon: url.format(path.join(__dirname, '/images', '/icon.png')),
        maximizable: false,
        shadow: isWin,
        titleHorizontalAlignment: 'center',
        menu: null,
        // menuPosition: 'left',
        unfocusEffect: false,
    });    

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})
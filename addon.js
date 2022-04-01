// ==UserScript==
// @name         Prosperous Universe Screens & Materials
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Prosperous Universe enhancements.
// @author       Manderius
// @match        https://apex.prosperousuniverse.com/
// @icon         https://www.google.com/s2/favicons?domain=prosperousuniverse.com
// @grant        none
// @require      https://raw.githubusercontent.com/Manderius/PrUn_UI_Library/main/ui_lib.js
// @downloadURL  https://raw.githubusercontent.com/Manderius/PrUn_Addon/main/addon.js
// @updateURL    https://raw.githubusercontent.com/Manderius/PrUn_Addon/main/addon.js
// ==/UserScript==

// Add exceptions that you don't want to be expanded
// If you want to exclude screens named "Base 5" and "Private", write them in lowercase like this:
// const exceptions = [ 'base 5', 'private' ];
const exceptions = [];

// Set your exchange code for MAT buttons
const exchange = 'AI1';

function addCXButtons(buffer) {
    const matId = buffer.command[1];
    const ticker = `${matId}.${exchange}`;
    const open = (command) => {
        UI.showBuffer(command);
    };
    buffer.addQuickButton("CXOB", ticker, "Order Book", () => open(`CXOB ${ticker}`));
    buffer.addQuickButton("CXPC", ticker, "Price Chart", () => open(`CXPC ${ticker}`));
    buffer.addQuickButton("CXPO", ticker, "Place Order", () => open(`CXPO ${ticker}`));
}

function addScreensToTop() {
    const changeUrl = (url) => {
        window.location = url;
    }

    UI.getScreens().forEach(screen => {
        UI.TOP_BAR.addButton(screen.Name, () => changeUrl(screen.Link));
    });
}

(function () {
    'use strict';
    UI.onApexLoaded(addScreensToTop);
    UI.onBufferCreated('MAT', addCXButtons);
})();

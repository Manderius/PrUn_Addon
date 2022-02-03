// ==UserScript==
// @name         Prosperous Universe
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Prosperous Universe enhancements.
// @author       Manderius
// @match        https://apex.prosperousuniverse.com/
// @icon         https://www.google.com/s2/favicons?domain=prosperousuniverse.com
// @grant        none
// @downloadURL  https://github.com/Manderius/PrUn_Addon/main/addon.js
// @updateURL    https://github.com/Manderius/PrUn_Addon/main/addon.js
// ==/UserScript==

// Add exceptions that you don't want to be expanded
// If you want all screens, use the following line instead:
// const exceptions = [];
const exceptions = ['finances'];

function showScreensInTopBar() {
    var navbar = document.getElementById('TOUR_TARGET_SCREEN_CONTROLS');
    var navbarItemClassList = navbar.children[2].classList;
    var nbitMainCL = navbar.children[2].children[0].classList;
    var nbitUnderlineCL = navbar.children[2].children[1].classList;
    var menuUl = navbar.children[1].children[1];
    var links = [];
    menuUl.childNodes.forEach((cn) => links.push({ 'Name': cn.children[1].innerHTML, 'Link': cn.children[1].href }));
    for (var link of links) {
        if (exceptions.includes(link.Name.toLowerCase())) continue;
        var div = document.createElement('div');
        div.classList = navbarItemClassList;
        var aelem = document.createElement('a');
        aelem.classList = nbitMainCL;
        aelem.style.color = 'inherit';
        aelem.innerHTML = link.Name;
        aelem.href = link.Link;
        div.appendChild(aelem);
        var line = document.createElement('div');
        line.classList = nbitUnderlineCL;
        div.appendChild(line);
        navbar.appendChild(div);
    }
}

(function () {
    'use strict';
    setTimeout(showScreensInTopBar, 4000);
})();

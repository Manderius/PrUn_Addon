// ==UserScript==
// @name         Prosperous Universe Screens & Materials
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Prosperous Universe enhancements.
// @author       Manderius
// @match        https://apex.prosperousuniverse.com/
// @icon         https://www.google.com/s2/favicons?domain=prosperousuniverse.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Manderius/PrUn_Addon/main/addon.js
// @updateURL    https://raw.githubusercontent.com/Manderius/PrUn_Addon/main/addon.js
// ==/UserScript==

// Add exceptions that you don't want to be expanded
// If you want to exclude screens named "Base 5" and "Private", write them in lowercase like this:
// const exceptions = [ 'base 5', 'private' ];
const exceptions = [];

// Set your exchange code for MAT buttons
const exchange = 'AI1';


function showScreensInTopBar() {
    var navbar = document.getElementById('TOUR_TARGET_SCREEN_CONTROLS');
    var navbarItemClassList = navbar.children[2].classList;
    var nbitMainCL = navbar.children[2].children[0].classList;
    var nbitUnderlineCL = navbar.children[2].children[1].classList;
    var menuUl = navbar.children[1].children[1];
    var links = [];
    menuUl.childNodes.forEach((cn) => {if (cn.children.length == 3) links.push({ 'Name': cn.children[1].innerHTML, 'Link': cn.children[1].href })});
    for (var link of links) {
        if (exceptions.includes(link.Name.toLowerCase())) continue;
        var button = `<div class="${navbarItemClassList}">
                          <a class="${nbitMainCL}" style="color: inherit" href="${link.Link}">${link.Name}</a>
                          <div class="${nbitUnderlineCL}"></div>
                      </div>`;
        navbar.appendChild(createNode(button));
    }
}

function createNode(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function createQuickRowButton(shortTextBold, shortTextNormal, longText, command) {
    const template = `<div class="_38ZndITVgwaKPL7o6Nn0EM _33A_5lETf4HBqwJi_q-jhZ _3dW9W1Qi1zDylwVf7nNSih">
                          <span><span class="_1afHq-np-jxmsbFE64yu4f">{{:shortBold}}</span>
                              {{:shortNormal}}</span><span class="_1_V43bWTfSSXMFIzsgIWFM">: {{:longText}}
                          </span>
                     </div>`;
    let result = template.replace("{{:shortBold}}", shortTextBold)
                         .replace("{{:shortNormal}}", shortTextNormal)
                         .replace("{{:longText}}", longText);
    let node = createNode(result);
    node.onclick = () => { showBuffer(command); };
    return node;
}

function createCXButtons(container) {
    container = container.parentElement;
    const matCmd = container.children[0].children[1].innerHTML;
    const matCmdArr = matCmd.split(" ");
    if (matCmdArr[0].toUpperCase() !== "MAT") return;
    const matId = matCmdArr[1];
    const row = createNode(`<div class="_3ZAsQKEW4Uf1rMb_vcJ9ix"></div>`);
    const matEx = `${matId}.${exchange}`;
    row.appendChild(createQuickRowButton("CXOB", matEx, "Order Book", `CXOB ${matEx}` ));
    row.appendChild(createQuickRowButton("CXPC", matEx, "Price Chart", `CXPC ${matEx}` ));
    row.appendChild(createQuickRowButton("CXPO", matEx, "Place Order", `CXPO ${matEx}` ));
    container.insertBefore(row, container.children[1]);
}

function changeValue(input, value){
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(input, value);

    var inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
}

function showBuffer(command) {
    const addSubmitCommand = (input, cmd) => {
        changeValue(input, cmd);
        input.parentElement.parentElement.requestSubmit();
    }

    // Watch for future buffer creation
    monitorOnElementCreated("._3pBmt8VeO58Hr71J67G8di", (elem) => addSubmitCommand(elem, command));

    // Create new Buffer
    document.getElementById('TOUR_TARGET_BUTTON_BUFFER_NEW').click();
}

function monitorOnElementCreated(selector, callback, onlyOnce = true) {
    const getElementsFromNodes = (nodes) => Array.from(nodes).flatMap(node => node.nodeType === 3 ? null : Array.from(node.querySelectorAll(selector))).filter(item => item !== null);
    let onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                console.log(mutation.addedNodes)
                console.log(Array.from(mutation.addedNodes))
                var elements = getElementsFromNodes(mutation.addedNodes);
                console.log(elements)
                for (var i = 0, len = elements.length; i < len; i++) {
                    callback(elements[i]);
                    if (onlyOnce) observer.disconnect();
                }
            }
        });
    };

    let containerSelector = 'body';
    let target = document.querySelector(containerSelector);
    let config = { childList: true, subtree: true };
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer = new MutationObserver(onMutationsObserved);
    observer.observe(target, config);
}

function setupMaterialBufferWatch() {
    const insideFrameSelector = '._2hmv3gsrf-d-M4ys0LxDQT';
    monitorOnElementCreated(insideFrameSelector, createCXButtons, false);
}

function waitForApexLoad() {
    const setup = () => {
        showScreensInTopBar();
        setupMaterialBufferWatch();
    }

    const selector = '#TOUR_TARGET_BUTTON_BUFFER_NEW';
    monitorOnElementCreated(selector, setup)
}

(function () {
    'use strict';
    waitForApexLoad();
})();

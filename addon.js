// ==UserScript==
// @name         Prosperous Universe Screens & Materials
// @namespace    http://tampermonkey.net/
// @version      0.5
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
    menuUl.childNodes.forEach((cn) => {if (cn.children.length == 4) links.push({ 'Name': cn.children[1].innerHTML, 'Link': cn.children[1].href })});
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
    const template = `<div class="MApcsYEd7+wqIJTfbHP1yA== fTT52i+1oFauxHOjVfGTww== kWTH1-HkYCWeYyDRgZ7ozQ==">
                          <span><span class="D+GJhIGmC2eFk59dvrY+Sg==">{{:shortBold}}</span>
                              {{:shortNormal}}</span><span class="cKqzEDeyKbzb9nPry0Dkfw==">: {{:longText}}
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
    const row = createNode(`<div class="oZS0zPcv8BY8OKGjLs2R-Q=="></div>`);
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
    monitorOnElementCreated(".UoOoh9EGx7YihezkSGeV2Q\\=\\=", (elem) => addSubmitCommand(elem, command));

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
    const insideFrameSelector = '.N32GL8CJBOw3-rNx0PBZkQ\\=\\=';
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

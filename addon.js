// ==UserScript==
// @name         Prosperous Universe Screens & Materials
// @namespace    http://tampermonkey.net/
// @version      0.7
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

function drag(element) {
    var sourceCoordinates = element.getBoundingClientRect();
    var mouseDownEvent = createEvent(
        "mousedown",
        {
            clientX: sourceCoordinates.left,
            clientY: sourceCoordinates.top
        }
    );

    element.dispatchEvent(mouseDownEvent);

    /* simulate a drag start event on the source element */
    var dragStartEvent = createEvent(
        "dragstart",
        {
            clientX: sourceCoordinates.left,
            clientY: sourceCoordinates.top,
            dataTransfer: { data: {} }
        }
    );

    element.dispatchEvent(dragStartEvent);

    /* simulate a drag event on the source element */
    var dragEvent = createEvent(
        "drag",
        {
            clientX: sourceCoordinates.left,
            clientY: sourceCoordinates.top
        }
    );

    element.dispatchEvent(dragEvent);

    var dragEnterEvent = createEvent(
        "dragenter",
        {
            clientX: sourceCoordinates.left + 1,
            clientY: sourceCoordinates.top + 1,
            dataTransfer: dragStartEvent.dataTransfer
        }
    );

    element.dispatchEvent(dragEnterEvent);
    return dragStartEvent;
}

function drop(dragStartEvent, source, target) {
    var targetCoordinates = target.getBoundingClientRect();

    /* simulate a drag over event on the target element */
    var dragOverEvent = createEvent(
        "dragover",
        {
            clientX: targetCoordinates.left,
            clientY: targetCoordinates.top,
            dataTransfer: dragStartEvent.dataTransfer
        }
    );

    target.dispatchEvent(dragOverEvent);

    /* simulate a drop event on the target element */
    var dropEvent = createEvent(
        "drop",
        {
            clientX: targetCoordinates.left,
            clientY: targetCoordinates.top,
            dataTransfer: dragStartEvent.dataTransfer
        }
    );

    target.dispatchEvent(dropEvent);

    /* simulate a drag end event on the source element */
    var dragEndEvent = createEvent(
        "dragend",
        {
            clientX: targetCoordinates.left,
            clientY: targetCoordinates.top,
            dataTransfer: dragStartEvent.dataTransfer
        }
    );

    source.dispatchEvent(dragEndEvent);

    /* simulate a mouseup event on the target element */
    var mouseUpEvent = createEvent(
        "mouseup",
        {
            clientX: targetCoordinates.left,
            clientY: targetCoordinates.top
        }
    );

    target.dispatchEvent(mouseUpEvent);

}

function transferItem(element, targetInv) {
    var event = drag(element);
    var searchAllExpr = './/div[contains(text(), "ALL")]';
    var dest = document.evaluate(searchAllExpr, targetInv, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    drop(event, element, dest);
}

// Transfer items with Array.from(sourceCont.children).forEach(c => transferItem(c.children[0], targetInv))

function createYellowButton(text, style, onClick) {
    const result = `<button class="kgGsDNvDoWj61w4I7VAlfA== fMW62cERnlzxZPFhnlPOeQ==" style="${style}">${text}</button>`;
    let node = createNode(result);
    node.onclick = onClick;
    return node;
}

function getItemsInInventory(inventory) {
    const itemSelector = ".A-Re0xb\\+rkw3eNvxj3pMDA\\=\\=";
    return inventory.querySelectorAll(itemSelector);
}

function showTransferOverlays(sourceInventory, onCancelled, onTransferCompleted) {
    const bufferCmd = (buffer) => buffer.children[0].children[1].innerHTML.toLowerCase();
    const allBuffers = document.querySelectorAll("._2ELYlP31j95Y98WT6zodUQ\\=\\=");
    const invCommands = ["shpi", "inv"];
    const invBuffers = Array.from(allBuffers).filter(bfr => invCommands.includes(bufferCmd(bfr).split(" ")[0]));
    const otherInvs = invBuffers.filter(bfr => bfr !== sourceInventory);
    const sourceItems = getItemsInInventory(sourceInventory);
    const firstItem = sourceItems[0];
    const dragEvent = drag(firstItem);
    const validTargetInventories = [];
    const invalidTargetInventories = [];
    otherInvs.forEach(inv => {
        var searchAllExpr = './/div[contains(text(), "ALL")]';
        var dest = document.evaluate(searchAllExpr, inv, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (dest !== null) validTargetInventories.push(inv);
        else invalidTargetInventories.push(inv);
    });
    let overlays = [];
    const doTransfer = (dest) => {
        overlays.forEach(ov => ov.remove());
        overlays = [];
        transferItem(firstItem, dest);
        if (onTransferCompleted) onTransferCompleted();
    }

    const cancelTransfer = () => {
        overlays.forEach(ov => ov.remove());
        overlays = [];
        if (onCancelled) onCancelled();
    }

    const addOverlay = (inv, type, text, callback) => {
        const overlay = createOverlay(type, text, callback);
        overlays.push(overlay);
        inv.querySelector(".yGwmD9uu1MbRn5W-LIz3ug\\=\\=").appendChild(overlay);
    }

    validTargetInventories.forEach(inv => addOverlay(inv, "OK", "Click to transfer", doTransfer));
    invalidTargetInventories.forEach(inv => addOverlay(inv, "ERROR", "Invalid target", cancelTransfer));

    drop(dragEvent, firstItem, firstItem);

    return cancelTransfer;
}

function createOverlay(type, text, onClick) {
    let style = "";
    let innerStyle = "";
    if (type === 'OK') {
        style = "background-color: rgb(166 240 78 / 30%); background-image: repeating-linear-gradient(-45deg, transparent, transparent 25px, rgb(170 240 78 / 50%) 25px, rgb(141 240 78 / 50%) 48px);";
        innerStyle = "color: #72a940; border: 1px solid #72a940;"
    }
    else {
        style = "background-color: rgb(240 127 78 / 30%); background-image: repeating-linear-gradient(-45deg, transparent, transparent 25px, rgb(240 78 78 / 50%) 25px, rgb(240 78 78 / 50%) 48px);";
        innerStyle = "color: #d9534f; border: 1px solid #d9534f;"
    }
    const template = `<div style="${style} position: absolute; width: 100%; height: 100%; z-index: 100" class="g7qBrJDwt4QZY\+mWdamyVw\=\=">
                        <div style="display: flex; flex-direction: row; justify-content: space-evenly;">
                            <div style="${innerStyle} padding: 0px 10px; background-color: rgb(38 53 62); text-transform: uppercase; text-align: center; line-height: 45px;">${text}</div>
                        </div>
                    </div>`;
    let node = createNode(template);
    node.onclick = onClick;
    return node;
}

function addTransferButtonToInventory(inventory) {
    const onCancelTransfer = (button) => {
        button.onclick = doTransfer;
        button.innerHTML = 'Transfer all'; 
    }

    const doTransfer = (event) => {
        if (getItemsInInventory(inventory).length == 0) return;
        const doCancel = showTransferOverlays(inventory, () => {onCancelTransfer(event.target)}, () => {onCancelTransfer(event.target)});
        event.target.onclick = doCancel;
        event.target.innerHTML = 'Cancel transfer';
    }
    const transferButton = createYellowButton("Transfer all", "position: absolute; right: 10px; top: 10px;", doTransfer);
    const invSpaceXPath = './/div[@class="yGwmD9uu1MbRn5W-LIz3ug=="]';
    const dest = document.evaluate(invSpaceXPath, inventory, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    dest.appendChild(transferButton);
}

function createEvent(eventName, options) {
    var event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventName, true, true, null);

    event.view = window;
    event.detail = 0;
    event.ctlrKey = false;
    event.altKey = false;
    event.shiftKey = false;
    event.metaKey = false;
    event.button = 0;
    event.relatedTarget = null;

    /* if the clientX and clientY options are specified,
        also calculated the desired screenX and screenY values */
    if(options.clientX && options.clientY) {
        event.screenX = window.screenX + options.clientX;
        event.screenY = window.screenY + options.clientY;
    }

    /* copy the rest of the options into
        the event object */
    for (var prop in options) {
        event[prop] = options[prop];
    }

    return event;
}

function monitorOnElementCreated(selector, callback, onlyOnce = true) {
    const getElementsFromNodes = (nodes) => Array.from(nodes).flatMap(node => node.nodeType === 3 ? null : Array.from(node.querySelectorAll(selector))).filter(item => item !== null);
    let onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                var elements = getElementsFromNodes(mutation.addedNodes);
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

function setupInventoryBufferWatch() {
    const checkAddButtonToInventory = (element) => {
        const bfr = element.parentElement;
        const bufferCmd = (buffer) => buffer.children[0].children[1].innerHTML.toLowerCase();
        const invCommands = ["shpi", "inv"];
        if (invCommands.includes(bufferCmd(bfr).split(" ")[0])) {
            addTransferButtonToInventory(bfr);
        }
    }

    const insideFrameSelector = '.N32GL8CJBOw3-rNx0PBZkQ\\=\\=';
    monitorOnElementCreated(insideFrameSelector, checkAddButtonToInventory, false);
}

function waitForApexLoad() {
    const setup = () => {
        showScreensInTopBar();
        setupMaterialBufferWatch();
        setupInventoryBufferWatch();
    }

    const selector = '#TOUR_TARGET_BUTTON_BUFFER_NEW';
    monitorOnElementCreated(selector, setup)
}

(function () {
    'use strict';
    waitForApexLoad();
})();

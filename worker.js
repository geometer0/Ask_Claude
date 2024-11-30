chrome.runtime.onInstalled.addListener(function () {
        chrome.contextMenus.create({
                title: "Ask Claude",
                contexts: ['selection'],
                id: 'selection'
        });
})
      
chrome.contextMenus.onClicked.addListener((info,tab) => {
        chrome.tabs.sendMessage(tab.id, {
                type: 'contextClick',
                selectionText: info.selectionText
        });
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
        if (message.type == 'createPopup') { 
                const popupWindow = createPopup(message);
        }
});

function createPopup(message) {
        //console.log("validate coords: ",top,left)
        chrome.windows.create({
                url: 'popup.html',
                focused: true,
                type: "popup",
                width: 400,
                height: 400,
                top: Math.floor(message.coords.top + 5),
                left: Math.floor(message.coords.left - 200)
        });
};
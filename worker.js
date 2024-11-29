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
      
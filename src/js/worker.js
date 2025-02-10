chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: "Ask Claude",
        contexts: ["selection"],
        id: "selection",
    });
});

chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => window.getSelection().toString(),
    });
    chrome.tabs.sendMessage(tab.id, {
        type: "contextClick",
        selectionText: result,
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
        type: "contextClick",
        selectionText: info.selectionText,
    });
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === "createPopup") {
        (async () => {
            try {
                await createPopup(message);
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }
});

async function createPopup(message) {
    try {
        await chrome.windows.create({
            url: "/dist/popup.html",
            focused: true,
            type: "popup",
            width: 400,
            height: 400,
            top: Math.floor(message.coords.top + 150),
            left: Math.floor(message.coords.left - 150),
        });
    } catch (error) {
        console.error("Error creating popup:", error);
        throw error;
    }
}

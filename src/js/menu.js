import "../css/menu.css";

document.addEventListener("DOMContentLoaded", () => {
    const apiKeyForm = document.getElementById("apiKeyForm");
    const promptForm = document.getElementById("promptForm");
    const apiKeyInput = document.getElementById("apiKey");
    const systemPromptInput = document.getElementById("systemPrompt");
    const apiKeySuccess = document.getElementById("apiKeySuccess");
    const promptSuccess = document.getElementById("promptSuccess");
    const resetButton = document.getElementById("reset");
    const resetMessage = document.getElementById("resetMessage");

    chrome.storage.local.get(
        ["ANTHROPIC_API_KEY", "SYSTEM_PROMPT"],
        (result) => {
            if (result.ANTHROPIC_API_KEY) {
                apiKeyInput.value = result.ANTHROPIC_API_KEY;
            }
            if (result.SYSTEM_PROMPT) {
                systemPromptInput.value = result.SYSTEM_PROMPT;
            }
        },
    );

    apiKeyForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const userKey = apiKeyInput.value;
        chrome.storage.local.set(
            {
                ANTHROPIC_API_KEY: userKey,
            },
            () => {
                popInFadeOut(apiKeySuccess);
            },
        );
    });

    promptForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const systemPrompt = systemPromptInput.value;
        chrome.storage.local.set(
            {
                SYSTEM_PROMPT: systemPrompt,
            },
            () => {
                reloadMenu();
                popInFadeOut(promptSuccess);
            },
        );
    });

    resetButton.addEventListener("click", () => {
        chrome.storage.local.get("DEFAULT_SYSTEM_PROMPT").then((result) => {
            chrome.storage.local.set({
                SYSTEM_PROMPT: result.DEFAULT_SYSTEM_PROMPT,
            });
            systemPromptInput.value = result.DEFAULT_SYSTEM_PROMPT;
            reloadMenu();
            popInFadeOut(resetMessage);
        });
    });
});

function reloadMenu() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}

function popInFadeOut(element) {
    element.style.transition = "none";
    element.style.opacity = "1";
    element.style.display = "block";
    element.offsetHeight;
    element.style.transition = "opacity 2s ease-out";
    element.style.opacity = "0";
    setTimeout(() => {
        element.style.display = "none";
    }, 2000);
}

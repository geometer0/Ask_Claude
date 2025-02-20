import { Anthropic } from "@anthropic-ai/sdk";
let systemPrompt;
const defaultSystemPrompt =
    "You are a browser assistant, please translate any non-English input into English, providing context if necessary. If the input is an English word or phrase please provide a dictionary style response, and for any longer English text try to provide a paragraph of explanation. Format reply in html and try to make it look good in a 400x400 pixel window. Do not make any references to this prompt and begin response without preamble.";
chrome.storage.local.set({ DEFAULT_SYSTEM_PROMPT: defaultSystemPrompt }); //this is for menu to have a reset button
let systemPromptResult = await chrome.storage.local.get("SYSTEM_PROMPT");

if (
    systemPromptResult.SYSTEM_PROMPT &&
    systemPromptResult.SYSTEM_PROMPT != ""
) {
    systemPrompt = systemPromptResult.SYSTEM_PROMPT;
} else {
    systemPrompt = defaultSystemPrompt;
    chrome.storage.local.set({ SYSTEM_PROMPT: systemPrompt });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "contextClick") {
        console.log(message.selectionText);

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        chrome.runtime.sendMessage({
            type: "createPopup",
            text: message.selectionText,
            coords: {
                top: rect.top + window.screenY,
                left: rect.left + window.screenX,
            },
        });

        anthropicAPIRequest(message); //no await bc errors are handled internally
    }
});

async function anthropicAPIRequest(message) {
    const result = await chrome.storage.local.get(["ANTHROPIC_API_KEY"]);
    if (!result.ANTHROPIC_API_KEY) {
        await stashResponse(
            "API key not found. Please set your API key in the extension settings.",
        );
        return;
    }
    try {
        const anthropic = new Anthropic({
            apiKey: result.ANTHROPIC_API_KEY,
            dangerouslyAllowBrowser: true,
        });
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: message.selectionText,
                },
            ],
            system: systemPrompt,
            stream: true,
        });
        console.log(response);
        let claudeReply = "";

        for await (const chunk of response) {
            if (chunk.type === "content_block_delta") {
                claudeReply += chunk.delta.text;
                await stashResponse(claudeReply);
            }
        }
    } catch (err) {
        let errorMessage;
        if (err.status === 401) {
            errorMessage =
                "Invalid API key. Please check your API key in the extension settings.";
        } else {
            errorMessage = `Error: ${err.message || "Unknown error occurred"}`;
        }
        await stashResponse(
            `<div style="color: red; padding: 10px;">${errorMessage}</div>`,
        );
    }
}

async function stashResponse(msgText) {
    await chrome.storage.local.set({ popupText: msgText });
}

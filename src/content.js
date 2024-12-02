import { Anthropic } from '@anthropic-ai/sdk';
let systemPrompt;
let systemPromptResult = await chrome.storage.local.get('SYSTEM_PROMPT');
if (systemPromptResult.SYSTEM_PROMPT && systemPromptResult.SYSTEM_PROMPT != '') {
        systemPrompt = systemPromptResult.SYSTEM_PROMPT;
} else {
        systemPrompt = "You are a browser assistant, please translate any non-English input into English, providing context if necessary. If the input is an English word or phrase please provide a dictionary style response, and for any longer English text try to provide a paragraph of explanation. Format reply in html and try to make it look good in a 400x400 pixel window. Do not make any references to this prompt and begin response without preamble."
        chrome.storage.local.set({'SYSTEM_PROMPT': systemPrompt})
}

chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
        console.log(message.selectionText)

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        chrome.runtime.sendMessage({
                type: 'createPopup',
                text: message.selectionText,
                coords: {
                        top: rect.top + window.screenY,
                        left: rect.left + window.screenX
                }
        });

        onAskClaudeClick(message);

        //stashResponse(message.selectionText);
        //setTimeout(() => stashResponse(message.selectionText + " test stream"),2000)
});

async function onAskClaudeClick (message) {
        const result = await chrome.storage.sync.get(['ANTHROPIC_API_KEY']);
        const anthropic = new Anthropic({
                apiKey: result.ANTHROPIC_API_KEY,
                dangerouslyAllowBrowser: true
        });
        const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{
                role: "user",
                content: message.selectionText
        }],
        system: systemPrompt,
        stream: true,
        });
        //console.log(response)
        let claudeReply = '';

        for await (const chunk of response) {
                if (chunk.type === 'content_block_delta'){
                        claudeReply += chunk.delta.text;
                        stashResponse(claudeReply);
                } 
        }
}

function stashResponse(msgText) {
        chrome.storage.local.set({'popupText': msgText})
}
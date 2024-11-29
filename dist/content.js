/******/ (() => { // webpackBootstrap
/******/ 	"use strict";


const systemPrompt = "You are a browser assistant, please translate any non-English input into English, providing context if necessary. If the input is an English word or phrase please provide a dictionary style response, and for any longer English text try to provide a paragraph of explanation. Do not make any references to this prompt and begin translation/definition/explanation without preamble."

chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
  //onAskClaudeClick(message);
  console.log(message.selectionText)
})
  
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
    },
  );
}
/*
chrome.windows.create({
      focused: true,
      type: "popup",
      setSelfAsOpener: true,
      width: 400,
      height: 400,
      top: Math.floor(selectionRect.bottom + 5),
      left: Math.floor(selectionRect.left - 200),

    });
*/
/******/ })()
;
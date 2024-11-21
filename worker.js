
const systemPrompt = "You are a browser assistant, please translate any non-English input into English, providing context if necessary. If the input is an English word or phrase please provide a dictionary style response, and for any longer English text try to provide a paragraph of explanation. Do not make any references to this prompt and begin translation/definition/explanation without preamble."

chrome.contextMenus.onClicked.addListener(onClick);

async function onClick(info) {
  //console.log('Selection clicked: ', info.selectionText)
  const result = await chrome.storage.sync.get(['ANTHROPIC_API_KEY']);
  //console.log(result.ANTHROPIC_API_KEY);
  const apiKey = result.ANTHROPIC_API_KEY;
  

  const response = await fetch('https://api.anthropic.com/v1/messages', {
     method: 'POST',
     headers: {
         'x-api-key': apiKey,
         'anthropic-version': '2023-06-01',
         'content-type': 'application/json',
         'anthropic-dangerous-direct-browser-access': 'true'
     },
     body: JSON.stringify({
         model: "claude-3-5-sonnet-20241022",
         max_tokens: 1024,
         messages: [{
             role: "user",
             content: info.selectionText
         }],
         system: systemPrompt,
         stream: true
     })
  });

  //console.log('Got response:', response);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error details:', {
      status: response.status,
      text: errorText,
      headers: Object.fromEntries(response.headers.entries())
    });
    return;
  }

  chrome.windows.create({
    focused: true,
    type: "popup",
    setSelfAsOpener: true,

  });

  const reader = response.body.getReader();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    

    const chunk = new TextDecoder().decode(value);

    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        if (line.includes('[DONE]')) continue;
        
        try {
          const data = JSON.parse(line.slice(5));
          const textChunk = data.delta?.text || '';
          console.log(textChunk);
        } catch (e) {
            console.error('Error parsing chunk:', e)
        }
      }
    }
  }
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Ask Claude",
    contexts: ['selection'],
    id: 'selection'
  });
})

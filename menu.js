document.addEventListener('DOMContentLoaded', () => {
  const apiKeyForm = document.getElementById('apiKeyForm');
  const promptForm = document.getElementById('promptForm');
  const apiKeyInput = document.getElementById('apiKey');
  const systemPromptInput = document.getElementById('systemPrompt');
  const apiKeySuccess = document.getElementById('apiKeySuccess');
  const promptSuccess = document.getElementById('promptSuccess');
  
  chrome.storage.local.get(['ANTHROPIC_API_KEY', 'SYSTEM_PROMPT'], (result) => {
          if (result.ANTHROPIC_API_KEY) {
                  apiKeyInput.value = result.ANTHROPIC_API_KEY;
          }
          if (result.SYSTEM_PROMPT) {
                  systemPromptInput.value = result.SYSTEM_PROMPT;
          }
  });
  
  apiKeyForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const userKey = apiKeyInput.value;
          chrome.storage.local.set({
                  ANTHROPIC_API_KEY: userKey
          }, () => {
                  apiKeySuccess.style.display = 'block';
                  setTimeout(() => {
                          apiKeySuccess.style.display = 'none';
                  }, 3000);
          });
  });
  
  promptForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const systemPrompt = systemPromptInput.value;
          chrome.storage.local.set({
                  SYSTEM_PROMPT: systemPrompt
          }, () => {
                  promptSuccess.style.display = 'block';
                  setTimeout(() => {
                          promptSuccess.style.display = 'none';
                  }, 3000);
          });
  });
});
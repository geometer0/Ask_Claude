document.addEventListener('submit', () => {
  const userKey = document.querySelector('#apiKey').value;
  chrome.storage.sync.set({ ANTHROPIC_API_KEY: userKey})
})

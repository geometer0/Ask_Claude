document.addEventListener('DOMContentLoaded', () => {
    const responseDiv = document.getElementById('response');
    render(responseDiv);
    chrome.storage.onChanged.addListener(() => render(responseDiv));
});    

async function render(div){
    const result = await chrome.storage.local.get('popupText');
    div.innerHTML = result.popupText;
};
window.addEventListener('blur', () => {
    window.close();
  });
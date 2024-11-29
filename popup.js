document.addEventListener('DOMContentLoaded', () => {
    const responseDiv = document.getElementById('response');
    initText(responseDiv);
});    

async function initText(divName){
    const result = await chrome.storage.local.get('popupText');
    divName.textContent = result.popupText;
};
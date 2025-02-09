Google Chrome extension that uses Anthropic API calls to provide translation, definition, or explanation of highlighted text.

⚠️ Security Notice ⚠️
* This extension makes API calls directly from your browser, which requires a "dangerouslyAllowBrowser: true" flag
* Your API key is entered into the extension menu and stored in Chrome's local storage
* I am not fully aware of the security flaws of this, but if someone has access to Chrome on your machine they probably have access to your API key

TODO:

* Look into autobuild options, manual reloading is tiresome
* Make popup responsive to length of text
* Give menu more of a darkmode feel
* Give popup more of a darkmode feel
* Try removing the weird shadowboxes around each form field in menu
* Re-organize files into html, css, js folders

Ideas:

*Better prompt handling. Not sure how desireable it is to change prompt other than language instructions

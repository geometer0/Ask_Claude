Google Chrome extension that uses Anthropic API calls to provide translation, definition, or explanation of highlighted text.

⚠️ Security Notice ⚠️
* This extension makes API calls directly from your browser, which requires a "dangerouslyAllowBrowser: true" flag
* Your API key is entered into the extension menu and stored in Chrome's local storage
* I am not fully aware of the security flaws of this, but if someone has access to Chrome on your machine they probably have access to your API key

TODO:
* Make the popup more readable
* To this end, consider having Claude supply the html structure as part of each response
* Make the window not cover up highlighted text
* Budget debug mode - capture some good testable text throughputs to run without having to spam API calls
* Make the menu look better
* Add some error handling especially in API call where errors are likely


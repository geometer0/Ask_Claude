Google Chrome extension that uses Anthropic API calls to provide translation, definition, or explanation of highlighted text.

### Requires:
* Anthropic subscription
* Anthropic API key
* Google Chrome
* npm

### Installation

1. Download the project
2. In the project directory, run:
```
npm install
npm run build
```
3. Follow these instructions for [loading an unpacked Chrome extentension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)
4. Open the extension menu, paste in your Anthropic API key, and click 'Update API Key'.
5. Highlight text in browser and right click to get a menu option "Ask Claude".

### Development

As above, but use the following to take advantage of web extension hot reloading:
```
npm run watch
```

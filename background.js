import './scripts/text_selection.js'; //text processing
import './scripts/un_highlight.js'
import './scripts/darkmode.js'
import './scripts/plot_compute.js'

//receiving messages from popup.js and sending messages to trigger other scripts.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'runBackgroundjs') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {run: 'highlight_text'});
        });
        console.log('Backgorund script executed');
    }
    // else if (request.action === 'page_ready'){
    //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //         chrome.tabs.sendMessage(tabs[0].id, {dothis: 'plotter_ON'});
    //     });
    // }
    else if (request.action === 'unHighlight') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {dothis: 'un_highlight_text'});
        });
        console.log('Un-highlight script executed.');
    }
    else if (request.action === 'dark-mode'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {dothis: 'toggle_drk_mode'});
        });
        console.log('Toggle Dark mode script executed.')
    }
    else if (request.action === 'dark-mode-undo'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {dothis: 'toggle_drk_mode-off'});
        });
        console.log('Toggle Dark mode script executed.')
    }
});






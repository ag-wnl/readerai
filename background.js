// import './scripts/text_selection.js'; //text processing
// import './scripts/un_highlight.js'
// import './scripts/darkmode.js'
// import './scripts/plot_compute.js'

self.window = self;
importScripts('./jsrsasign-all-min.js')
importScripts('./scripts/text_selection.js')
importScripts('./scripts/un_highlight.js')
importScripts('./scripts/plot_compute.js')
importScripts('./scripts/plot_compute.js')


//receiving messages from popup.js and sending messages to trigger other scripts.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'runBackgroundjs') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {run: 'highlight_text'});
        });
        console.log('Backgorund script executed');
    }
    else if (request.action === 'unHighlight') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {dothis: 'un_highlight_text'});
        });
        console.log('Un-highlight script executed.');
    }
    else if (request.action === 'dark-mode'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.insertCSS({
                target: { tabId: tabs[0].id},
                files: ["dark_mode.css"]
            });
        });
        
    }
    else if (request.action === 'dark-mode-undo'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.removeCSS({
                target: { tabId: tabs[0].id },
                files: ["dark_mode.css"]
            });
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id:"1",
        title: "Add Note Marker",
        contexts: ["page"],
    });

    chrome.storage.local.set({"textAssist" : 1});
});


chrome.contextMenus.onClicked.addListener(function() {
    console.log('contextmenu clicked');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {add: 'note_marker'});
    });
});









self.window = self;
importScripts('./jsrsasign-all-min.js')
importScripts('./scripts/text_selection.js')
importScripts('./scripts/un_highlight.js')
importScripts('./scripts/plot_compute.js')
importScripts('./scripts/plot_compute.js')



function translate(source){
    const sourceText = source.toString();
  
    // var sourceText = 'garson';
    // var sourceLang = 'fr';
    // var targetLang = 'en';
    // console.log(sourceText);

    var url = "https://translate.google.so/translate_a/t?client=any_client_id_works&sl=auto&tl=en&q="+ encodeURI(sourceText) +"&tbb=1&ie=UTF-8&oe=UTF-8";
    
    // var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const res = data[0][0];
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {translated_text: res});
            });
            
            console.log(res);
    })
    .catch(error => console.error('Error fetching data:', error));
}


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
    }else if (request.translate){
        translate(request.translate);
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








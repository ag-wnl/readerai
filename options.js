

document.addEventListener('DOMContentLoaded', function() { 


    const text_assist = document.getElementById("textAssist_toggle");


    chrome.storage.local.get("textAssist", function(data) {
        if(data.textAssist === 1) {
            text_assist.checked = true;
        } else {
            text_assist.checked = false;
        }
    })

    text_assist.addEventListener('change', function() {
        if(text_assist.checked) {
            console.log("Text Assist enabled");
            chrome.storage.local.set({"textAssist" : 1});
        } else {
            console.log("Text Assist disabled");
            chrome.storage.local.set({"textAssist" : 0});
        }
    })

})

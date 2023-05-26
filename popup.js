console.log("Pop-up scripts are working")

let isToggled = false;
let isHighlightEnabled = false;

//sending message to background.js to execute needful after highlight button on popup clicked
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({action: 'page_ready'});

    const setting_highlight = document.getElementById('highlight_btn');
    const setting_text_assist = document.getElementById('assist_btn_popup');

    chrome.storage.sync.get(["settingHighlight", "setting_textAssist"], function(data) {
        if(data.settingHighlight){
            setting_highlight.style.backgroundColor = "cyan";
            setting_highlight.textContent = "Un-Highlight!";
            chrome.runtime.sendMessage({action: 'runBackgroundjs'});
        }else{
            setting_highlight.style.backgroundColor = "white";
            setting_highlight.textContent = "Highlight!";
            chrome.runtime.sendMessage({action: 'unHighlight'});
        }
    });

    var executeButton = document.getElementById('highlight_btn');
    executeButton.addEventListener('click', function() {
        const initialText = "Highlight!";

        if (executeButton.textContent === "Highlight!") {

            executeButton.textContent = 'Un-Highlight!';
            executeButton.style.backgroundColor = "cyan";

            const settings = {
                settingHighlight: true,
            };
            chrome.storage.sync.set(settings, function () {
                console.log("State saved:", settings);
            });
            chrome.runtime.sendMessage({action: 'runBackgroundjs'});
        
        }else{
            
            executeButton.textContent = initialText;
            executeButton.style.backgroundColor = "white";

            const settings = {
                settingHighlight: false,
            };
            chrome.storage.sync.set(settings, function () {
                console.log("State saved:", settings);
            });
            chrome.runtime.sendMessage({action: 'unHighlight'});
        } 

    });

    document.getElementById("dark_mode_toggle").addEventListener("click", function(){
        isToggled = !isToggled;
        if(isToggled){
            chrome.runtime.sendMessage({action : 'dark-mode'});
        }
        else{
            chrome.runtime.sendMessage({action : 'dark-mode-undo'});
        }
    })
});


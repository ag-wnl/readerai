console.log("Pop-up scripts are working")

let isToggled = false;

//sending message to background.js to execute needful after highlight button on popup clicked
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({action: 'page_ready'});

    var executeButton = document.getElementById('highlight_btn');
    executeButton.addEventListener('click', function() {
        const initialText = "Highlight!";
        if (executeButton.textContent === "Highlight!") {
            executeButton.textContent = 'Un-Highlight!';
            chrome.runtime.sendMessage({action: 'runBackgroundjs'});
        }else{
            executeButton.textContent = initialText;
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


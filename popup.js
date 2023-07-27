console.log("Pop-up scripts are working")

let isToggled = false;
let isHighlightEnabled = false;

document.addEventListener('DOMContentLoaded', function() {
    

    //Estimated Time Display
    var curr_tab_url = '';
    chrome.tabs.query({active:true,currentWindow:true},function(tab){

        //Be aware that `tab` is an array of Tabs 
        curr_tab_url = tab[0].url.toString();
        const query_url = 'rai_time' + curr_tab_url;
        console.log(query_url);

        chrome.storage.sync.get(query_url, function(val) {
            if(val[query_url]) {
                const time_display = val[query_url].toString();
                console.log(time_display);
                const time_wrapper = document.getElementById("read_time_display");
                time_wrapper.textContent = time_display;
            }
        })
    });


    const setting_highlight = document.getElementById('highlight_btn');
    const setting_text_assist = document.getElementById('assist_btn_popup');

    // Taking action according to user selected data saved in browser
    chrome.storage.sync.get(["settingHighlight", "setting_textAssist", "settingAssistButton"], function(data) {
        if(data.settingHighlight){
            setting_highlight.style.backgroundColor = "#FAF2FF";
            setting_highlight.textContent = "Un-Highlight!";
            chrome.runtime.sendMessage({action: 'runBackgroundjs'});
        }else{
            setting_highlight.style.backgroundColor = "white";
            setting_highlight.textContent = "Highlight!";
            chrome.runtime.sendMessage({action: 'unHighlight'});
        }
    });

    //defining button click action triggers
    var executeButton = document.getElementById('highlight_btn');
    executeButton.addEventListener('click', function() {
        const initialText = "Highlight!";

        if (executeButton.textContent === "Highlight!") {

            executeButton.textContent = 'Un-Highlight!';
            executeButton.style.backgroundColor = "#FAF2FF";

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
    
    const setting_button = document.getElementById("setting_svg");
    if(setting_button) {

        setting_button.addEventListener('click', function() {
            // chrome.runtime.sendMessage({openTab : 'setting-page'});
            console.log("setting button clicked.")

            const url = "options.html";
            const target = "_blank";
            window.open(url, target);
        });

    }

    //to toggle theme (dark/light) of the webpage
    document.getElementById("dark_mode_toggle").addEventListener("click", function(){
        isToggled = !isToggled;
        if(isToggled){
            chrome.runtime.sendMessage({action : 'dark-mode'});
        }
        else{
            chrome.runtime.sendMessage({action : 'dark-mode-undo'});
        }
    })

    const notes_page_btn = document.getElementById('notes_button');
    notes_page_btn.addEventListener('click', function() {
        window.open(chrome.runtime.getURL("notes_menu.html"));
    })


});


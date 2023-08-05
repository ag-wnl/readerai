console.log("Pop-up scripts are working")

let isToggled = false;
let isHighlightEnabled = false;


const click_sound_url = chrome.runtime.getURL("click_sound.mp3");
const click_sound = new Audio(click_sound_url);
// click_sound.play();
const signOut_btn = document.createElement('img');
signOut_btn.src = '/images/signed_in.png';
signOut_btn.style.height = '19px';
signOut_btn.style.width = '19px';
signOut_btn.style.cursor = 'pointer';
signOut_btn.style.marginTop = '4px';
signOut_btn.title = 'Click to Sign Out'

const REDIRECT_URI = 'https://hodnlalamlhhnadbmhgkddeoaookbmbg.chromiumapp.org';
// encodeURIComponent('https://hodnlalamlhhnadbmhgkddeoaookbmbg.chromiumapp.org');



document.addEventListener('DOMContentLoaded', function() {
    

    //Login Functionality:
    const login_btn = document.getElementById('login_btn');
    login_btn.addEventListener('click', function() {
        // signIn();
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            const user_token = token;
            console.log(user_token);
            chrome.storage.local.set({readerai_token : user_token}, () => {
                chrome.storage.local.set({SignedIn : 1});
                chrome.runtime.reload(); //reloads popup 
            });
        });
    })

    //When user Clicks to Sign Out:
    signOut_btn.addEventListener('click', function() {
        chrome.storage.local.remove('readerai_token', () => {
            console.log('User Logges Out.')
            chrome.storage.local.set({SignedIn : 0});
            chrome.runtime.reload(); //reloads popup
        })
    })
   
   
    chrome.storage.local.get('SignedIn', function(data) {
        if (data.SignedIn === 1) {
            login_btn.replaceWith(signOut_btn);
            // login_btn.title = 'Click to Sign Out';
        } else if (data.SignedIn === 0) {
            signOut_btn.replaceWith(login_btn);
        }
    });



    //Estimated Time Display
    var curr_tab_url = '';
    chrome.tabs.query({active:true,currentWindow:true},function(tab){

        //Be aware that `tab` is an array of Tabs 
        curr_tab_url = tab[0].url.toString();
        const query_url = 'rai_time' + curr_tab_url;

        chrome.storage.sync.get(query_url, function(val) {
            if(val[query_url]) {
                const time_display = val[query_url].toString();
                const time_wrapper = document.getElementById("read_time_display");
                time_wrapper.textContent = time_display;
            }
        })
        
        //Displaying number of markers in page:        
        var numberOfMarkers  = 0;
        const markers_query = 'readerai_url_' + curr_tab_url;
        
        chrome.storage.local.get(markers_query, function(data) {
            
            if(data.hasOwnProperty(markers_query)) {
                const val_array = data[markers_query];
                if(Array.isArray(val_array)) {
                    numberOfMarkers = val_array.length;
                    console.log(numberOfMarkers);
                    const markNumbers = document.getElementById('marker_number');
                    markNumbers.textContent = numberOfMarkers.toString();
                }
            }else {
                const markNumbers = document.getElementById('marker_number');
                markNumbers.textContent = '0';
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
        // click_sound.play();
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


    const curr_page_notes = document.getElementById('current_url_notes');
    curr_page_notes.addEventListener('click', function() {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentUrl = tabs[0].url;
            const pageURL = chrome.runtime.getURL('notes_menu.html');
            window.open(pageURL + '?url=' + currentUrl, '_blank');    
        });
        
    })


});


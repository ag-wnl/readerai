const paragraph = document.querySelector("p");
const bodycontent = document.querySelector("body");

// This section is for the reading time generator:

const {
    host, hostname, href, origin, pathname, port, protocol, search
} = window.location

//To Display Estimated Time:
function showTime() {
    if (bodycontent){
        const curr_url = window.location.href.toString();
        const time_url = 'rai_time' + curr_url;
        console.log(time_url);
        const text = bodycontent.textContent;
        const wordMatchRegExp = /[^\s]+/g; 
        const words = text.matchAll(wordMatchRegExp);
        const wordCount = [...words].length;
    
        const readingTime = Math.round(wordCount / 270).toString() + " minutes";
        chrome.storage.sync.set({[time_url] : readingTime});
    } 
}
showTime();


const font_link = document.createElement('link');
font_link.rel = 'stylesheet';
font_link.href = 'https://fonts.googleapis.com/css2?family=Inter&display=swap';
document.head.appendChild(font_link);

//Text-assist Button and all its funtions:
let prompt_text = "";
let output_text = "";

const dictionary_api = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function removeTextPrompt() {
    const text_prompt = document.getElementById("readerai_text_prompt");
    if(text_prompt) {
        text_prompt.remove();
    }
}

//Generation of the prompt box for queries
function promptGen(box_text, audio_play) {
    const boxx = document.createElement("div");
    boxx.id = "readerai_text_prompt";
    boxx.style.zIndex = "10000";
    boxx.style.width = "auto";
    boxx.style.maxWidth = "400px";
    boxx.style.height = "auto";
    boxx.style.padding = "10px";
    boxx.style.margin = "4px";
    boxx.style.backgroundColor = "white";
    boxx.style.color = "black";
    // boxx.style.fontFamily = '"Plus Jakarta Sans", sans-serif';
    boxx.style.fontFamily = "'Inter', sans-serif";
    boxx.style.borderRadius = "3px";
    boxx.style.border = "2px solid #e38fff"
    boxx.style.textDecoration = "none";
    boxx.style.position = "fixed";
    boxx.style.bottom = "5px";
    boxx.style.left = "5px";
    boxx.style.display = "flex";
    boxx.style.flexDirection = "column";
    boxx.style.gap = "5px";
    boxx.style.transition = "1s";
    boxx.style.boxShadow = "0 2px 4px darkslategray";

    const title_box = document.createElement("div");
    title_box.id = "readerai_textbox_title";
    title_box.textContent = "ReaderAI";
    title_box.style.fontFamily = "'Inter', sans-serif";
    title_box.style.fontSize = "16px";
    title_box.style.marginBottom = "8px";
    title_box.style.fontWeight = "bolder";

    const text_box = document.createElement("div");
    text_box.id = "text_content_prompt";
    text_box.style.fontSize = "12px";
    text_box.textContent = box_text;

    const close_button = document.createElement("button");
    close_button.textContent = "Close";
    close_button.style.backgroundColor = "#E5E4E2";
    close_button.style.color = "black";
    close_button.style.fontFamily = "'Inter', sans-serif";
    close_button.style.borderRadius = "3px";
    close_button.style.fontSize = "12px";
    close_button.style.borderWidth = "0px";
    close_button.style.padding = "4px";
    close_button.style.margin = "5px";
    close_button.style.cursor = "pointer";
    close_button.style.transition = "1s";
    close_button.style.boxShadow = "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset";

    const audio_btn = document.createElement("button");
    audio_btn.id = "readerai_audio";
    audio_btn.style.fontFamily = "'Inter', sans-serif";
    audio_btn.textContent = "Pronunciation";
    audio_btn.style.backgroundColor = "#E5E4E2";
    audio_btn.style.color = "black";
    audio_btn.style.fontSize = "12px";
    audio_btn.style.borderWidth = "0px";
    audio_btn.style.borderRadius = "3px";
    audio_btn.style.margin = "5px";
    audio_btn.style.cursor = "pointer";
    audio_btn.style.padding = "4px";
    audio_btn.style.transition = "1s";
    audio_btn.style.boxShadow = "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset";

    const button_div = document.createElement("div");
    button_div.style.display = "flex";
    button_div.style.flexDirection = "row";

    const audioPlayer = document.createElement("audio");
    audioPlayer.setAttribute("id", "audioPlayer");
    audioPlayer.setAttribute("src", `${audio_play}`);

    document.body.appendChild(boxx);
    const readerai_div = document.getElementById("readerai_text_prompt");
    readerai_div.appendChild(title_box);
    readerai_div.appendChild(text_box);

    if(audio_play != null) {
        button_div.appendChild(audio_btn);
        button_div.appendChild(audioPlayer);   
    }
    button_div.appendChild(close_button);
    readerai_div.appendChild(button_div);


    audio_btn.addEventListener("click", function() {
        audioPlayer.play();
        audio_btn.style.backgroundColor = "#FAF2FF";
    });
    audio_btn.addEventListener('mouseover', function() {
        audio_btn.style.backgroundColor = "#EDADFF";
    })
    audio_btn.addEventListener('mouseout', function() {
        audio_btn.style.backgroundColor = "#E5E4E2";
    })

    console.log("added text assist box!");


    close_button.addEventListener('mouseover', function() {
        close_button.style.backgroundColor = "#EDADFF";
    })
    close_button.addEventListener('mouseout', function() {
        close_button.style.backgroundColor = "#EEEEEE";
    })

    close_button.addEventListener('click', function() {
        removeTextPrompt();
        const rem_button = document.getElementById("readerai_text_assist_button");
        rem_button.style.visibility = "hidden";
    });
}

const wiki_api = "https://en.wikipedia.org/api/rest_v1/page/html/"; 
const wiki_summary = "https://en.wikipedia.org/api/rest_v1/page/summary/";

// Making the summary box 
async function SummaryBox (query_text) {
    const executable_query = query_text.replaceAll(/[.,;:-]/g, ' ');
    const filtered_query = executable_query.replaceAll(' ', '_');
    const api_url = wiki_summary + filtered_query;    
    try {
        const response = await fetch(api_url);
        const data = await response.json();

        const text_summary = data.extract;

        output_text = "Your Query : " + query_text + ": \n" + text_summary;
        console.log(output_text);
        if(text_summary === undefined){
            return;
        }
        
        promptGen(output_text, null);
        
    } catch (error) {
        console.log('Error', error);
    }
}

async function getDictionary(search_text) {
    const executable_query = search_text.replaceAll(/[.,;:-]/g, ' ')
    const api_url = dictionary_api + executable_query;
    try {
        const response = await fetch(api_url);
        const data = await response.json();

        const word = data[0].word;
        const means = data[0].meanings[0].definitions[0].definition;
        const phonetics_part = data[0].phonetics
        let word_audio = "";

        for(let i=0; i<phonetics_part.length; i++){
            if(phonetics_part[i].audio != ""){
                word_audio = phonetics_part[i].audio;
                break;
            }
        }

        output_text = "Word : " + word + ". \n" + means;
        console.log(output_text);
        if (word_audio != "") {
            promptGen(output_text, word_audio);
        }else {
            promptGen(output_text, null);
        }
        // promptGen(output_text, word_audio);
        
    } catch (error) {
        SummaryBox(search_text);
        console.log('Could not display the Meaning As: ', error);
    }
}

//Text Translation
function translate(){
  
    var sourceText = 'garson';
    var sourceLang = 'fr';
    var targetLang = 'en';
    console.log(sourceText);

    var tarnslate_url = "https://translate.google.so/translate_a/t?client=any_client_id_works&sl=auto&tl=en&q="+ encodeURI(sourceText) +"&tbb=1&ie=UTF-8&oe=UTF-8";
    
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
    
    
    $.getJSON(url, function(data) {
        const res = (data[0][0][0]);
        console.log(res);
    });
  
}
translate();



function doButton(){
    const btn = document.createElement("div");

    const div1 = document.createElement("img");
    div1.src = chrome.runtime.getURL("textsearch.svg")
    div1.style.paddingRight = "6px";
    div1.style.height = "20px";
    div1.style.width = "20px";
    div1.title = "ReaderAI Search";
    div1.style.borderRight = "0.5px solid grey";
    div1.addEventListener('mouseover', function() {
        div1.style.backgroundColor = "#F9E5FF";
    })
    div1.addEventListener('mouseover', function() {
        div1.style.backgroundColor = "#F9E5FF";
    })
    div1.addEventListener('mouseout', function() {
        div1.style.backgroundColor = "white";
    })

    
    const div2 = document.createElement("img");
    div2.src = chrome.runtime.getURL("translate.svg");
    div2.style.height = "20px";
    div2.style.width = "20px";
    div2.style.paddingRight = "2px";
    div2.addEventListener('mouseover', function() {
        div2.style.backgroundColor = "#F9E5FF";
    })
    div2.addEventListener('mouseout', function() {
        div2.style.backgroundColor = "white";
    })

    btn.id = "readerai_text_assist_button";
    btn.textContent = "";
    btn.style.backgroundColor = "white";
    btn.style.padding = "2px";
    btn.style.color = "black";
    btn.style.position = "absolute";
    btn.style.zIndex = "999999 !important";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    // btn.style.width = "60px";
    // btn.style.height = "25px";
    btn.style.display = "flex";
    btn.style.flexDirection = "row";
    btn.style.gap = "5px";
    btn.style.visibility = "hidden"; //not visible when webpage loaded 
    btn.style.boxShadow = "0 2px 4px darkslategray";
    btn.style.cursor = "pointer";


    document.body.appendChild(btn);
    btn.appendChild(div1);
    btn.appendChild(div2);

    document.addEventListener('mouseup', function() {
        
        btn.style.visibility = "visible";   
        const selection_txt = window.getSelection();
        const selected_text = window.getSelection().toString();
        console.log(selected_text);
        prompt_text = selected_text;
   
        if(selected_text.length > 0) {
           
            const range = selection_txt.getRangeAt(0);  
            const rect = range.getBoundingClientRect();
            const topOffset = rect.top + window.pageYOffset - btn.offsetHeight - 5;  
            const leftOffset = rect.left + window.pageXOffset + rect.width + 5; 

            btn.style.top = topOffset + "px";
            btn.style.left = leftOffset + "px";
            
        } else if(selected_text.length === 0) {
            
            prompt_text = "";
            removeTextPrompt();
            btn.style.visibility = "hidden";          
        }
    });

    div1.addEventListener('click', function() {
        if(prompt_text === ""){
            return;
        }
        const prompt_exists = document.getElementById("readerai_text_prompt");
        if(!prompt_exists){
            getDictionary(prompt_text);
        }else{
            removeTextPrompt();
        }
    });
    console.log("text assist button added to page.")
}

// Checking with settings page if textAsist Enabled or not
chrome.storage.local.get("textAssist", function(data) {
    if(data.textAssist === 1) {
        doButton();
    } else {
        return;
    }
})

// Checking for changed in settings page dynamically
function handleStorageChange(changes, area) {
    
    if (area === 'local') {
      
      if (changes.hasOwnProperty('textAssist')) {
        const newValue = changes.textAssist.newValue;
        if(newValue === 1) {
            doButton();
        } else {
            const assist_btn = document.getElementById("readerai_text_assist_button");
            assist_btn.remove();
        }
      }
    }
}
chrome.storage.onChanged.addListener(handleStorageChange);


// Note taking marker functionality
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

var x = 0;
var y = 0;
var width = window.innerWidth;
var height = window.innerHeight;

function noteMarker(x_val, y_val) {
    const note_btn = document.createElement("img");
    note_btn.src = "https://i.imgur.com/AghQInS.png"

    note_btn.style.width = "25px";
    note_btn.style.height = "25px";
    note_btn.style.zIndex = "10000";
    note_btn.style.position = "absolute";
    note_btn.style.textDecoration = "none";
    note_btn.title = "Note Marker";
    note_btn.style.cursor = "pointer";
    note_btn.style.left = x_val + "px";  
    note_btn.style.top = y_val + "px";

    var z = create_UUID(); //the unique id
    note_btn.id = "readerai_notes_btn" + z; //for easier identification of note marker in HTML corpus
    document.body.appendChild(note_btn);


    const current_url = window.location.href.toString();
    const html_content = note_btn.outerHTML;
    console.log(current_url);
    console.log(html_content);
    const storage_key = 'readerai_url_' + current_url

    chrome.storage.local.get(storage_key, function(data) {

        const existing_marks = data[storage_key] || [];  
        existing_marks.push(html_content);

        const markers = { 
            [storage_key]: existing_marks 
        };

        chrome.storage.local.set(markers, function() {
            console.log("values appended to", markers);
        })
    }) 

}

document.addEventListener('contextmenu', function(event) {
    // x = event.clientX - 2;  //This caused error as its relative to url bar
    // y = event.clientY - 5;

    //zoom adjustment measures  
    // const rect = event.target.getBoundingClientRect();
    // const zoomFactor = document.documentElement.clientWidth / window.innerWidth;
    // x = (event.clientX - rect.left) / zoomFactor;
    // y = (event.clientY - rect.top) / zoomFactor;

    x = event.pageX - 2; 
    y = event.pageY - 5;
    // console.log("Context menu opened at coordinates: (" + x + ", " + y + ")");
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.add === 'note_marker') {
        noteMarker(x,y);
        console.log('Marker Added');
    }
});

// Adding Markers to the current Webpage
const current_url = window.location.href.toString();
const target_key = 'readerai_url_' + current_url
chrome.storage.local.get(target_key, function(data) { 
    const mark_array = data[target_key] || [];
    
    mark_array.forEach(function (value) {
        console.log(value);
        const mark_btn = document.createElement("div");
        mark_btn.innerHTML = value;
        document.body.appendChild(mark_btn);
    })
    console.log("markers added");
})

function verifyMarker(buttonId) {
    return buttonId.startsWith("readerai_notes_btn");
}

// Marker to notes functionality:
function openExtensionPage() {
    window.open(chrome.runtime.getURL("notes.html"));
}

document.addEventListener('click', function(event) {
    var click_element = event.target;
    var click_element_id = click_element.id;
    if( verifyMarker(click_element_id) ) {
        
        
        console.log(click_element_id);
        const ele_id = click_element_id.toString();
        var exists = '';

        //A function which adds essential instructions to the url of notes page.
        function openNotesPage() {
            const pageURL = chrome.runtime.getURL('notes.html');
            window.open(pageURL + '?note=' + ele_id + '&exists=' + exists, '_blank');
        }
        chrome.storage.local.get(ele_id, function(data) { 
            const id_value = data[ele_id];
            if(id_value){
                chrome.storage.local.set({ Current_id : 0 }, function() {
                    exists = 'true';
                    openNotesPage();
                    console.log("Previous saved data exists for this marker.");
                })
                chrome.storage.local.set({ idShow : ele_id});
            }else{
                chrome.storage.local.set({ Current_id : 1 }, function() {
                    exists = 'false';
                    openNotesPage();
                    console.log("No Previous Data Exists for this marker");
                })
                chrome.storage.local.set({ idShow : ele_id }, function() {
                    console.log("id added to current key in storage");
                });
            }
        }); 
    
    }
})


//Marker removal via context menu:
document.addEventListener('contextmenu', function(event) {
    
    var clicked_element = event.target;
    var element_id = clicked_element.id;

    if( verifyMarker(element_id) ) {
        console.log("verified readerai marker");

        event.preventDefault();
        const removeMenuItem = document.createElement('div');
        removeMenuItem.style.zIndex = '10000';
        removeMenuItem.textContent = 'Remove Marker';
        removeMenuItem.style.padding = '5px';
        removeMenuItem.style.cursor = 'pointer';
        removeMenuItem.style.backgroundColor = '#282829';
        removeMenuItem.style.color = "white";
        removeMenuItem.style.boxShadow = "0 2px 4px darkslategray";
        removeMenuItem.style.fontFamily = '"Plus Jakarta Sans", sans-serif';
        removeMenuItem.style.fontSize = "12px";
        removeMenuItem.style.borderRadius = "4px";
        removeMenuItem.style.position = 'fixed';
        removeMenuItem.style.top = `${event.clientY + 10}px`;
        removeMenuItem.style.left = `${event.clientX + 4}px`;
        
        removeMenuItem.addEventListener('click', function () { 
            
            const marker_selected = document.getElementById(element_id);
            var mark_value = marker_selected.outerHTML;
            console.log(mark_value);
            marker_selected.remove();

            const markDataRemove = element_id.toString();
            chrome.storage.local.remove(markDataRemove); // Remove Deleted Marker data from storage
            const key_element = 'readerai_url_' + current_url;
            chrome.storage.local.get(key_element, function(data) { 
                const existing_array = data[key_element] || [];
                
                const index_remove = existing_array.indexOf(mark_value);

                if(index_remove != -1) {
                    existing_array.splice(index_remove, 1);
                    chrome.storage.local.set({ [key_element]: existing_array }, function() {
                        console.log("value removed from storage.");
                    });
                }
            });
            removeMenuItem.remove();
        });
        document.body.appendChild(removeMenuItem);

        // To remove context menu when clicked away:
        document.addEventListener('click', function(ev) {
            if(!removeMenuItem.contains(ev.target)){
                removeMenuItem.remove();
            }
        })
    }
})













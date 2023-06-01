const paragraph = document.querySelector("p");
const bodycontent = document.querySelector("body");

// This section is for the reading time generator:

const {
    host, hostname, href, origin, pathname, port, protocol, search
} = window.location

if (bodycontent){
    const text = bodycontent.textContent;
    const wordMatchRegExp = /[^\s]+/g; 
    const words = text.matchAll(wordMatchRegExp);
    const wordCount = [...words].length;

    const readingTime = Math.round(wordCount / 270);
    const badge = document.createElement("p");

    badge.classList.add("color-secondary-text", "type--caption");
    badge.textContent = `⏱️ ${readingTime} min read`;

    const heading = bodycontent.querySelector("h1");
    const heading_2 = document.querySelector("h2");

    const header_content = bodycontent.querySelector("header");
    const date = bodycontent.querySelector("time")?.parentNode;
    const pdf_view = document.querySelector("span");
    const head_element = document.querySelector("head");
    const first_div = bodycontent.querySelector("div");

    //messing with chrome pdf viewer -> later realised its an extension itself
    if(protocol === "file:"){
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById("title").textContent = "Welcome back, Bart";
        });
    }   

    if(date){
        (date).insertAdjacentElement("afterend", badge);
    }else if (!date && header_content){
        (header_content).insertAdjacentElement("afterend", badge);
    }else if (!date && !header_content && heading){
        (heading).insertAdjacentElement("afterend", badge);
    }else if(!date && !header_content && !heading && first_div){
        (first_div).insertAdjacentElement("afterend", badge);
    }else if(!date && !header_content && !heading && !first_div && head_element){
        (head_element).insertAdjacentElement("afterend", badge);
    }else if(!date && !header_content && !heading && !first_div && !head_element && heading_2){
        (heading_2).insertAdjacentElement("afterend", badge);
    }else if(!date && !header_content && !heading && !first_div && !head_element && !heading_2 && first_div){
        (first_div).insertAdjacentElement("beforebegin", badge);
    }
} 

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

function promptGen(box_text, audio_play) {
    const boxx = document.createElement("div");
    boxx.id = "readerai_text_prompt";
    boxx.style.zIndex = "10000";
    boxx.style.width = "auto";
    boxx.style.height = "auto";
    boxx.style.padding = "5px";
    boxx.style.margin = "4px";
    boxx.style.fontSize = "13px"
    boxx.style.backgroundColor = "#FEFFF2";
    boxx.style.color = "black";
    boxx.style.fontFamily = '"JetBrains Mono", monospace';
    boxx.style.borderRadius = "3px";
    boxx.style.border = "2px solid yellow"
    boxx.style.textDecoration = "none";
    boxx.style.position = "fixed";
    boxx.style.bottom = "4%";
    boxx.style.right = "70%";
    boxx.style.boxShadow = "0 2px 4px darkslategray";

    boxx.textContent = box_text;
    const close_button = document.createElement("button");
    
    close_button.textContent = "X";
    close_button.style.backgroundColor = "#E5E4E2";
    close_button.style.color = "black";
    close_button.style.borderRadius = "50%";
    close_button.style.borderWidth = "0px";
    close_button.style.margin = "5px";
    close_button.style.cursor = "pointer";
    close_button.style.boxShadow = "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset";

    const audio_btn = document.createElement("button");
    audio_btn.id = "readerai_audio";
    audio_btn.style.fontFamily = '"JetBrains Mono", monospace';
    audio_btn.textContent = "Pronunciation🔊";
    audio_btn.style.backgroundColor = "#E5E4E2";
    audio_btn.style.color = "black";
    audio_btn.style.borderWidth = "0px";
    audio_btn.style.margin = "5px";
    audio_btn.style.cursor = "pointer";
    audio_btn.style.padding = "3px";
    audio_btn.style.boxShadow = "rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset"

    const audioPlayer = document.createElement("audio");
    audioPlayer.setAttribute("id", "audioPlayer");
    audioPlayer.setAttribute("src", `${audio_play}`);

    document.body.appendChild(boxx);
    const readerai_div = document.getElementById("readerai_text_prompt");
    readerai_div.appendChild(audio_btn);
    readerai_div.appendChild(audioPlayer);
    readerai_div.appendChild(close_button);


    audio_btn.addEventListener("click", function() {
        audioPlayer.play();
        audio_btn.style.backgroundColor = "#FAF2FF";
      });

    console.log("added text assist box!");

    close_button.addEventListener('click', function() {
        close_button.style.backgroundColor = "#F67272"
        removeTextPrompt();
    });
}

const wiki_api = "https://en.wikipedia.org/api/rest_v1/page/html/"; //to get html
const wiki_summary = "https://en.wikipedia.org/api/rest_v1/page/summary/"; //to get page summary

// Making the summary box 
async function SummaryBox (query_text) {
    const executable_query = query_text.replaceAll(/[.,;:-]/g, ' ');
    const filtered_query = executable_query.replaceAll(' ', '_');
    const api_url = wiki_summary + filtered_query;    
    try {
        const response = await fetch(api_url);
        const data = await response.json();

        const text_summary = data.extract;

        output_text = "Your Query : " + query_text + "; \n" + "Result: " + text_summary;
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

        output_text = "Word : " + word + "; \n" + "Defination: " + means;
        console.log(output_text);
        promptGen(output_text, word_audio);
        
    } catch (error) {
        SummaryBox(search_text);
        console.log('Could not display the Meaning As: ', error);
    }
}

function doButton(){
    const body_content = document.querySelector("body");
    // const btn = document.createElement("button");
    const btn = document.createElement("img");

    btn.id = "readerai_text_assist_button";
    btn.src = "https://i.imgur.com/rlzB14l.png";
    btn.style.position = "absolute";
    btn.style.border = "none";
    btn.style.width = "30px";
    btn.style.height = "30px";
    btn.style.borderRadius = "50%"
    // btn.style.fontFamily = "JetBrains Mono";
    btn.style.textDecoration = "none";
    btn.style.boxShadow = "0 2px 4px darkslategray";
    btn.style.cursor = "pointer";
    btn.style.transition = "box-shadow .15s,transform .15s";
    btn.style.touchAction = "manipulation";

    //button transformation css actions
    btn.addEventListener('mouseover', function() {
        this.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
        this.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('focus', function(){
        this.style.boxShadow = '#D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
    });
    btn.addEventListener('mousedown', function() {
        this.style.boxShadow = '#D6D6E7 0 3px 7px inset';
        this.style.transform = 'translateY(2px)';
    });
    btn.addEventListener('mouseup', function() {
        this.style.boxShadow = '';
        this.style.transform = '';
    });

    //to get selected highlighted text by user.
    document.body.appendChild(btn);
    
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

    btn.addEventListener('click', function() {
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


doButton();


//wiki infobox section 
async function informationBox(pageTitle) {
    try {
        const wiki_api_url = wiki_api + `${pageTitle}`
        const response = await fetch(wiki_api_url);

        const html = await response.text(); 
        const parser = new DOMParser();

        const doc = parser.parseFromString(html, 'text/html');
        const infocard = doc.querySelector('.infobox');
    
        if (infocard) {
            const infocard_prompt = document.createElement('div');
            infocard_prompt.innerHTML = infocard.innerHTML;
    
        
            // document.body.appendChild(infocard_prompt);
            console.log(infocard_prompt.innerHTML);
        } else {
            console.log('Infobox vcard table not found.');
        }
    } catch (error) {
      console.error('Error:', error);
    }
}
  
// const pageTitle = 'C++';
  
// informationBox(pageTitle).catch((error) => console.error('Error:', error));
  
  














// the button to enable text-assist feature od readerAI

let textBox_open = false; //toggle flag
let prompt_text = "";

function removeTextPrompt() {
    const text_prompt = document.getElementById("readerai_text_prompt");
    if(text_prompt) {
        text_prompt.remove();
    }
}

function promptGen() {
    const boxx = document.createElement("div");
    boxx.id = "readerai_text_prompt";
    boxx.style.width = "auto";
    boxx.style.height = "auto";
    boxx.style.padding = "5px";
    boxx.style.margin = "2px";
    boxx.style.fontSize = "13px"
    boxx.style.backgroundColor = "white";
    boxx.style.fontFamily = '"JetBrains Mono", monospace';
    boxx.style.borderRadius = "3px";
    boxx.style.borderWidth = "1px";
    boxx.style.textDecoration = "none";
    boxx.style.position = "fixed";
    boxx.style.bottom = "4%";
    boxx.style.right = "70%";
    boxx.style.boxShadow = "0 2px 4px darkslategray";
    boxx.style.cursor = "pointer";
    boxx.textContent = prompt_text;

    
    const close_button = document.createElement("button");
    
    close_button.textContent = "X";
    close_button.style.backgroundColor = "#E5E4E2";
    close_button.style.borderRadius = "50%";
    close_button.style.borderWidth = "0px";
    close_button.style.margin = "3px";

    document.body.appendChild(boxx);
    
    const readerai_div = document.getElementById("readerai_text_prompt");
    readerai_div.appendChild(close_button)

    console.log("added text assist box!")

    close_button.addEventListener('click', function() {
        removeTextPrompt();
        textBox_open = !textBox_open;
    })
}


function doButton(){
    const body_content = document.querySelector("body");
    const btn = document.createElement("button");

    //css button styling
    btn.textContent = "\u2714";
    btn.style.backgroundColor = " #48abe0";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "50%"
    btn.style.position = "fixed";
    btn.style.borderWidth = "0";
    btn.style.fontFamily = "JetBrains Mono";
    btn.style.fontWeight = "medium";
    btn.style.bottom = "4%";
    btn.style.textDecoration = "none";
    btn.style.right = "2%";
    btn.style.boxShadow = "0 2px 4px darkslategray";
    btn.style.cursor = "pointer";
    btn.style.transition = "box-shadow .15s,transform .15s";
    btn.style.touchAction = "manipulation";
    btn.style.whiteSpace = "nowrap";

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

    document.body.appendChild(btn);

    //to get selected highlighted text by user.
    document.addEventListener('mouseup', function() {
        const selected_text = window.getSelection().toString();
        prompt_text = selected_text;

    });

    console.log("text assist button added to page!")

    btn.addEventListener('click', function() {
        if(prompt_text === ""){
            return;
        }
        textBox_open = !textBox_open;
        if(textBox_open){
            promptGen();
        }else{
            removeTextPrompt();
        }
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.dothis === 'activate_button') {
        doButton();
    }
});






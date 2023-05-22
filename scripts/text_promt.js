
function promptGen() {
    const boxx = document.createElement("button");

    boxx.style.width = "100px";
    boxx.style.height = "50px";
    boxx.style.padding = "5px";
    boxx.style.fontFamily = '"JetBrains Mono", monospace';
    boxx.style.borderRadius = "3px";
    boxx.style.borderWidth = "1px";
    boxx.style.textDecoration = "none";
    boxx.style.position = "fixed";
    boxx.style.bottom = "4%";
    boxx.style.right = "90%";
    boxx.style.boxShadow = "0 2px 4px darkslategray";
    boxx.style.cursor = "pointer";
    boxx.textContent = "This is the box which helps you!"
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.dothis === 'make_prompt_box') {
        promptGen();
    }
});

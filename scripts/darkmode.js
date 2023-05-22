
function loadCSSFile(filename) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = filename;
  
    document.head.appendChild(linkElement);
}

function DarkMode(){
    // loadCSSFile('dark.css');
    document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg)";

    let dont_invert = document.querySelectorAll("img, picture, video");

    dont_invert.forEach((item) => {
        item.style.filter = "invert(1) hue-rotate(180deg)"; //to nullify the effect 
    })

    console.log("Enabled dark mode.");
}

function UndoDarkMode(){
    // document.querySelector("html").style.removeProperty("filter");
    document.querySelector("html").style.filter = "invert(0) hue-rotate(0deg)";

    let dont_invert = document.querySelectorAll("img, picture, video");

    dont_invert.forEach((item) => {
        item.style.filter = "invert(0) hue-rotate(0deg)"; //to nullify the effect 
    })
    console.log("undo dark mode completed.");
}

//receiving message from background.js to execute script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.dothis === 'toggle_drk_mode') {
        DarkMode();
    }
    if (message.dothis === 'toggle_drk_mode-off') {
        UndoDarkMode();
    }
});

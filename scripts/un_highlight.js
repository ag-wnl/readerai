
// To remove highlight upon user request.
function un_highlighted(){
    var mark_tags = document.querySelectorAll("mark");
    mark_tags.forEach(function(mark_element) {
        var mark_text = mark_element.textContent;
        var textNode = document.createTextNode(mark_text);
        mark_element.parentNode.replaceChild(textNode, mark_element);
    });
}

//receiving message from background.js to execute script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.dothis === 'un_highlight_text') {
        un_highlighted();
    }
});


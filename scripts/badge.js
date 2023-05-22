//when installed -> badge with extension icon => :)
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: ":)",
    });
});
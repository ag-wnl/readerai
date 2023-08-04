// import './scripts/text_selection.js'; //text processing
// import './scripts/un_highlight.js'
// import './scripts/darkmode.js'
// import './scripts/plot_compute.js'

self.window = self;
importScripts('./jsrsasign-all-min.js')
importScripts('./scripts/text_selection.js')
importScripts('./scripts/un_highlight.js')
importScripts('./scripts/darkmode.js')
importScripts('./scripts/plot_compute.js')
importScripts('./scripts/plot_compute.js')


//User Login Handling Block:
let user_signed_in = false;

function is_user_signed_in() {
    return user_signed_in;  
}

const CLIENT_ID = encodeURIComponent('908233109-0gi4ugo0f3990abdmqgiengfur23tr3r.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token');
const REDIRECT_URI = encodeURIComponent('https://hodnlalamlhhnadbmhgkddeoaookbmbg.chromiumapp.org');
const STATE = encodeURIComponent('jfkls3n');
const SCOPE = encodeURIComponent('openid');
const PROMPT = encodeURIComponent('consent');


function create_oauth2_url() {
    let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2,15));

    let url = 
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&prompt=${PROMPT}&nonce=${nonce}`;
    
    return url;
}

//Implement all this in popup.js
function signOutUser() {
    // Revoke the user's access token
    chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
      if (chrome.runtime.lastError) {
        console.error('Error getting user token:', chrome.runtime.lastError);
      } else {
        chrome.identity.removeCachedAuthToken({ token: token }, function () {
          // Clear the user's OAuth 2.0 credentials
          chrome.identity.clearAllCachedAuthTokens(function () {
            console.log('User signed out successfully!');
            // Perform any other cleanup or actions you need after sign-out here
          });
        });
      }
    });
  }



//receiving messages from popup.js and sending messages to trigger other scripts.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'runBackgroundjs') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {run: 'highlight_text'});
        });
        console.log('Backgorund script executed');
    }
    else if (request.action === 'unHighlight') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {dothis: 'un_highlight_text'});
        });
        console.log('Un-highlight script executed.');
    }
    else if (request.action === 'dark-mode'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {dothis: 'toggle_drk_mode'});
        });
        
    }
    else if (request.action === 'dark-mode-undo'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {dothis: 'toggle_drk_mode-off'});
        });

    }else if (request.message === 'login') {
        if(is_user_signed_in()) {
            console.log('Already Signed In.')
        }else {
            chrome.identity.launchWebAuthFlow({
                url: create_oauth2_url(), 
                interactive: true

            }, function(redirect_url) {

                let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') +9);
                id_token = id_token.substring(0, id_token.indexOf('&'));

                //This is the basic user info for the Account
                const user_info = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(id_token.split(".")[1]));

                if((user_info.iss === 'https://accounts.google.com' || user_signed_in.iss === 'accounts.google.com') &&  user_info.aud === CLIENT_ID) {
                    
                    user_signed_in = true;
                    sendResponse('success');
                    console.log('done!!')
                    chrome.storage.local.set({ SignedIn : 1 });
                }else{
                    console.log('Could not Authenticate.');
                }
            });

            return true;
        }
    }else if (request.message === 'logout') {

        signOutUser();
        chrome.storage.local.set({ SignedIn : 0 });
        user_signed_in = false;
        return true;
        
    } 
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id:"1",
        title: "Add Note Marker",
        contexts: ["page"],
    });

    chrome.storage.local.set({"textAssist" : 1});
});


chrome.contextMenus.onClicked.addListener(function() {
    console.log('contextmenu clicked');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {add: 'note_marker'});
    });
});








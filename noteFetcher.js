

document.addEventListener('DOMContentLoaded', function() { 

    chrome.storage.local.get(null, function(data) {
        const keys = Object.keys(data).filter(key => key.startsWith('readerai_url_'));
        const display_list = document.getElementById('key_list');
    
        keys.forEach(key => {
            const item = document.createElement('li');
            const format_display = key.replace('readerai_url_', '');
            item.textContent = format_display;
            display_list.appendChild(item);
    
        });
    });
    
    const subkey_list = document.getElementById('subkeys');
    const keyList = document.getElementById('key_list');
    keyList.addEventListener('click', function(event) {
        subkey_list.innerHTML = '';
    
        if(event.target.tagName === 'LI') {
            const click_element = ('readerai_url_' + event.target.textContent).toString();
            console.log(click_element);
            chrome.storage.local.get(click_element, function(data) {
                if(click_element in data) {
                    const subkey_target_list = data[click_element];
                    
                    for(let subkey_item of subkey_target_list) {
                        const sub_item = document.createElement('li');
                        const regex = /id="([^"]+)"/;
                        const match = subkey_item.match(regex);
                        const id = match && match[1];
                        sub_item.textContent = id;
                        sub_item.id = id;
                        subkey_list.appendChild(sub_item);
                    }
                }
            });
        }   
    });
});


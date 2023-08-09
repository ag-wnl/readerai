
document.addEventListener('DOMContentLoaded', function() { 

    //recent Notes:
    const recent_list = document.getElementById('recent');
    const recents = document.getElementById('recent_notes');
    recents.addEventListener('click', function() {
        const storing_key = 'readerai_recent_notes';
        chrome.storage.local.get(storing_key, function(data) { 
            
                const recent_target_list = data[storing_key];    
                for(let subkey_item of recent_target_list) {
                    if(subkey_item === null) {
                        return;
                    }else{
                        const sub_item = document.createElement('li');
                        const id = subkey_item;
                        sub_item.id = id;
                        chrome.storage.local.get(id, function(value) {
                            const editor_content = value[id];

                            if(editor_content !== undefined) {
                                console.log(editor_content);
                                const preview_text = editor_content.replace(/<[^>]*>/g, '');
                                const sliced = preview_text.slice(0, 15) + '...';
                                sub_item.textContent = sliced; 
                                
                                sub_item.style.cursor = "pointer";
                                sub_item.style.color = 'black';
                                sub_item.title = "Open Note";
                                sub_item.style.fontSize = "16px";
                                recent_list.appendChild(sub_item);
                            }
                        });                     
                    }                   
                }    
                const main_list= document.getElementById('key_list');
                main_list.replaceWith(recent_list);     
                const sub_list = document.getElementById('subkeys');
                sub_list.style.visibility = 'hidden';
                document.getElementById('back_btn').style.visibility = 'visible';
        });

        recent_list.addEventListener('click', function(event) {
            if(event.target.tagName === 'LI') {
                var click_element = event.target;
                var click_element_id = click_element.id;
                

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
                                exists = 'true';
                                openNotesPage();
                                console.log("Previous saved data exists for this marker.");
                        }else{
                                exists = 'false';
                                openNotesPage();
                                console.log("No Previous Data Exists for this marker");
                        }
                    });  
            }
        })

    })

    document.getElementById('back_btn').addEventListener('click', function() {
        document.getElementById('back_btn').style.visibility = 'hidden';
        location.reload();
    })




    //Current URL Notes Viewer
    const params = new URLSearchParams(window.location.search);
    const note_url = params.get('url');
    if(note_url) {
        const search_url = 'readerai_url_' + note_url;
        chrome.storage.local.get(search_url, function(data) {
            const display_list = document.getElementById('key_list');

            const values = data[search_url];
            // if (Array.isArray(values) && values.length === 0) {
                
                
            // }

            const item = document.createElement('li');
            //Adding the Page URL it corresponds to in the list item's ID attribute.
            const format_display = search_url.replace('readerai_url_', '');
            item.id = format_display;
            var display_title = format_display;
            display_title = display_title.replace(/^https?:\/\//, '');
            display_title = display_title.replace(/^www\./, '');
            
            item.textContent = display_title;
            item.style.fontSize = "16px";
            item.title = "Current visited URL"
            display_list.appendChild(item);

            const subkey_list = document.getElementById('subkeys');
            for(let subkey_item of values) {
                const sub_item = document.createElement('li');
                const regex = /id="([^"]+)"/;
                const match = subkey_item.match(regex);
                const id = match && match[1];
                sub_item.id = id;
                sub_item.style.cursor = "pointer";
                sub_item.style.color = 'purple';
                sub_item.title = "Open Note";
                sub_item.style.fontSize = "14px";
                subkey_list.appendChild(sub_item);
                chrome.storage.local.get(id, function(value) {
                    const editor_content = value[id];
                    const preview_text = editor_content.replace(/<[^>]*>/g, '');
                    const sliced = preview_text.slice(0, 15) + '...';
                    sub_item.textContent = sliced;
                });
            }

            subkey_list.addEventListener('click', function(event) {
                if(event.target.tagName === 'LI') {
                    var click_element = event.target;
                    var click_element_id = click_element.id;
                    
        
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
                                    exists = 'true';
                                    openNotesPage();
                                    console.log("Previous saved data exists for this marker.");
                            }else{
                                    exists = 'false';
                                    openNotesPage();
                                    console.log("No Previous Data Exists for this marker");
                            }
                        });  
                }
            })

        })
        
    }else{
        //Normal Notes Menu operation

        chrome.storage.local.get(null, function(data) {
            const keys = Object.keys(data).filter(key => key.startsWith('readerai_url_'));
            const display_list = document.getElementById('key_list');
        
            keys.forEach(key => {

                //To skip Keys(URLs) with no marker values(empty arrays):   
                const values = data[key];
                if (Array.isArray(values) && values.length === 0) {
                    // Skip the key with an empty array value
                    return;
                }

                const item = document.createElement('li');
                //Adding the Page URL it corresponds to in the list item's ID attribute.
                const format_display = key.replace('readerai_url_', '');
                
                item.id = format_display;
                
                //To display a cleaner URL for the user:
                var display_title = format_display;
                display_title = display_title.replace(/^https?:\/\//, '');
                display_title = display_title.replace(/^www\./, '');
                
                item.textContent = display_title;
                item.style.fontSize = "16px";
                item.title = "Click to View saved Notes."
                display_list.appendChild(item);
        
            });
        });
        
        const subkey_list = document.getElementById('subkeys');
        const keyList = document.getElementById('key_list');
        
        keyList.addEventListener('click', function(event) {
            subkey_list.innerHTML = '';
            
            //If Clicked on a Key List element, it has URL in its ID, so searching
            //the data contained in its URL in sotrage
            if(event.target.tagName === 'LI') {
                const click_element = ('readerai_url_' + event.target.id).toString();
                console.log(click_element);
                chrome.storage.local.get(click_element, function(data) {
                    if(click_element in data) {
                        const subkey_target_list = data[click_element];
                        
                        for(let subkey_item of subkey_target_list) {
                            const sub_item = document.createElement('li');
                            const regex = /id="([^"]+)"/;
                            const match = subkey_item.match(regex);
                            const id = match && match[1];
                            sub_item.id = id;
                            sub_item.style.cursor = "pointer";
                            sub_item.style.color = 'purple';
                            sub_item.title = "Open Note";
                            sub_item.style.fontSize = "14px";
                            subkey_list.appendChild(sub_item);
                            chrome.storage.local.get(id, function(value) {
                                const editor_content = value[id];
                                const preview_text = editor_content.replace(/<[^>]*>/g, '');
                                const sliced = preview_text.slice(0, 15) + '...';
                                sub_item.textContent = sliced;
                            });
                        }
                    }
                });
            }   
        });

        //Opening the Notes when clicked on it
        subkey_list.addEventListener('click', function(event) {
            if(event.target.tagName === 'LI') {
                var click_element = event.target;
                var click_element_id = click_element.id;
                

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
                                exists = 'true';
                                openNotesPage();
                                console.log("Previous saved data exists for this marker.");
                        }else{
                                exists = 'false';
                                openNotesPage();
                                console.log("No Previous Data Exists for this marker");
                        }
                    });  
            }
        })

        //Searchbar Functionality and search algorithm

        const search_list = document.getElementById('key_list');
        const searchbar = document.getElementById('searchbar');
        searchbar.addEventListener('input', function() {
            const search_term = searchbar.value.toLowerCase();
        
                const n = document.getElementById("key_list").getElementsByTagName("li").length;  
                
                    for(let i = 0; i < n; i++) {
                        
                        const curr_item = search_list.getElementsByTagName('li')[i];
                        const key_text = curr_item.textContent.toLowerCase();
            
                        if(key_text.includes(search_term)) {
                            curr_item.style.display = "block";
                        }else { 
                            curr_item.style.display = "none";
                        }
                    }       
        })
    }


    const title_btn = document.getElementById('home_page');
    title_btn.addEventListener('click', function() {
        const pageURL = chrome.runtime.getURL('notes_menu.html');
        window.open(pageURL);
    })
});


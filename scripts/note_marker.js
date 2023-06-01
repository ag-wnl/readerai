//Note taking functionality

function noteMarker() {
    const note_btn = document.createElement("img");
    note_btn.id = "readerai_notes_btn";
    note_btn.src = "images/notes_img.png"

    note_btn.style.width = "30px";
    note_btn.style.height = "30px";
    note_btn.style.zIndex = "10000";
    note_btn.style.position = "absolute";
    note_btn.style.textDecoration = "none";
    note_btn.style.cursor = "pointer";
    

    document.body.appendChild(note_btn);
}
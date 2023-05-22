const article = document.querySelector("article");
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












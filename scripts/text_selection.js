console.log("text_selection working")

function get_text(){

    Set.prototype.union = function(setB) {
        var union = new Set(this);
        for (var elem of setB) {
            union.add(elem);
        }
        return union;
    }
        
    Set.prototype.intersection = function(setB) {
        var intersection = new Set();
      
        var thisArr = Array.from(this);
        var setBArr = Array.from(setB); 
      
        for (var i = 0; i < this.size; i++) {
            for (var j = 0;  j < setB.size; j++) {
                if (thisArr[i].indexOf(setBArr[j][0], setBArr[j][1], setBArr[j][2]) > -1)
                    intersection.add(this[i]);
            }
        }
        return intersection;
    }
      // ProcessSentence
    class ProcessSentence {
        
        constructor(sentence) {
            this.sentence = sentence;
        }
      
        _tokenize() {    
            this.sentenceMetrics = this.sentence.split("\n");
        }
      
        getSentenceMetrics() {
            this._tokenize();
            return this.sentenceMetrics;
        }
    }
      
      // weight metrics
      
    class WeightMetrics {
      
        constructor(sentenceMetrics) {
            this.sentenceMetrics = sentenceMetrics;
            this.weightMetrics = new Array(sentenceMetrics.length).fill(0).map(() => new Array(sentenceMetrics.length).fill(0));
        }
      
        getWeightMetrics() {
            this._update();
            return this.weightMetrics;
        }
      
        _update() {
            var weightsLength = this.weightMetrics.length;
            for (var i = 0; i < weightsLength; i++) {
                for (var j = 0; j < weightsLength; j++) {
                    var jaccardIndex = this._getJaccardIndex(
                        this._splitSentence(this.sentenceMetrics[i]), this._splitSentence(this.sentenceMetrics[j]));
                        if (!jaccardIndex) jaccardIndex = 0;
                        this.weightMetrics[i][j] = jaccardIndex;
                }
            }
        }
      
        _getJaccardIndex(s1, s2) {
            var s1Set = new Set(s1);
            var s2Set = new Set(s2);
            var intersect = s1Set.intersection(s2Set);
            var union = s1Set.union(s2Set);
            return intersect.size / union.size;
        }
      
        _splitSentence(sentence) {
            return sentence.split(" ");
        }
      
    }
      
      //Textrank
      
    class TextRank {
        constructor(sentence) {
            this.ps = new ProcessSentence(sentence);
            this.weightMetrics = new WeightMetrics(this.ps.getSentenceMetrics());
            this.weights = this.weightMetrics.getWeightMetrics();
            this.score = new Float32Array(this.weights.length);
      
            this._initRanking();
      
            for (var i = 0; i < 20; i++)
                this._updateLoop();
        }
      
        getSummarizedOneText() {
            return this._top1();
        }
      
        getSummarizedThreeText() {
            return this._top3();
        }
      
        _initRanking() {
            var scoreLength = this.score.length;
            for (var i = 0; i < scoreLength; i++) {
                this.score[i] = (1 / scoreLength);
            }
        }
      
        _updateLoop() {
            var scoreLength = this.score.length;
            for (var i = 0; i < scoreLength; i++) {
                var tmp = 0;
                for (var j = 0; j < scoreLength; j++) {
                    tmp += this.score[j] * this.weights[j][i];
                }
                this.score[i] = this.score[i] + tmp;
            }
        }
      
        _top1() {
            var maxScore = 0;
            var maxIndex = 0;
            for (var i = 0; i < this.score.length - 1; i++) {
                if (maxScore < this.score[i]) {
                    maxScore = this.score[i];
                    maxIndex = i;
                }
            }
            return this.weightMetrics.sentenceMetrics[maxIndex];
        }
      
        _top3() {
            var ranking = new Array(this.score.length).fill(1);
            for (var i = 0; i < this.score.length - 1; i++) {
                for (var j = i + 1; j < this.score.length; j++) {
                    if (this.score[i] > this.score[j]) {
                        ranking[j]++;
                    }
                    else {
                        ranking[i]++;
                    }
                }
            }
            // console.log(this.score);
            // console.log(ranking);
            var returnString = '';
            for (var i = 1; i < 4; i++) 
                returnString += this.weightMetrics.sentenceMetrics[ranking.indexOf(i)] + "\n";
            return returnString;
        }
    }

    // Sentence splitting function to split string into array of sentences.
    function splitSentences(text) {
        const sentenceRegex = /[.!?:-]+/g;        // Regular expression to split sentences based on punctuation marks.
        const sentences = text.split(sentenceRegex);
        const filteredSentences = sentences.filter((sentence) => sentence.trim() !== '');       // Remove empty sentences and trim whitespace
        return filteredSentences;
    }

    // Text Processing where text selection technique is implemented and executed.
    const p_tags = document.body.getElementsByTagName("p");
    const number_of_p_tags = p_tags.length;
    console.log("the number of p tags : " + number_of_p_tags);
    var final_text_selection = "";

    //iterating and checking for relevant sentences from <p> tags and compiling them.
    for(var i = 1; i < number_of_p_tags - 6; i+=4){
        if(p_tags[i].innerText == ""){
            continue;
        }

        const combined_text = p_tags[i].innerText + p_tags[i+1].innerText + p_tags[i+2].innerText + p_tags[i+3].innerText;
        var text_content = new TextRank(combined_text);
        var text_selected = text_content.getSummarizedThreeText();
        const line_texts = splitSentences(text_selected);
        final_text_selection += text_selected;

        // Integrating Highlight within previous for loop: 
        for(var j=0; j < line_texts.length; j++){
            if(line_texts[j] === 'undefined'){
                continue;
            }

            //iterating over all 4 <p> tags combined in each i iteration.
            for(var k=0; k < 4; k++){
                if(i + k > number_of_p_tags - 1){
                    continue;
                }
                const p_tag = document.body.querySelectorAll("p")[i+k];
                const p_text = p_tag.innerHTML;
                const highlighted_txt = `<mark>${line_texts[j]}</mark>`;
                const highlighted_html = p_text.replace(line_texts[j], highlighted_txt);
                p_tag.innerHTML = highlighted_html;
            }
        }
    }
    console.log(final_text_selection);
}
  
//receiving message from background.js to execute script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.run === 'highlight_text') {
        get_text();
        console.log('Text selection/higlight script executed');
    }
  });
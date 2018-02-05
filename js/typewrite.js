/**************************************************************/
/*****  Typing-data initialization and helper functions  ******/
/**************************************************************/

// Defines time period of displays and display text data.
var typeData = {
    text: ['Software Development','Software Engineering','Back End','Web Technologies',
                'Object Oriented Design','Java C/C++ Python','SCRUM',
           'Machine Learning','Artificial Intelligence','Deep Learning','GANs CNNs RNNs',
                'Dimensionality Reduction','Capsule Networks','Fully Differentiable',
                'Computer Vision','Data Science','MATH!','Auto-encoders','Computational Neuroscience',
           'Snowboarding','Game of Zones','Setter/Libero','Phil Ivey','Illenium'],
    periodms: 100
};

/* Create a list consisting of a range of numbers */
var range = function(min,max,shuffle) {
    var list = [];
    for(var i = min; i <= max; i++)
        list.push(i);
    if(shuffle)
        shuffleList(list);
    return list;
}

/* Randomly shuffles a list in place */
var shuffleList = function(a) { 
    var tmp, j;
    for (var i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
};



/**************************************************************/
/******************** Core functionality  *********************/
/**************************************************************/

/* This to-be-instantiated function holds the data and state variables */
var typeWords = function(wordData,period) {
    this.data = wordData;
    this.listIdxs = range(1,this.data.length-1,true);
    this.period = period;
    this.currentWord = this.data[0];
    this.currentText = '';
    this.isDeleting = false;
    this.tick();
};

/* Grab random item */
typeWords.prototype.getRandItem = function() {
    if(this.listIdxs.length === 0)
        this.listIdxs = range(0,this.data.length-1,true);
    return this.data[this.listIdxs.pop()];
};

/* This function runs an infinite amount of times and executes one action
    per iteration (delete letter or put letter) and sets states. */
typeWords.prototype.tick = function() {
    //Sets next string to display
    var toDisplay = this.isDeleting ? this.currentWord.substring(0,this.currentText.length-1)
                                    : this.currentWord.substring(0,this.currentText.length+1);
    
    //Updates currentText variable and page to the text above
    this.currentText = toDisplay;
    var textElem = document.querySelector('#mainpg-typingLetters .typeWrite');
    textElem.innerHTML = toDisplay;
    
    //Set delay time for typewriting or deleting effect
    var delay = 200 - Math.random() * 100;
    delay = this.isDeleting ? delay/2 : delay;
    
    //Check if done typing -> switch to delete mode
    if(!this.isDeleting && this.currentText === this.currentWord) {
        this.isDeleting = true;
        delay *= 5;
    }
    //Checks if word cycle (completely shown then deleted) is complete
    if(this.isDeleting && !this.currentText) {
        this.currentWord = this.getRandItem();
        this.isDeleting = false;
        delay *= 5;
    }
    
    //Set up timeout for rerun
    var that = this;
    setTimeout(function() {
        that.tick();
    }, delay);
    
};

/* Function to start typing process called in nav.js -> document.onload() */
var startTypeWrite = function(data) {
    new typeWords(data.text,data.periodms);
};









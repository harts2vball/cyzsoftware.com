/* Navigation variables */

var navData = {
    sections: ['Top', 'Bio', 'Work', 'Contact', 'Resume'],
    ids: ['mainpg-mainImg','mainpg-bio','mainpg-work','mainpg-contact','resume'],
    objs: [],
    sectionYPositions: [],
    numNavLinks: 4, //first 4 are main scrolling elements in navbar
    loadData: function() {
        for(var i = 0; i < this.ids.length; i++) {
            var elem = document.querySelector('#'+this.ids[i]);
            this.objs.push(elem);
            var posY = getCurrentY() + getOffsetFromY(elem);
            this.sectionYPositions.push(posY);
        }
    }
};
var linkData = {
    ids: ['linkToTop','linkToBio','linkToWork','linkToContact','resumeLi'],
    objs: [],
    loadData: function() {
        for(var i = 0; i < this.ids.length; i++) {
            this.objs.push(document.getElementById(this.ids[i]));
        }
    }
};
var dropDownData = {
    className: 'dropDown',
    objs: [],
    loadData: function() {
        var collection = document.getElementsByClassName(this.className);
        this.objs = [].slice.call(collection);
    }
};
var projectData = {
    parentId: 'ppContainer',
    parentObj: null,
    objs: [],
    cp_ids: ['cp_latex'],
    cp_objs: [],
    pp_ids: ['pp_website','pp_diamond','pp_registration','pp_jvm','pp_android','pp_ios','pp_mouse','pp_cpu','pp_ochem'],
    pp_objsDate: [],
    pp_objsPride: [],
    pp_objsDifficulty: [],
    loadData: function() {
        this.parentObj = document.getElementById(this.parentId);
        for(var i = 0; i < this.cp_ids.length; i++) {
            var el = document.getElementById(this.cp_ids[i]);
            this.cp_objs.push(el);
            this.objs.push(el);
        }
        for(var i = 0; i < this.pp_ids.length; i++) {
            var el = document.getElementById(this.pp_ids[i]);
            this.pp_objsDate.push(el);
            this.objs.push(el);
        }
        // get pride sorted list
        this.pp_objsPride = this.pp_objsDate.slice();
        this.pp_objsPride.sort(function(a,b) {
            return Number(a.getAttribute('data-pride')) - Number(b.getAttribute('data-pride'));
        });
        // get difficulty sorted list
        this.pp_objsDifficulty = this.pp_objsDate.slice();
        this.pp_objsDifficulty.sort(function(a,b) {
            return Number(a.getAttribute('data-difficulty')) - Number(b.getAttribute('data-difficulty'));
        });
    }
};

/* Page initialization */
window.onload = function() {
    /* Load data for navigation variables */
    navData.loadData();
    linkData.loadData();
    dropDownData.loadData();
    projectData.loadData();
    
    /* Links, smooth scrolling, navbar sections functionality */
    linkData.objs.forEach(function(item) {
        item.addEventListener('click', linkClick);
    });
    updateSection(); // update section based on initial page location
    document.addEventListener("scroll", function() {
        // "active" class update
        updateSection();
    });
    
    /* Start typewrite effect from typewrite.js */
    startTypeWrite(typeData);
    
    /* Projects sort */
    dropDownData.objs.forEach(function(elem) {
        elem.addEventListener("click", expandDropdown) 
    });
    document.addEventListener("click", function() {
        unexpandDropdown();
    });
    
}


/**************************************************************/
/********************* Pulsating Resume ***********************/
/**************************************************************/
var pulsate = function(elem,start) {
    if(start) {
        elem.style.animation = "pulsate infinite 1s";
        
        setTimeout(function() {
            pulsate(elem,false); }, 3000);
    }
    else {
        elem.style.animation = "none";
    }
};


/**************************************************************/
/****** Navbar Transition Animation & Section Indicator ******/
/**************************************************************/

// TODO: At the end if have time.


/**************************************************************/
/****************  Navbar Section Indicator  ******************/
/**************************************************************/
var updateSection = function() {
    var windowHeight = document.clientHeight || window.innerHeight || document.body.clientHeight;
    var position = Math.round(getCurrentY() + windowHeight/2);
    for(var i = 0; i < navData.numNavLinks; i++) {
        // console.log(i + ': ' + position + ' ' + navData.sectionYPositions[i] + ' ' + navData.sectionYPositions[i+1]);
        if(i < navData.numNavLinks - 1 && 
           position >= navData.sectionYPositions[i] && 
           position < navData.sectionYPositions[i+1]) {
            linkData.objs[i].className = "active";
        } 
        else if( i === navData.numNavLinks - 1 &&
                   position >= navData.sectionYPositions[i]) {
            linkData.objs[i].className = "active";
        } 
        else {
            linkData.objs[i].className = "";
        }
    }
};



/**************************************************************/
/**********************  Smooth Scroll  ***********************/
/**************************************************************/

/* Link click to start scrolling */
var linkClick = function(e) {
    // Prevent link from jumping to the top of the page
    e.preventDefault();

    // Call our smooth scroll function (foreach can't break so use for)
    for(var i = 0; i < navData.sections.length; i++) {
        if(e.target === linkData.objs[i] || 
           e.target.parentElement === linkData.objs[i]) {
            smoothScrollTo(navData.objs[i]);
            if(i === 4) {
                pulsate(navData.objs[4],true);
            }
            break;
        }
    }
}

/* Returns the current window Y coordinate */
var getCurrentY = function() {
    if(self.pageYOffset) return self.pageYOffset;
    if(document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

/* Returns the destination coordinate wrt current coordinate */
var getOffsetFromY = function(elem) {
    var rect = elem.getBoundingClientRect();
    return rect.top;
}

/* Smooth scrolling function */
var smoothScrollTo = function(elem) {
    //get start Y, offset, distance, and dest Y coord values
    var startY = getCurrentY(),
        offset = getOffsetFromY(elem),
        dist = Math.abs(offset),
        destY = startY + offset;
    
    //if distance is close (<100px away) just jump to it and we done
    if(dist<100) {
        scrollTo(0,destY);
        return;
    }
    
    //calculate scroll duration based on distance (max=1000ms)
    var duration = Math.floor(dist/1.5);
    duration = duration>1000 ? 1000 : duration;
    
    
    var startTime = Date.now(),
        endTime = startTime + duration;
    
    //interpolation function for smooth jumps with time
    var smoothStep = function(start, end, point) {
        if(point <= start) return 0;
        if(point >= end) return 1;
        var p = (point - start) / (end - start);
        return p*p*(3-2*p);
    }
    
    var previousY = startY;
    var scrollTick = function() {
        // Check for interruptions in between scroll animations
        if (getCurrentY() != previousY) {
            console.log("Smooth scroll interrupted.");
            return;
        }
        
        var now = Date.now(),
            point = smoothStep(startTime,endTime,now),
            nextY = Math.round(startY + offset*point);
        document.scrollingElement.scrollTop = nextY;

        
        if(now >= endTime) {
            return;
        }
        previousY = nextY;
        
        // Schedule next frame
        window.setTimeout(scrollTick, 0);
    };
    scrollTick();
    updateSection();
};
    
/**************************************************************/
/**********************   Sort Projects   *********************/
/**************************************************************/

/* Dropdown Expansion added to click event listener */
var expandDropdown = function(e) {
    // prevent the execution of document click
    e.preventDefault();
    e.stopPropagation();
    // expand the dropdown 
    var targetElem = e.target.tagName === "LABEL" ? e.target.parentElement : e.target;
    targetElem.classList.toggle('expanded');
    // record selected element and sort projects
    var inputElem = document.getElementById(e.target.getAttribute("for"));
    if(!(inputElem.checked)) {
        inputElem.checked = true;
        sortProjects(inputElem.getAttribute("id"));
    }
}

/* Return dropdowns to initial state */
var unexpandDropdown = function() {
    dropDownData.objs.forEach(function(elem) {
       elem.classList.remove('expanded'); 
    });
}

/* Sorts div elements containing project descriptions */
var sortProjects = function(action) {
    
    projectData.objs.forEach(function(elem){
        elem.style.animation = "750ms fadeout";
    });
    
    setTimeout(function() {
        createNewProjSection(action);
    }, 700);
    
}

var createNewProjSection = function(action) {
    var newOrder = document.createDocumentFragment();
    var sortType = "";
    if(action === 'sort-date') {
        sortType = "pp_objsDate";
    }
    else if(action === 'sort-proudness') {
        sortType = "pp_objsPride";
    }
    else if(action === 'sort-difficulty') {
        sortType = "pp_objsDifficulty";
    }
    projectData[sortType].forEach(function(elem){
        newOrder.appendChild(document.createElement('hr'));
        elem.style.visibility = "hidden";
        newOrder.appendChild(elem); 
    });
    projectData.parentObj.innerHTML = null;
    projectData.parentObj.appendChild(newOrder);
    
    projectData.objs.forEach(function(elem){
        elem.style.animation = "750ms fadein";
    });
    
    setTimeout(function() {
        projectData.objs.forEach(function(elem){
            elem.style.visibility = "visible";
            elem.style.animation = "";
        });
    },750);
}




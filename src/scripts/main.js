function loadJSON() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.runtime.getURL("data/categories.json"));
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            window.extendedCategories = JSON.parse(xhr.responseText);
        }
    };
    xhr.send();
}

function init() {
    var exLi = document.createElement("li");
    exLi.className = "active hasSubMenu browse";
    exLi.id = "extended-netflix";
    exLi.innerHTML = '<span class="extended-netflix-title">Extended Netflix</span><span class="caret"></span><div class="callout-arrow"></div></li>';
    var target = document.querySelector("#hdPinTarget > ul");
    target.insertBefore(exLi, target.firstChild);

    var extendedNetflix = document.getElementById("extended-netflix");
    extendedNetflix.innerHTML +=
        '<div id="extended-netflix-menu" class="sub-menu genreNav hasSpecialItems">' +
            '<div id="extended-netflix-search-container" class="searchInput isOpen">' +
                '<span class="icon-search"></span>' +
                '<input type="text" id="extended-netflix-search" value="" placeholder="Search genres">' +
            '</div>' +
            '<div class="extended-netflix-list-wrapper">' +
                '<ul id="extended-netflix-list" class="sub-menu-list multi-column"></ul>' +
            '</div>' +
        '</div>';

    function build(value) {
        var categories = window.extendedCategories;
        var previousLetter = "";
        var extendedNetflixList = document.getElementById("extended-netflix-list");
        var builder = [];
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i].category;
            var matchValues = value.split(' ');
            var matchBool = true;
            for (var e = 0; e < matchValues.length; e++) {
                if (category.toLowerCase().indexOf(matchValues[e]) === -1) {
                    matchBool = false;
                    break;
                }
            }
            if (matchBool) {
                var href = categories[i].href;
                if (category.charAt(0) !== previousLetter) {
                    builder.push('<li class="sub-menu-item listings extended-netflix-heading"><h2>' + category.charAt(0) + '</h2><hr></li>');
                }
                builder.push('<li class="sub-menu-item listings extended-netflix-item"><a class="sub-menu-link" href="' + href + '">' + category + '</a></li>');
                previousLetter = category.charAt(0);
            }
        }
        if (builder.length === 0){
            builder.push('No matching genres...');
        }
        extendedNetflixList.innerHTML = builder.join('');
    }
    build('');

    var search = document.getElementById("extended-netflix-search");
    search.onkeyup = function (){
        build(search.value.toLowerCase());
    };
}

loadJSON();
setTimeout(function () {
    init();
}, 500);

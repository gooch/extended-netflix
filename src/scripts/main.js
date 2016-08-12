function loadJSON() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.runtime.getURL("data/categories.json"));
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            window.categories = JSON.parse(xhr.responseText);
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


    // Set previousLetter varibale for letter headings
    function build(value) {
        var categories = window.categories;
        var previousLetter = "";
        var extendedNetflixList = document.getElementById("extended-netflix-list");
        var builder = [];
        for (var name in categories) {
            if (categories.hasOwnProperty(name) && name.toLowerCase().indexOf(value) != -1) {
                var href = categories[name];
                if (name.charAt(0) !== previousLetter) {
                    builder.push('<li class="sub-menu-item listings extended-netflix-heading"><h2>' + name.charAt(0) + '</h2><hr></li>');
                }
                builder.push('<li class="sub-menu-item listings extended-netflix-item"><a class="sub-menu-link" href="' + href + '">' + name + '</a></li>');
                previousLetter = name.charAt(0);
            }
        }
        if (builder.length === 0){
            builder.push('No matching genres...');
        }
        extendedNetflixList.innerHTML = builder.join('');
    }
    build('');
    var x = new MutationObserver(function (e) {
        if (e[0].removedNodes) init();
    });

    x.observe(document.getElementById('extended-netflix'), {childList: true});
    var search = document.getElementById("extended-netflix-search");
    var timeout = null;
    search.onkeyup = function (){
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            build(search.value.toLowerCase());
        }, 300);
    };
}

loadJSON();
setTimeout(function () {
    init();
}, 100);

var quick_links = document.getElementById("quick_links");
var allSettings = document.querySelectorAll("input");
var openLinks = document.querySelector(".quickies");

if(localStorage.getItem("quick_links") == "true"){
    openLinks.style.display = "block";
}

function isUrl(val = ''){ // quick links
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function encodeUrl(str){
    // Used only for the DOM id of settings toggles (e.g. "quick_links"); has
    // nothing to do with proxying URLs anymore.
    if (!str) return str;
    return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

function updateLinks() {
    if(localStorage.getItem("quickLinkDetails") != null) {
        this.links = JSON.parse(localStorage.getItem("quickLinkDetails"));
    } else {return;}
    if(this.links.length == 0) {
        document.querySelector(".dropdown-links").innerHTML = '<a href="settings.html"><span class="material-symbols-outlined" style="font-size:14px;">add_circle</span>&nbsp;Add links in <span style="text-decoration: underline;">Settings</span></a>';
        return;
    }
    document.querySelector(".dropdown-links").innerHTML = "";
    for(var i=0;i<this.links.length;i++){
        this.newLink = document.createElement("a");
        this.newLink.href = "#";
        this.newLink.dataset.url = this.links[i][0];
        this.newLink.innerText = this.links[i][1];
        document.querySelector(".dropdown-links").appendChild(this.newLink);

        this.newLink.onclick = function () {
            if(document.getElementById('proxyFrame')){
                window.navigate(this.dataset.url);
            } else {
                window.location.href = '/main.html?open=' + encodeURIComponent(this.dataset.url);
            }
        }
    }
}

openLinks.querySelector(".add").onclick = function(){
    this.quickLinkUrl = prompt("Enter the url you want to add to your quick links (ex. google.com). Click CANCEL to go back:");
    if(this.quickLinkUrl == null){return}
    this.quickLinkUrl = this.quickLinkUrl.trim();
    if (!isUrl(this.quickLinkUrl)) this.quickLinkUrl = buildSearchUrl(this.quickLinkUrl);
    if (!(this.quickLinkUrl.startsWith('https://') || this.quickLinkUrl.startsWith('http://'))) this.quickLinkUrl = 'http://' + this.quickLinkUrl;
    this.quickLinkName = prompt("Enter the name you want for that URL (ex. Google). The name will be shown in 'Quick Links.' Click CANCEL to exit:");
    if(this.quickLinkName == null){return}
    this.currentLinks = localStorage.getItem("quickLinkDetails") == null ? [] : JSON.parse(localStorage.getItem("quickLinkDetails"));
    if (this.quickLinkName == "") this.quickLinkName = "No name set";
    this.currentLinks.push([this.quickLinkUrl, this.quickLinkName]);
    localStorage.setItem("quickLinkDetails", JSON.stringify(this.currentLinks));
    alert("Successfully added quick link.");

    updateLinks();
}

openLinks.querySelector(".rm").onclick = function(){
    if(localStorage.getItem("quickLinkDetails") == null) {
        alert("You have no quick links set.");
        return;
    }
    this.promptTxt = "Type the NUMBER of the quick link you want to remove. Below is a list of the your quick links:\n";
    for(var i=0;i<JSON.parse(localStorage.getItem("quickLinkDetails")).length;i++){
        this.promptTxt += "\n" + (i+1) + ": " + JSON.parse(localStorage.getItem("quickLinkDetails"))[i][1] + " - " + JSON.parse(localStorage.getItem("quickLinkDetails"))[i][0];
    }
    this.num = prompt(this.promptTxt);
    if((isNumeric(this.num) && this.num>0 && this.num <= JSON.parse(localStorage.getItem("quickLinkDetails")).length && JSON.parse(localStorage.getItem("quickLinkDetails"))[this.num-1].length == 2) == false) {this.continue = confirm("Invalid number.");return;}
    else {
        alert("Successfully deleted this quick link:\n\n" + this.num + ": " + JSON.parse(localStorage.getItem("quickLinkDetails"))[this.num-1][1] + " - " + JSON.parse(localStorage.getItem("quickLinkDetails"))[this.num-1][0]);
        this.newLinks = JSON.parse(localStorage.getItem("quickLinkDetails"));
        this.newLinks.splice(this.num-1,1);
        localStorage.setItem("quickLinkDetails", JSON.stringify(this.newLinks));
    }

    updateLinks();
}

for(var i=0;i<allSettings.length;i++){
    allSettings[i].checked = (localStorage.getItem(allSettings[i].id) != null ? localStorage.getItem(allSettings[i].id) == "true" : allSettings[i].checked);

    if(allSettings[i].checked == true){
        localStorage.setItem(allSettings[i].id, true);
    } else {
        localStorage.setItem(allSettings[i].id, false);
    }

    allSettings[i].onclick = function() {
        localStorage.setItem(this.id, this.checked);
        document.querySelector("#" + this.id + " + label + p").classList.remove("appear");
        void document.querySelector("#" + this.id + " + label + p").offsetWidth;
        document.querySelector("#" + this.id + " + label + p").classList.add("appear");

        if(this.id == "quick_links"){
            if(localStorage.getItem(this.id) == "true"){
                openLinks.style.display = "block";
                updateLinks();
            } else {
                openLinks.style.display = "none";
                document.querySelector(".dropdown-links").innerHTML = '<a href="settings.html"><span class="material-symbols-outlined" style="font-size:14px;">add_circle</span>&nbsp;Add links in <span style="text-decoration: underline;">Settings</span></a>';
            }
        }
    }
}

/* SEARCH ENGINE */

var engineSelect = document.getElementById("engine_select");

function populateEngineSelect(){
    var all = getAllEngines();
    var selected = localStorage.getItem("searchEngine") || builtInEngines[0][0];
    engineSelect.innerHTML = "";
    for(var i=0;i<all.length;i++){
        var opt = document.createElement("option");
        opt.value = all[i][0];
        opt.innerText = all[i][0];
        if(all[i][0] === selected) opt.selected = true;
        engineSelect.appendChild(opt);
    }
}

function showEngineSaved(){
    var saved = document.getElementById("engineSaved");
    saved.classList.remove("appear");
    void saved.offsetWidth;
    saved.classList.add("appear");
}

if(engineSelect){
    populateEngineSelect();

    engineSelect.onchange = function(){
        localStorage.setItem("searchEngine", this.value);
        showEngineSaved();
    };

    document.querySelector(".addEngine").onclick = function(){
        var name = prompt("Enter a name for this search engine (ex. Presearch):");
        if(name == null || name.trim() == "") return;
        name = name.trim();
        var url = prompt("Enter the search URL, with %s where the query should go.\n(ex. https://www.presearch.com/search?q=%s):");
        if(url == null) return;
        url = url.trim();
        if(url.indexOf("%s") === -1){
            alert("That URL needs a %s in it to mark where the search query goes.");
            return;
        }
        var current = getCustomEngines();
        current.push([name, url]);
        localStorage.setItem("customEngines", JSON.stringify(current));
        localStorage.setItem("searchEngine", name);
        populateEngineSelect();
        showEngineSaved();
        alert('Added "' + name + '" as a search engine.');
    };

    document.querySelector(".rmEngine").onclick = function(){
        var current = getCustomEngines();
        if(current.length === 0){
            alert("You haven't added any custom search engines.");
            return;
        }
        var listTxt = "Type the NUMBER of the custom engine you want to remove:\n";
        for(var i=0;i<current.length;i++){
            listTxt += "\n" + (i+1) + ": " + current[i][0] + " - " + current[i][1];
        }
        var num = prompt(listTxt);
        if(num == null) return;
        if(!isNumeric(num) || num < 1 || num > current.length){
            alert("Invalid number.");
            return;
        }
        var removed = current.splice(num-1, 1)[0];
        localStorage.setItem("customEngines", JSON.stringify(current));
        if(localStorage.getItem("searchEngine") === removed[0]){
            localStorage.setItem("searchEngine", builtInEngines[0][0]);
        }
        populateEngineSelect();
        showEngineSaved();
        alert('Removed "' + removed[0] + '".');
    };
}

/* PROXY ENGINE */

var proxySelect = document.getElementById("proxy_select");

if(proxySelect){
    proxySelect.value = localStorage.getItem("proxyEngine") || "ultraviolet";

    proxySelect.onchange = function(){
        localStorage.setItem("proxyEngine", this.value);
        // Lithium.js only loads a proxy engine's files once, at page load, so
        // switching engines needs a fresh init_lithium() call to take effect.
        localStorage.setItem("proxyTransport", "epoxy");
        var saved = document.getElementById("proxySaved");
        saved.classList.remove("appear");
        void saved.offsetWidth;
        saved.classList.add("appear");
        window.setTimeout(function(){
            window.location.reload();
        }, 900);
    };
}

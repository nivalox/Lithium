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
        this.newLink.id = encodeUrl(this.links[i][0]);
        this.newLink.innerText = this.links[i][1];
        document.querySelector(".dropdown-links").appendChild(this.newLink);

        this.newLink.onclick = function () {
            this.newFrame = document.createElement("iframe");
            this.newFrame.style.border = "none";
            this.newFrame.style.display = "none";
            this.newFrame.src = "go.html?new4";
            document.body.appendChild(this.newFrame);
            window.location.href = '/service/' + this.id;
        }
    }
}

openLinks.querySelector(".add").onclick = function(){
    this.quickLinkUrl = prompt("Enter the url you want to add to your quick links (ex. google.com). Click CANCEL to go back:");
    if(this.quickLinkUrl == null){return}
    this.quickLinkUrl = this.quickLinkUrl.trim();
    if (!isUrl(this.quickLinkUrl)) this.quickLinkUrl = 'https://www.google.com/search?q=' + this.quickLinkUrl;
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

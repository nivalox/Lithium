// Built-in search engine presets. %s is replaced with the encoded search query.
var builtInEngines = [
  ["Google", "https://www.google.com/search?q=%s"],
  ["Bing", "https://www.bing.com/search?q=%s"],
  ["DuckDuckGo", "https://duckduckgo.com/?q=%s"],
  ["Brave Search", "https://search.brave.com/search?q=%s"],
  ["Yahoo", "https://search.yahoo.com/search?p=%s"],
  ["Startpage", "https://www.startpage.com/sp/search?query=%s"],
  ["Ecosia", "https://www.ecosia.org/search?q=%s"],
];

function getCustomEngines(){
  return localStorage.getItem("customEngines") ? JSON.parse(localStorage.getItem("customEngines")) : [];
}

function getAllEngines(){
  return builtInEngines.concat(getCustomEngines());
}

function getSearchTemplate(){
  var all = getAllEngines();
  var selected = localStorage.getItem("searchEngine");
  for(var i=0;i<all.length;i++){
    if(all[i][0] === selected) return all[i][1];
  }
  return builtInEngines[0][1]; // default: Google
}

function buildSearchUrl(query){
  return getSearchTemplate().replace("%s", encodeURIComponent(query));
}

var search = document.getElementById("search");
var proxyFrame = document.getElementById("proxyFrame");
var proxyLoading = document.querySelector("#proxyLoading");
var homeLink = document.getElementById("homeLink");

function isUrl(val = ''){
  if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
  return false;
};

if(proxyFrame){
  proxyFrame.addEventListener('load', function(){
    document.body.classList.remove('proxy-loading');
  });
}

if(homeLink){
  homeLink.addEventListener('click', function(e){
    e.preventDefault();
    document.body.classList.remove('proxy-active', 'proxy-loading');
  });
}

function openProxy(input){
  var url = input.trim();
  if (!url) return;
  if (!isUrl(url)) url = buildSearchUrl(url); // custom search engine picker, see js/engines.js
  else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;

  document.body.classList.add('proxy-active', 'proxy-loading');
  if(proxyLoading){
    proxyLoading.querySelectorAll("span")[1].innerText = "loading content";
    window.setTimeout(function(){
      if(!document.body.classList.contains('proxy-loading')) return;
      proxyLoading.querySelectorAll("span")[1].innerText = "heavy server load may cause slowness";
    }, 2500);
    window.setTimeout(function(){
      if(!document.body.classList.contains('proxy-loading')) return;
      proxyLoading.querySelectorAll("span")[1].innerHTML = "there might be an error; join our <span style='text-decoration:underline;cursor:pointer;color:rgb(200,200,255);' onclick=\"window.open('https://discord.gg/hFZC5cgsmq', '_blank');\">discord</span> for support";
    }, 15000);
  }

  window.navigate(url);
}

function submitUrl(){
  if(/\S/.test(search.value)){
    openProxy(search.value);
  }
}

if(search){
  search.addEventListener('keydown', function onEvent(e) {
    if (e.key === "Enter"){ openProxy(search.value); }
    if (e.key === "Escape"){ search.blur(); }
  });
}

// Quick Links clicked from other pages land here via ?open=<url>
(function(){
  var params = new URLSearchParams(window.location.search);
  var openTarget = params.get('open');
  if(openTarget){
    openProxy(openTarget);
    window.history.replaceState({}, '', window.location.pathname);
  }
})();

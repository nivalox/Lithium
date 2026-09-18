var search = document.getElementById("search");
var loading = document.querySelector("#loading");

function submitUrl(prx){
  if(/\S/.test(search.value)){
    quickGo(search.value, prx);
  }
}

function decodeUrl(str){
  if (!str) return str;
  let [ input, ...search ] = str.split('?');

  return decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join('') + (search.length ? '?' + search.join('?') : '');
}

if(search){
  search.addEventListener('keydown', function onEvent(e) {
    if (e.key === "Enter"){uv(search.value)}
    if(e.key === "Escape"){search.blur()}
  });
}

/* ENCODING URL */

function encodeB64(str){
  str = str.toString();
  const b64chs = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');
  let u32;
  let c0;
  let c1;
  let c2;
  let asc = '';
  let pad = str.length % 3;

  for (let i = 0; i < str.length;) {
    if((c0 = str.charCodeAt(i++)) > 255 || (c1 = str.charCodeAt(i++)) > 255 || (c2 = str.charCodeAt(i++)) > 255)throw new TypeError('invalid character found');
    u32 = (c0 << 16) | (c1 << 8) | c2;
    asc += b64chs[u32 >> 18 & 63]
        + b64chs[u32 >> 12 & 63]
        + b64chs[u32 >> 6 & 63]
        + b64chs[u32 & 63];
  }

  return encodeURIComponent(pad ? asc.slice(0, pad - 3) + '==='.substr(pad) : asc);
}

function encodeXor(str){
  if (!str) return str;
  return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

/* GETTING URL */

function quickGo(url, prx){
  if(prx == "wm"){
    wm(defaultUrl(url));
  }
  else if(prx == "uv"){
    uv(url);
  }
}

function defaultUrl(url){
  if( !url.includes('.') && !url.startsWith('https://') && !url.startsWith('http://') ){
    this.url = buildSearchUrl(url);
  }
  else if (url.startsWith('https://')) {
    this.url = url;
  } else if(url.startsWith('http://')) {
    this.url = 'https://' + url.substring(7);
  } else if (url.startsWith('//')) {
    url = 'https:' + url;
  } else {
    this.url = 'https://' + url;
  }
  return this.url;
}

function isUrl(val = ''){ //uv
  if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
  return false;
};

/* BUTTON FUNCTIONS */

function uv(url) { // Open Ultraviolet
  loading.style.display = "flex";
  loading.querySelectorAll("span")[1].innerText = "loading content";
  window.setTimeout(function(){
    loading.querySelectorAll("span")[1].innerText = "heavy server load may cause slowness";
  }, 2500);
  window.setTimeout(function(){
    loading.querySelectorAll("span")[1].innerHTML = "there might be an error; join our <span style='text-decoration:underline;cursor:pointer;color:rgb(200,200,255);' onclick=\"window.open('https://discord.gg/hFZC5cgsmq', '_blank');\">discord</span> for support";
  }, 15000);
  window.navigator.serviceWorker.register('/sw.js', {
    scope: __uv$config.prefix
  }).then(() => {
    this.url = url.trim();
    if (!isUrl(this.url)) this.url = buildSearchUrl(this.url);
    else if (!(this.url.startsWith('https://') || this.url.startsWith('http://'))) this.url = 'http://' + this.url;
    if(url != ""){
      window.location.href = __uv$config.prefix + encodeXor(this.url);
    }
  });
}

function rh() { // Open Rammerhead
  wlh = window.location.hostname;
  window.location.href = "https://r." + (wlh.startsWith("www") ? wlh.substring(4) : wlh);
}

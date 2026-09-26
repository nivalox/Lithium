import { init_lithium, navigate, back, forward, reload } from "/client/index.js";

// Which proxy engine + transport to boot with. Settings writes these to
// localStorage; this file is what actually reads them and hands them to
// Lithium.js. Defaults to Ultraviolet/epoxy if nothing's been chosen yet.
var proxyChoice = localStorage.getItem("proxyEngine") || "ultraviolet";
var transportChoice = localStorage.getItem("proxyTransport") || "epoxy";

var readyPromise = init_lithium({
  proxy: proxyChoice,
  transport: transportChoice,
  onReady: function(){
    console.log("[lithium] ready:", proxyChoice, transportChoice);
  },
  onUrlChange: function(){
    // Fires on every navigation, for every proxy — the correct way to know
    // the proxied page actually landed, instead of guessing from iframe
    // load events (which don't fire consistently for in-proxy navigation).
    document.body.classList.remove('proxy-loading');
  },
}).catch(function(err){
  console.error("[lithium] init_lithium failed:", err);
  throw err;
});

// Every other (non-module) script on the site calls these instead of
// importing from the client module directly. They all wait on readyPromise
// so nothing tries to act before Lithium's finished loading the chosen
// proxy engine.
window.navigate = function(url){
  return readyPromise.then(function(){ return navigate(url); });
};
window.lithiumBack = function(){
  return readyPromise.then(function(){ return back(); });
};
window.lithiumForward = function(){
  return readyPromise.then(function(){ return forward(); });
};
window.lithiumReload = function(){
  document.body.classList.add('proxy-loading');
  return readyPromise.then(function(){ return reload(); });
};

import { init_lithium, navigate } from "/client/index.js";

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
}).catch(function(err){
  console.error("[lithium] init_lithium failed:", err);
  throw err;
});

// Every other (non-module) script on the site calls window.navigate(url)
// instead of importing navigate directly. This wrapper just makes sure
// nothing tries to navigate before Lithium has actually finished loading
// the chosen proxy engine.
window.navigate = function(url){
  return readyPromise.then(function(){
    return navigate(url);
  });
};

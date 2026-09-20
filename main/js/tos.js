function selectedBox(){
  document.querySelector(".err").style.display = "none";
}

function continueToSite(){
  if(document.getElementById("acceptTerms").checked == true){
    document.querySelector(".err").style.display = "none";
    document.querySelector(".tosBkg").style.display = "none";
    localStorage.setItem("acceptedTerms", "true");
  } else {
    document.querySelector(".err").style.display = "block";
  }
}

if(localStorage.getItem("acceptedTerms") == "true"){
  document.querySelector(".tosBkg").style.display = "none";
}

document.body.style.display = "block";

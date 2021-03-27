var habitants_clicker = document.getElementsByClassName("habitants_clicker")[0]; 
var hexit_button = document.getElementsByClassName("hexit")[0];

habitants_clicker.addEventListener("click" , function() {
    console.log(1)
    var hab = document.getElementsByClassName("hwrapper")[0];
    hab.style.display = "flex";
    hab.style.visibility  = "visible";
    hab.style.zIndex = "2";
    hab.style.position = "relative";
    habitants_clicker.style.zIndex = "0";
    document.getElementsByClassName("container")[0].style.backgroundImage="blur(5px)";



})

hexit_button.addEventListener("click", function(){

    var hab = document.getElementsByClassName("hwrapper")[0];
    hab.style.display ="none";
    hab.style.visibility = "hidden";
    habitants_clicker.style.zIndex = "1";
})

var dataSilo_clicker = document.getElementsByClassName("dataSilo_clicker")[0];
var dexit_button = document.getElementsByClassName("dexit")[0];

dataSilo_clicker.addEventListener("click" , function() {

    var dat = document.getElementsByClassName("dwrapper")[0];
    dat.style.display = "flex";
    dat.style.visibility  = "visible";
    dat.style.zIndex = "2";
    dat.style.position = "relative";
    dataSilo_clicker.style.zIndex = "0";
    document.getElementsByClassName("container")[0].style.backgroundImage="blur(5px)";


})

dexit_button.addEventListener("click", function(){
    var dat = document.getElementsByClassName("dwrapper")[0];
    dat.display = "none";
    dat.style.visibility = "hidden";
    dat.style.zIndex = "-1";
})
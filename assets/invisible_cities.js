var habitants_clicker = document.getElementsByClassName("habitants_clicker")[0]; 

habitants_clicker.addEventListener("click" , function() {
    console.log(1)
    document.getElementsByClassName("hwrapper")[0].style.visibility  = "visible";
    document.getElementsByClassName("hwrapper")[0].style.zIndex = "2";
    habitants_clicker.style.zIndex = "0";
    document.getElementsByClassName("bg-image")[0].style.zIndex = "-1";
    document.getElementsByClassName("bg-image")[0].style.filter = "blur(5px)";



})

var exit_button = document.getElementsByClassName("exit")[0];

exit_button.addEventListener("click", function(){

    document.getElementsByClassName("hwrapper")[0].style.visibility = "hidden";
    document.getElementsByClassName("bg-image")[0].style.zIndex = "2";
    document.getElementsByClassName("bg-image")[0].style.filter = "none";
})
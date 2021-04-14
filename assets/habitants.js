window.addEventListener("load", ()=>{

    const habitant = document.getElementsByClassName("habitant");
    const slidedown = document.getElementsByClassName("slidedown");

    for (let i=0; i<habitant.length; i++){
        habitant[i].addEventListener("click",
        function(){
            if(slidedown[i].classList.contains("hidden")){
            slidedown[i].classList.remove("hidden");
            }else{
                slidedown[i].classList.add("hidden");
            }
        }
        )
    }

});
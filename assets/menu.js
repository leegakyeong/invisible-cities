const hamburger  = document.getElementById("hamburger")

const menu = document.getElementsByClassName("menu-popup")[0]

hamburger.addEventListener("click", event=>{
    if(menu.classList.contains("hidden")){
        menu.classList.remove("hidden")
    }else{
        menu.classList.add("hidden")
    }
})

const eachPost = document.getElementsByClassName("invisible-cities-each-wrapper")

var currentpost = -1;

for(var i=0; i<eachPost.length; i++){
    eachPost[i].classList.add("hidden")
}

const author = document.getElementsByClassName("invisible-cities-gradient")

for(var i=0; i<author.length ; i++){
    author[i].addEventListener("click", event=> {
        var id = event.target.id || event.target.parentNode.id;
        var index = parseInt(id.substr(3,1)) -1
        opencontent(index)
    })
}

function opencontent(index){
    eachPost[index].classList.remove("hidden")
}

const back = document.getElementsByClassName("invisible-cities-each-exit")

for(var i=0; i< back.length; i++){
    back[i].addEventListener("click", event=>{
        for(var j=0; j<eachPost.length; j++){
            eachPost[j].classList.add("hidden")
        }
    })
}

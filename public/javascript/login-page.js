
document.querySelector("#register").addEventListener("click",()=>{
    console.log(document.querySelector(".triangle-log div"))
    document.querySelector(".triangle div").classList.remove("on-login-traingle-flip")
    document.querySelector(".triangle div").classList.add("on-register-traingle-flip")
    document.querySelector("#login").classList.remove("choosen")
    document.querySelector("#login").classList.add("not-choosen")
    document.querySelector("#register").classList.add("choosen")
    document.querySelector("#register").classList.remove("not-choosen")
})

document.querySelector("#login").addEventListener("click",()=>{
    console.log(document.querySelector(".triangle-log div"))
    document.querySelector(".triangle div").classList.remove("on-register-traingle-flip")
    document.querySelector(".triangle div").classList.add("on-login-traingle-flip")
    document.querySelector("#register").classList.remove("choosen")
    document.querySelector("#register").classList.add("not-choosen")
    document.querySelector("#login").classList.add("choosen")
    document.querySelector("#login").classList.remove("not-choosen")
})

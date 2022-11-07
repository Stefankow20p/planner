function turnOnLogin(){
    // console.log(document.querySelector(".triangle-log div"))
    document.querySelectorAll(".not-choosen").forEach(element => {
        element.removeEventListener("click",turnOnLogin)
    })
    document.querySelector(".triangle div").classList.remove("on-register-traingle-flip")
    document.querySelector(".triangle div").classList.add("on-login-traingle-flip")
    document.querySelector("#register").classList.remove("choosen")
    document.querySelector("#register").classList.add("not-choosen")
    document.querySelector("#login").classList.add("choosen")
    document.querySelector("#login").classList.remove("not-choosen")

    document.querySelectorAll(".not-choosen").forEach(element => {
        element.addEventListener("click",turnOnRegister)
    })
    document.querySelector(".reg").style.display="none"
    document.querySelector(".log").style.display="block"
}

function turnOnRegister(){
    // console.log(document.querySelector(".triangle-log div"))
    document.querySelectorAll(".not-choosen").forEach(element => {
        element.removeEventListener("click",turnOnRegister)
    })
    document.querySelector(".triangle div").classList.remove("on-login-traingle-flip")
    document.querySelector(".triangle div").classList.add("on-register-traingle-flip")
    document.querySelector("#login").classList.remove("choosen")
    document.querySelector("#login").classList.add("not-choosen")
    document.querySelector("#register").classList.add("choosen")
    document.querySelector("#register").classList.remove("not-choosen")

    document.querySelectorAll(".not-choosen").forEach(element => {
        element.addEventListener("click",turnOnLogin)
    })
    document.querySelector(".log").style.display="none"
    document.querySelector(".reg").style.display="block"
}
turnOnLogin()

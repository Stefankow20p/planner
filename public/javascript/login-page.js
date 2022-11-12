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


async function login()
{
    document.querySelectorAll(".error-box")[0].style.display="none"
    let login = document.querySelector("#log-log").value
    let password = document.querySelector("#log-pass").value
    //checks if form empty
    if(login.trim().length == 0 || password.trim().length == 0){
        document.querySelectorAll(".error-box")[0].style.display="flex"
        if(login.trim().length == 0 && password.trim().length == 0){
            document.querySelectorAll(".error-box")[0].querySelector("p").innerText = "Pola nie zostały wypełnione"
            return
        }
        document.querySelectorAll(".error-box")[0].querySelector("p").innerText = "Jedno z pól nie zostało wypełnione"
        return
    }
    const data = { 
        login : login,
        password : password
    }
    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }
    const res = await fetch("api/login", options)
    const results = await res.json()
    console.log(results)
    if(results.correct){
        let expirationDate = new Date(results.expirationDate)
        console.log(expirationDate)
        document.cookie = `token=${results.token}; expires=${expirationDate}`
    }else{
        document.querySelectorAll(".error-box")[0].style.display="flex"
        if(results.message == undefined){
            document.querySelectorAll(".error-box")[0].querySelector("p").innerText = "Brak informacji o błędzie, sprawdź konsole"
        }else{
            document.querySelectorAll(".error-box")[0].querySelector("p").innerText = results.message
        }
    }
}
document.querySelector("#log-btn").addEventListener("click",login)


// looks for cookie with login token
// console.log(document.cookie.split("="))
for (let i = 0; i < document.cookie.split(";").length; i++) {
    if(document.cookie.split(";")[i].split("=")[0].trim()=="token"){
        console.log(document.cookie.split(";")[i].split("=")[1])
    }
}
// document.cookie = "taaoken=32"
// console.log(document.cookie)

//going back page
document.querySelector("#go-back").addEventListener("click",()=>{
    window.location="./index.html"
})


//loging out on every device
document.querySelector("#log-out-all").addEventListener("click",async ()=>{
    for (let i = 0; i < document.cookie.split(";").length; i++) {
        if(document.cookie.split(";")[i].split("=")[0].trim()=="token"){
            // console.log(document.cookie.split(";")[i].split("=")[1])
            let token = document.cookie.split(";")[i].split("=")[1].trim()
            const data = { 
                token : token
            }
            const options = {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }
            const res = await fetch("api/logOutAll", options)
            let expirationDate = new Date("10-12-1990")
            document.cookie = `token=a; expires=${expirationDate}`
        }
    }


    window.location="./login.html"
})


//loging out
document.querySelector("#log-out").addEventListener("click",async ()=>{
    // looks for cookie with login token if it exists removes it, and sends it to server to terminate
    for (let i = 0; i < document.cookie.split(";").length; i++) {
        if(document.cookie.split(";")[i].split("=")[0].trim()=="token"){
            // console.log(document.cookie.split(";")[i].split("=")[1])
            let token = document.cookie.split(";")[i].split("=")[1].trim()
            const data = { 
                token : token
            }
            const options = {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }
            const res = await fetch("api/logOut", options)
            let expirationDate = new Date("10-12-1990")
            document.cookie = `token=a; expires=${expirationDate}`
        }
    }


    window.location="./login.html"
})





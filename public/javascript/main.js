//gets token
let TOKEN = ""
for (let i = 0; i < document.cookie.split(";").length; i++) {
    if(document.cookie.split(";")[i].split("=")[0].trim()=="token"){
        TOKEN = document.cookie.split(";")[i].split("=")[1]
        break
    }
}
if(TOKEN==""){
    window.location="./login.html"
}

function setCurrentDate(){
    let date = new Date()
    document.querySelector("#start-date").value = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
    date.setDate(date.getDate()+7)
    document.querySelector("#end-date").value = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ ( String(date.getDate()).length == 1 ? ("0"+date.getDate()) : date.getDate() ) 
}
setCurrentDate()


async function displayData(){
    const data = { 
        startDate : document.querySelector("#start-date").value,
        endDate : document.querySelector("#end-date").value,
        token : TOKEN
    }
    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }
    const res = await fetch("api/getDays", options)
    const results = await res.json()
    console.log(results)
}
displayData()
document.querySelector("#start-date").addEventListener("change",displayData)
document.querySelector("#end-date").addEventListener("change",displayData)


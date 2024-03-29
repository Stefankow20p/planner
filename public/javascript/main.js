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
    document.querySelector("#start-date").value = date.getFullYear()+"-"+( String(date.getMonth()+1).length == 1 ? ("0"+String(date.getMonth()+1)) : String(date.getMonth()+1) )+"-"+( String(date.getDate()).length == 1 ? ("0"+date.getDate()) : date.getDate() )
    date.setDate(date.getDate()+7)
    document.querySelector("#end-date").value = date.getFullYear()+"-"+( String(date.getMonth()+1).length == 1 ? ("0"+String(date.getMonth()+1)) : String(date.getMonth()+1) )+"-"+ ( String(date.getDate()).length == 1 ? ("0"+date.getDate()) : date.getDate() ) 
}
setCurrentDate()
//option page event listener
setTimeout(()=>{
    document.querySelector(".icon-profile").contentDocument.querySelector("svg").addEventListener("click",()=>{
        window.location="./options.html"
    })
},500)

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
    // console.log(results)
    document.querySelector(".error-box").style.display = "none"
    if(!results.correct){
        document.querySelector(".error-box").style.display = "flex"
        document.querySelector(".error-box").querySelector("p").innerText = results.message
    }else{
        const main = document.querySelector("#main")
        main.innerHTML = ""

        //gets the amount of days between dates
        let startDate = new Date(document.querySelector("#start-date").value)
        let endDate = new Date(document.querySelector("#end-date").value)
        // console.log(startDate)
        // console.log(endDate)
        let amountOfDays = (endDate.getTime() - startDate.getTime())/(3600000*24)
        // console.log(amountOfDays)
        for (let i = 0; i < amountOfDays; i++) {
            const day = document.createElement("div")
            day.classList.add("day")

            const header = document.createElement("div")
            header.classList.add("header")
            const date = document.createElement("div")
            date.classList.add("date")
            let temp = new Date(startDate)
            temp.setDate(temp.getDate()+i)
            date.innerText = ( String(temp.getDate()).length == 1 ? ("0"+temp.getDate()) : temp.getDate() ) +"."+( String(temp.getMonth()+1).length == 1 ? ("0"+String(temp.getMonth()+1)) : String(temp.getMonth()+1) )
            header.append(date)
            //saves data to session storage for further changes
            sessionStorage.setItem("days", JSON.stringify(results.data.days))
            //finds if data for the date exists
            let dataExists = false
            let dayId = null
            results.data.days.forEach(element => {
                let dayDate = new Date(element.date)
                if(!dataExists && dayDate.getFullYear() == temp.getFullYear() && dayDate.getMonth() == temp.getMonth() && dayDate.getDate() == temp.getDate()){
                    temp = ( String(temp.getDate()).length == 1 ? ("0"+temp.getDate()) : temp.getDate() ) +"."+( String(temp.getMonth()+1).length == 1 ? ("0"+String(temp.getMonth()+1)) : String(temp.getMonth()+1) )
                    dataExists = true
                    dayId = element.id
                }
            })

            const titleDay = document.createElement("div")
            titleDay.classList.add("title")
            titleDay.innerText = dataExists ? results.data.days[dayId].title : ""
            header.append(titleDay)
            //show more option will be added later
            header.innerHTML+=`<object data="images/icon_edit.svg" class="icon icon-edit"> </object>`
            setTimeout(()=>{
                day.querySelector(".icon-edit").contentDocument.querySelector("svg").addEventListener("click",async ()=>{
                    //if nothing exists in that day - creates one
                    if(dayId== null)
                    {
                        //creates a day in session storage
                        let date = new Date(startDate)
                        date.setDate(date.getDate()+i)
                        let days = JSON.parse(sessionStorage.getItem('days'))
                        days.push({
                            id : days.length,
                            title : "",
                            desc : null,
                            date : date,
                            records : [],
                            youtube : []
                        })
                        sessionStorage.setItem("days", JSON.stringify(days))
                        //sends request to create new day in database
                        createDay(date,document.querySelector(".error-box"))
                        //REQUEST SERVER TO CREATE DAY
                        //REPLACE TITLE WITH INPUT
                        //CREATE EMPTY RECORD
                        //ADD RECORD TO SESSIONSTORAGE
                        //REQUEST SERVER TO CREATE RECORD
                    }else{
                        //REPLACE RECORDS WITH EDITION FIELDS
                    }
                    // ADD "ADD RECORD" BUTTON
                },{once:true})
            },500)
            // header.innerHTML+=`<object data="images/icon_show_more.svg" class="icon icon-show-more"> </object><object data="images/icon_edit.svg" class="icon icon-edit"> </object>`
            day.append(header)
            const records = document.createElement("div")
            records.classList.add("records")
            if(dayId == null){
                const record = document.createElement("div")
                record.classList.add("record")

                const hour = document.createElement("div")
                hour.classList.add("time")
                record.append(hour)

                const thing = document.createElement("div")
                thing.classList.add("name")
                thing.innerText = "Kliknij edytuj by coś tu dodać"
                record.append(thing)

                records.append(record)
            }else{
                for (let j = 0; j < results.data.days[dayId].records.length; j++) {
                    const record = document.createElement("div")
                    record.classList.add("record")

                    const hour = document.createElement("div")
                    hour.classList.add("time")
                    hour.innerText = results.data.days[dayId].records[j].hour
                    record.append(hour)

                    const thing = document.createElement("div")
                    thing.classList.add("name")
                    thing.innerText = results.data.days[dayId].records[j].title
                    record.append(thing)

                    records.append(record)
                    const recordDesc = document.createElement("div")
                    recordDesc.classList.add("record-desc")
                    if(results.data.days[dayId].records[j].desc==null){ 
                        recordDesc.style.display = "none"
                    }else{
                        recordDesc.innerText=results.data.days[dayId].records[j].desc
                    }
                    
                }
            }
            if(dataExists && results.data.days[dayId].youtube.length>0){
                const record = document.createElement("div")
                record.classList.add("record")
                record.classList.add("list")
                const thing = document.createElement("p")
                thing.classList.add("name")
                thing.innerText = "Obejrzane filmy:"
                record.append(thing)
                

                
                for (let j = 0; j < results.data.days[dayId].youtube.length; j++) {
                    const thing = document.createElement("a")
                    thing.classList.add("name")
                    thing.classList.add("film-link")
                    thing.href = results.data.days[dayId].youtube[j]
                    thing.innerText = results.data.days[dayId].youtube[j]
                    record.append(thing)
                    
                }
                records.append(record)
            }
            
            day.append(records)
            main.append(day)
        }
        
    }
}
displayData()
document.querySelector("#start-date").addEventListener("change",displayData)
document.querySelector("#end-date").addEventListener("change",displayData)

async function createDay(date,errorBox){
    const data = { 
        date : date,
        token : TOKEN
    }
    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }
    const res = await fetch("api/createDay", options)
    const results = await res.json()
    console.log(results)


}
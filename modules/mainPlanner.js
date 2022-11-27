function sendDays(app, pool){
    app.post("/api/getDays", (req, res) =>{
        //ADD DATA VALIDATION HERE
        // console.log(req.body)
        pool.query(
            `SELECT * FROM tokens WHERE tokens.tokenValue = "${req.body.token}";`,
            (err, response) =>{
                if(err){
                    console.error(err)
                    return res.json({
                        correct : false,
                        message : "Błąd serwera"
                       })
                }
                if(response.length==0){
                    return res.json({
                        correct : false,
                        message : "Nieprawidłowe dane logowania"
                       })
                }
                // console.log(response)
                console.log(response[0].idUser)
                let userId = response[0].idUser
                console.log(userId)
                pool.query(
                    `SELECT * FROM diarydays LEFT JOIN records ON diarydays.idDay = records.idDay WHERE diarydays.idUser = ${userId} && diarydays.dayDate >= "${req.body.startDate}" && diarydays.dayDate <= "${req.body.endDate}";`,
                    (err, response) =>{
                        if(err){
                            console.error(err)
                            return res.json({
                                correct : false,
                                message : "Błąd serwera"
                               })
                        }
                        let data = {
                            days : []
                            }

                        //checks how many days there are, gives them an order
                        let dayIDs = []
                        let dayList = []
                        response.forEach(element => {
                            if(!dayIDs.includes(element.idDay)){
                                dayIDs.push(element.idDay)
                                dayList.push({
                                    originalID : element.idDay,
                                    title : element.dayTitle,
                                    desc : element.dayDescription,
                                    date : element.dayDate,
                                    newID : 0
                                })
                            }
                        })
                        if(dayList.length==0){
                            return res.json({
                                correct : true,
                                data : data
                               })
                        }else if(dayList == 1){
                            dayList[0].newID = 1
                        }
                        let sorted = false
                        while(!sorted)
                        {
                            sorted = true
                            for(i = 0;i<dayList.length-1;i++)
                            {
                                if(dayList[i].date>dayList[i+1])
                                {
                                    sorted = false
                                    [dayList[i], dayList[i+1]] = [dayList[i+1], dayList[i]]
                                }
                            }
                        }
                        for (let i = 0; i < dayList.length; i++) {
                            dayList[i].newID = i
                            
                        }
                        // fills the response with data
                        dayList.forEach(element => {
                            data.days.push({
                                id : element.newID,
                                title : element.title,
                                desc : element.desc,
                                date : element.date,
                                records : []
                            })
                        })
                        console.log(response)
                        response.forEach(row=>{
                            dayList.forEach(element => {
                                if(element.originalID == row.idDay){
                                    for (let i = 0; i < data.days.length; i++) {
                                        if(data.days[i].id == element.newID){
                                            if(row.hour != null){
                                                data.days[i].records.push({
                                                    hour : row.hour,
                                                    title : row.title,
                                                    desc : row.recordDescription
                                                })
                                            }
                                            
                                            break
                                        }
                                    }
                                }
                            })
                        })
                        //sorts hours
                        function compareHours(firstHour, secondHour){
                            //first>second = true
                            for (let i = 0; i < 5; i++) {
                                if(i!=2){
                                    if(parseInt(firstHour[i])<parseInt(secondHour[i])){
                                        return false
                                    }else if(parseInt(firstHour[i])>parseInt(secondHour[i])){
                                        return true
                                    }
                                }
                            }
                            return false
                        }
                        for (let i = 0; i < data.days.length; i++) {
                            sorted = false
                            while(!sorted){
                                sorted = true
                                for (let j = 0; j < data.days[i].records.length-1; j++) {
                                    if(compareHours(data.days[i].records[j].hour, data.days[i].records[j+1].hour))
                                    {
                                        [data.days[i].records[j], data.days[i].records[j+1]] = [data.days[i].records[j+1], data.days[i].records[j]]
                                        sorted = false
                                    }
                                    
                                }
                            }  
                        }

                        res.json({
                            correct : true,
                            data : data
                        })
                    })
            })
    })
}

module.exports.sendDays = sendDays
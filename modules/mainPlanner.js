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
                // console.log(response)
                console.log(response[0].idUser)
                let userId = response[0].idUser
                console.log(userId)
                pool.query(
                    `SELECT * FROM diarydays INNER JOIN records ON diarydays.idDay = records.idDay WHERE diarydays.idUser = ${userId} && diarydays.dayDate >= "${req.body.startDate}" && diarydays.dayDate <= "${req.body.endDate}";`,
                    (err, response) =>{
                        if(err){
                            console.error(err)
                            return res.json({
                                correct : false,
                                message : "Błąd serwera"
                               })
                        }
                        // console.log(response)
                        //how it should look like
                        // let data = {
                        //     days : [
                        //                 {
                        //                     date : "2022-26-11",
                        //                     title : "Fajny dzionek",
                        //                     desc : "fajny opis",
                        //                     records: [
                        //                         {
                        //                             hour : "09:00",
                        //                             title : "Wstanie",
                        //                             desc : "z fajnego lozka"
                        //                         },
                        //                         {
                        //                             hour : "09:30",
                        //                             title : "Sniadanie",
                        //                             desc : "smaczne"
                        //                         }
                        //                     ]
                        //                 }
                        //             ]
                        //     }
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
                        
                        
                        res.json({
                            data : data
                        })
                    })
            })
    })
}

module.exports.sendDays = sendDays
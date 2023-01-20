
function getYoutubeData(app, pool){
    app.post("/api/getYoutubeData", (req, res) => {
        console.log("aaa")
        //ADD DATA VALIDATION

        console.log(req.body)
        let link = req.body.link.split("&")[0]
        console.log(link)
        if(link.indexOf("watch")== -1){
            return res.json({
                correct : false,
                message : "Niepoprawny link"
               })
        }
        pool.query(
            `SELECT * FROM tokens WHERE tokens.tokenValue = "${req.body.token}" && tokens.expired = 0;`,
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
                let date = new Date()
                let today = date.getFullYear()+"-"+( String(date.getMonth()+1).length == 1 ? ("0"+String(date.getMonth()+1)) : String(date.getMonth()+1) )+"-"+( String(date.getDate()).length == 1 ? ("0"+date.getDate()) : date.getDate() ) 
                pool.query(
                    `INSERT INTO diarydays(idUser,dayDate,dayTitle,dayDescription) 
                    SELECT * FROM (SELECT ${userId} AS idUser, '${today}' AS dayDate,'' AS dayTitle,NULL AS dayDescription) AS temp
                    WHERE NOT EXISTS (
                                        SELECT * FROM diarydays 
                                       WHERE idUser = ${userId}
                                       AND diarydays.dayDate = "${today}"
                    ) 
                    LIMIT 1;`,
                    (err, response) =>{
                        if(err){
                            console.error(err)
                            return res.json({
                                correct : false,
                                message : "Błąd serwera"
                               })
                        }
                        pool.query(
                            `SELECT * FROM diarydays WHERE idUser = ${userId} && dayDate = "${today}";`,
                            (err, response) =>{
                                if(err){
                                    console.error(err)
                                    return res.json({
                                        correct : false,
                                        message : "Błąd serwera"
                                       })
                                }
                                let dayId = response[0].idDay
                                pool.query(
                                    `INSERT INTO daysyoutube(idDay,link) 
                                    SELECT * FROM (SELECT ${dayId} AS idDay, '${link}' AS link) AS temp
                                    WHERE NOT EXISTS (
                                        SELECT * FROM daysyoutube 
                                        WHERE idDay = ${dayId}
                                        AND link = "${link}"
                                    ) 
                                    LIMIT 1;`,
                                    (err, response) =>{
                                        if(err){
                                            console.error(err)
                                            return res.json({
                                                correct : false,
                                                message : "Błąd serwera"
                                               })
                                        }
                                        res.json({
                                            correct : true,
                                            message : "Zapisano"
                                           })
                                    })
                            })
                        
                        
                    })
            })
    }) 
}


module.exports.getYoutubeData = getYoutubeData



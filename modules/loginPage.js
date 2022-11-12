const crypto = require('crypto')



function login(app, pool){
    app.post("/api/login", (req, res) => {
        function tokenGeneration(res, idUser){
            console.log("Login attempt succeded")
            const token = crypto.randomBytes(256).toString('hex')
            console.log("Token : " + token)
            pool.query(
                `SELECT * FROM tokens WHERE tokens.tokenValue = "${token}"`,
                (err, response)=>{
                    if(err){
                        console.error(err)
                        return res.json({
                            correct : false,
                            message : "Błąd serwera"
                           })
                    }
                    if(response.length == 0){
                        let expirationDate = new Date()
                        expirationDate.setDate(expirationDate.getDate() + 365)
                        expirationDate = expirationDate.getFullYear()+"-"+expirationDate.getMonth()+"-"+expirationDate.getDate()
                        pool.query(
                            `INSERT INTO tokens(tokens.tokenValue,tokens.idUser,tokens.expirationDate,tokens.expired) VALUES("${token}",${idUser},"${expirationDate}",0)`,
                            (err, response)=>{
                                if(err){
                                    console.error(err)
                                    return res.json({
                                        correct : false,
                                        message : "Błąd serwera"
                                       })
                                }else{
                                    return res.json({
                                        correct : true,
                                        token : token,
                                        expirationDate : expirationDate
                                       })
                                }
                            }
                        )
                    }else{
                        tokenGeneration(res, userId)
                    }
                }
            )
        }
        console.log("------------")
        console.log("Login request")
        console.log(req.body)
    
        //data validation
    
    
        //gets login data
        pool.query(
            `SELECT * FROM users WHERE users.username = "${req.body.login}"  && users.passwordHash = SHA2('${req.body.password}',256);`,
            (err, response) =>{
                if(err){
                    console.error(err)
                    return res.json({
                        correct : false,
                        message : "Błąd serwera"
                       })
                }
                console.log(response)
                if(response.length == 0){
                    console.log("Login attempt failed")
                    return res.json({
                         correct : false,
                         message : "Nieprawidłowe dane logowania"
                        })
                }else{
                    //if data is correct runs recursive function that generates token and sends it to the user
                    tokenGeneration(res, response[0].idUser)
                }
            }
        )
    })
}

module.exports.login = login
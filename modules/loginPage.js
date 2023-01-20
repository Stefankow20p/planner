const crypto = require('crypto')
const validation = require('./validation.js')


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
        if(typeof req.body.login === 'undefined' || typeof req.body.password === 'undefined'){
            return res.json({
                correct : false,
                message : "Brak danych do logowania"
               })
        }
        let loginData = validation.dataForLoginValidation(req.body.login)
        let passwordData = validation.dataForLoginValidation(req.body.password)
        if(!loginData.correct){
            return res.json({
                correct : false,
                message : loginData.message
               })
        }
        if(!passwordData.correct){
            return res.json({
                correct : false,
                message : passwordData.message
               })
        }
    
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

function register(app, pool){

    function tokenGeneration(res, idUser){
        const token = crypto.randomBytes(256).toString('hex')
        console.log("Token : " + token)
        pool.query(
            `SELECT * FROM tokens WHERE tokens.tokenValue = "${token}"`,
            (err, response)=>{
                if(err){
                    console.error(err)
                    return res.json({
                        correct : false,
                        message : "Błąd serwera. Rejestracja zakończona pomyślnie, lecz nie udało się zalogować"
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
                                    message : "Błąd serwera. Rejestracja zakończona pomyślnie, lecz nie udało się zalogować"
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





    app.post("/api/register", (req, res) => {
        console.log("------------")
        console.log("Registration request")
        // console.log(req.body)
    
        //data validation
        if(typeof req.body.login === 'undefined' || typeof req.body.password1 === 'undefined' || typeof req.body.password2 === 'undefined'){
            return res.json({
                correct : false,
                message : "Brak danych do rejestracji"
               })
        }
        let loginData = validation.dataForRegisterValidation(req.body.login)
        let password1Data = validation.dataForRegisterValidation(req.body.password1)
        let password2Data = validation.dataForRegisterValidation(req.body.password2)
        
        if(!loginData.correct){
            return res.json({
                correct : false,
                message : loginData.message
               })
        }
        if(!password1Data.correct){
            return res.json({
                correct : false,
                message : password1Data.message
               })
        }
        if(!password2Data.correct){
            return res.json({
                correct : false,
                message : password2Data.message
               })
        }
        if(req.body.password1 != req.body.password2){
            return res.json({
                correct : false,
                message : "Hasła nie są takie same"
               })
        }

        //checks if username is taken
        pool.query(
            `SELECT * FROM users WHERE users.username = "${req.body.login}";`,
            (err, response) =>{
                if(err){
                    console.error(err)
                    return res.json({
                        correct : false,
                        message : "Błąd serwera"
                       })
                }
                console.log(response)
                if(response.length != 0){
                    console.log("Register attempt failed")
                    return res.json({
                         correct : false,
                         message : "Nazwa uzytkownika jest już zajęta"
                        })
                }else{
                    //saves user data in database
                    pool.query(
                        `INSERT INTO users(username,passwordHash) VALUES("${req.body.login}",SHA2('${req.body.password1}',256));`,
                        (err, response) =>{
                            if(err){
                                console.error(err)
                                return res.json({
                                    correct : false,
                                    message : "Błąd serwera"
                                   })
                            }
                            
                            console.log(response)
                            //gets user id
                            pool.query(
                                `SELECT * FROM users WHERE users.username = "${req.body.login}";`,
                                (err, response) =>{
                                    if(err){
                                        console.error(err)
                                        return res.json({
                                            correct : false,
                                            message : "Błąd serwera. Rejestracja zakończona pomyślnie, lecz nie udało się zalogować"
                                           })
                                    }
                                    if(response.length!=1){
                                        return res.json({
                                            correct : false,
                                            message : "Błąd serwera. Rejestracja zakończona pomyślnie, lecz nie udało się zalogować"
                                           })
                                    }
                                    //runs recursive function that generates token and sends it to the user
                                    tokenGeneration(res, response[0].idUser)

                                }
                            )
                        }
                    )
                }
            }
        )
    })
}


module.exports.login = login
module.exports.register = register
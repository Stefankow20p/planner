function logOut(app, pool){
    app.post("/api/logOut", (req, res) => {  
        //ADD DATA VALIDATION
        let token = req.body.token
        pool.query(
            `UPDATE tokens SET expired = 1 WHERE tokenValue = "${token}";`,
            (err, response) =>{
                res.end()
            }
        )

    })
}



function logOutAll(app, pool){
    app.post("/api/logOutAll", (req, res) => {  
        //ADD DATA VALIDATION
        //ADD OPTION WHERE YOU CANT LOGOUT FROM EXPIRED TOKEN
        let token = req.body.token
        pool.query(
            `UPDATE tokens SET expired = 1 WHERE tokens.idUser = (SELECT tokens.idUser FROM tokens WHERE tokenValue = "${token}" && expired = 0);`,
            (err, response) =>{
                // res.end()
                if(err){
                    console.error(err)
                    return res.json({
                        correct : false,
                        message : "Błąd serwera"
                       })
                }
                res.end()
            }
        )

    })
}

module.exports.logOut = logOut
module.exports.logOutAll = logOutAll
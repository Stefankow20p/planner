function dataForLoginValidation(login){
    let res = {
        message: "Niewłaściwe dane logowania",
        correct: false
    }
    if(login.length==0){
        return res
    }
    const pattern = /^[A-Za-z0-9!_=+/?,.]+$/
    if(!login.match(pattern)){
        return res
    }
    res.correct = true
    res.message = ""
    return res
}

function dataForRegisterValidation(login){
    let res = {
        message: "Niewłaściwe dane rejestracji",
        correct: false
    }
    if(login.length<8 || login.length>32){
        return res
    }
    const pattern = /^[A-Za-z0-9!_=+/?,.]+$/
    if(!login.match(pattern)){
        return res
    }
    res.correct = true
    res.message = ""
    return res
}

module.exports.dataForLoginValidation = dataForLoginValidation
module.exports.dataForRegisterValidation = dataForRegisterValidation
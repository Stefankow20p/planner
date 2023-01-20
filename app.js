console.log("server runs")

const express = require("express")
const sass = require('sass')
const fs = require('fs')
const mysql = require('mysql2')
const crypto = require('crypto')
//compiling and saving SASS to CSS
sass.compileAsync("public/style/style.scss").then((result,err)=>{
    if(result){
        fs.writeFile("public/style/style.css", result.css, (err) => {
            if (err){
                return console.error(err)
            }else{
                return console.log("SASS compiled")
            }
        })
    }else{
        return console.error(err)
    }
})

//basic express stuff
const app = express();
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening at port ${port}`))
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//database pool
const pool = mysql.createPool({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password : process.env.PASSWORD || '',
    database: process.env.DATABASE || 'planner',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: false
})


//login and registration

const loginPage = require('./modules/loginPage.js')
loginPage.login(app, pool)
loginPage.register(app, pool)


//main planner functions

const mainPlanner = require('./modules/mainPlanner.js')
mainPlanner.sendDays(app, pool)
mainPlanner.createDay(app, pool)



const logOut = require('./modules/logOut.js')
logOut.logOut(app, pool)
logOut.logOutAll(app, pool)


const youtube = require('./modules/youtube.js')
youtube.getYoutubeData(app,pool)
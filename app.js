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
                return console.log("SASS saved to CSS")
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
    host: 'localhost',
    user: 'root',
    database: 'planner',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


//test query to compare passwords
pool.query(
    'SELECT * FROM users',
    (err, res) =>{
        // console.log(res[0].passwordHash.toString('utf-8'))
        // console.log(crypto.createHash("sha256").update("Maria").digest().toString('hex'))
    }
)
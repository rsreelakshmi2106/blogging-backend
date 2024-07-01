require('dotenv').config()

const express = require('express')

const cors = require('cors')

const db = require('./DB/connection')

const router = require('./Routes/router')

const bgServer = express()

bgServer.use(cors())
bgServer.use(express.json())

bgServer.use(router)

bgServer.use('/uploads',express.static('./uploads'))

const PORT = 4000 || process.env.PORT

bgServer.listen(PORT,()=>{
    console.log("bgServer listening on the port "+PORT);
})

bgServer.get('/',(req,res)=>{
    res.send("Welcome to Blogging")
})
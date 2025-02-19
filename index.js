const express = require('express')
const cors = require('cors')
require('dotenv').config()
const router = require('./routes/router')
require('./database/dbConnection')

const ASNallaruchiServer = express()
ASNallaruchiServer.use(cors())
ASNallaruchiServer.use(express.json())
ASNallaruchiServer.use('/uploads',express.static('./uploads'))

ASNallaruchiServer.use(router)

const PORT=3000 || process.env.PORT

ASNallaruchiServer.listen(PORT,()=>{
    console.log(`my ASNalaruchiServer is runing in : ${PORT}`);
})

ASNallaruchiServer.get('/',(req,res)=>{
    res.status(200).send('My ASNalaruchiServer is runing in PORT!!!')
})
ASNallaruchiServer.post('/',(req,res)=>{
 res.status(200).send('POST request')   
})
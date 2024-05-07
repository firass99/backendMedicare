const express = require('express');
require('dotenv').config();
require('./config/connect');
const userApi=require('./routes/user')
const consultationApi=require('./routes/consultation')

const app=express()
app.use(express.json())
//this route MUST HAVE TO GET IMAGES
app.use('/avatarPatient',express.static('./uploads/patient'))
app.use('/avatarDocteur',express.static('./uploads/docteur'))


app.use('/user',userApi)
app.use('/consultation',consultationApi)




app.listen(3000,()=>{
    console.log('server works at 3000')
})
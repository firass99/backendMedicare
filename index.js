const express = require('express');
require('dotenv').config();
require('./config/connect');
const userApi=require('./routes/user')
const consultationApi=require('./routes/consultation')
const specialiteApi=require('./routes/specialite')
const notificationApi=require('./routes/notification')


const app=express()
app.use(express.json())

//this route MUST HAVE TO GET IMAGES
app.use('/getImage',express.static('./uploads'))


app.use('/user',userApi)
app.use('/consultation',consultationApi)
app.use('/specialite',specialiteApi)
app.use('/notification',notificationApi)


app.listen(3000,()=>{
    console.log('server works at 3000')
})
const express = require('express');
require('dotenv').config();
require('./config/connect');
const cors = require('cors')
const expressListEndpoints = require('express-list-endpoints');
const userApi=require('./routes/user')
const consultationApi=require('./routes/consultation')
const specialiteApi=require('./routes/specialite')
const notificationApi=require('./routes/notification')
const bodyParser = require('body-parser')


const app=express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
// parse application/x-www-form-urlencoded : to parse req of content type app
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//this route MUST HAVE TO GET IMAGES
app.use('/getImage',express.static('./uploads'))


app.use('/user',userApi)
app.use('/consultation',consultationApi)
app.use('/specialite',specialiteApi)
app.use('/notification',notificationApi)

//this will show all paths
const endpoints = expressListEndpoints(app);
endpoints.forEach(item => {
    console.log('Method :   '+ item.methods + '   <|||> '+ ' URL : ' +item.path);
});

app.listen(3000,()=>{
    console.log('server works at 3000')
})


const mongoose = require('mongoose');

mongoose.connect(process.env.DB)
    .then(
        ()=>{
            console.log('connected to DB')
        }
    ).catch(
        (error)=>{
            console.log(error)
        }
    )
module.exports=mongoose;
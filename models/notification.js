const mongoose = require('mongoose');

const schemaNotification= mongoose.Schema({
    id_User:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    description:{
        type:String,
        required: true
    }
})

const Notification= mongoose.model('Notification',schemaNotification)
module.exports=Notification





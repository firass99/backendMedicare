const mongoose = require('mongoose');

const schemaConsultation= mongoose.Schema({
    id_docteur:{type: String},
    id_patient:{type: String},
    date:{type: String},
    heure:{type:String},
    status:{type: String,default:"en cours"},
    id_payment:{type: String, default:"idadlam"}
    }
)
const Consultation=mongoose.model('Consultation', schemaConsultation)
module.exports=Consultation
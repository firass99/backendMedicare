const mongoose = require('mongoose');

const schemaConsultation= mongoose.Schema({
    id_docteur:{type: String},
    id_patient:{type: String},
    date:{type: String},
    heure:{type:String},
    status:{type: String,default:"en cours"},
    payer:{type: Boolean, default:false}
    }
)
const Consultation=mongoose.model('Consultation', schemaConsultation)
module.exports=Consultation
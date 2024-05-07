const mongoose = require('mongoose');

const schemaOrdonnance= mongoose.Schema(
{
    id_docteur:{        
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required:true
    },
    id_patient:{        
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required:true
    },
    titre:{type: String, required:true},
    description:{type: String }
})
const Ordonnance=mongoose.model('Ordonnance',schemaOrdonnance)
module.exports=Ordonnance


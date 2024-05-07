const mongoose = require('mongoose');

const specialiteSchema=mongoose.Schema({
    name:{type: String},
    about:{type:String}
})

const Specialite=mongoose.model('Specialite',specialiteSchema)
module.exports=Specialite
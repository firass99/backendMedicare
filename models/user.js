const mongoose = require('mongoose');
const Roles = ["patient", "docteur", "admin"];

const userSchema= mongoose.Schema(
{
    name:{type: String ,required: true },
    last_name:{type: String ,required: true },
    age:{type: Date ,required: true },
    email:{type: String ,required: true  },
    password:{type: String ,required: true },
    role:{type: String ,enum: Roles ,default: "patient"},
    phone:{type: String ,required:true },
    image:{type: String},
    // about& specialite with addred by admin
    about:{type: String ,required:[isDoctor,"About is required "]},
    specialite:{        
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Specialite',
        required:[isDoctor,"Specialité is required "]
    }}
    )
function isDoctor(){
    if (this.role=="docteur"){
        return true
    }
    return false
}

function isUser(){
    if (this.role!=="admin"){
        return true
    }
    return false
}

const User=mongoose.model('User',userSchema)
module.exports=User
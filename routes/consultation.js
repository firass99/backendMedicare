const express = require('express');
const router=express.Router();
const jwt = require('jsonwebtoken');
const moment= require('moment');
const Consultation=require('../models/consultation');
const Notification=require('../models/notification');




// ADD . R D V 
router.post('/add',async (req,res)=>{
    //get data -> create new instance -> save the new data 
        console.log("**** THIS IS RESULT *****");
        const  header=req.header('Authorization');
        const   data= req.body;
        token = header.split(' ')[1];
        tokenData =await jwt.verify(token, process.env.JWT_KEY);//secret key

        console.log({'TOKEN DATA': tokenData});  
        console.log({'REQUEST DATA': data});   
        console.log({'PARSED DATE ': Date.parse(data.dateT)});
        console.log({'PARSED TIME ': Date.parse(data.time)});

        dateCons=moment(data.dateT).format("DD/MM/YYYY");
        console.log(dateCons);
        console.log(data.time.toString());

        
        validCons= await Consultation.findOne({date:data.dateT, heure:data.time});
        //find() .length>0
        if(validCons){
            res.status(404).send({success:false,  message:"consulation is already taken"})
            console.log("consultation already taken "+ ' TAKE BY =>>' +validCons+ ' <== TAKE BY');

        }else {
            try {
                newCons= new Consultation({
                    id_docteur:data.id_docteur,
                    id_patient: tokenData._id,
                    date: data.dateT,
                    heure: data.time                  
                })
                saved=await  newCons.save()
                console.log("savedd "+saved );
                res.status(200).json({success:true, saved});
                //**save notification    ID DOCTOR  .  MUST .  BE OBJECT ID
                if(saved){
                    notif= new Notification({id_User:data.id_docteur, description:"une nouvelle consultation est ajoutée"})
                    notifSave= await notif.save()
                }
                } catch (err) {
                    res.status(500).send({success: false, message : "Fail to save"});                
                    console.log("Fail to save");
                    }
        }
        })



// GET RDV BY . I D
router.get('/get/:id',async(req,res)=>{
    try {
        id=req.params.id;
        rdv=await Consultation.findById(id)
        res.status(200).send(rdv)
    } catch (error) {
        res.status(404).send(error)
    }
})

// GET RDV BY . DOCTOR
router.get('/doctor',async(req,res)=>{
    try {
        id=req.params.id;
        rdv=await Consultation.find({id_docteur:req.body.id_docteur})
        res.status(200).send(rdv)
    } catch (error) {
        res.status(404).send(error)
    }
})


// GET . ALL . R D V
router.get('/all',async (req,res)=>{
    try {
        rdv= await Consultation.find()
        res.status(200).send(rdv)
    } catch (error) {
        res.status(400).send(error)
    }
})


//MISE A JOUR ACCOUNT
router.put('/update/:id',async(req,res)=>{
    try {
        id= req.params.id
        rdvData= req.body
        Rdv= await Consultation.findByIdAndUpdate({_id:id}, rdvData, {new :true})
        res.status(200).send({success:true, Rdv})
    } catch (err) {
        res.status(404).send({error: err})
    }
})


// Annuler R D V
router.delete('/delete/:id',async (req,res)=>{
    try {
        myId= req.params.id
        rdv = await Consultation.findByIdAndDelete(myId)
        res.status(200).send({success:true, message :"Consulation Supprimée "})
    } catch (err) {
        res.status(400).send({success: false, error: err})
        
    }
})



module.exports=router
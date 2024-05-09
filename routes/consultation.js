const express = require('express');
const router=express.Router();
const jwt = require('jsonwebtoken');
require('moment');
const Consultation=require('../models/consultation');




// ADD . R D V 
router.post('/add',async (req,res)=>{
    //get data -> create new instance -> save the new data 

        header=req.header('Authorization');
        data= req.body

        token = header.split(' ')[1];

        tokenData =await jwt.verify(token, process.env.JWT_KEY);//secret key
       
                //
        dateCons=moment(data.date,'DD-MM-YYYY')
        timeCons=moment(data.time,'HH:MM:SS')
        validCons= await Consultation.find({date:dateCons, time:timeCons })
        if(!valid){
            try {
                newCons= new Consultation({
                    id_docteur:data.id_docteur,
                    id_patient: tokenData._id,
                    date: dateCons,
                    heure: timeCons                  
                })
                saved= await newCons.save()
                res.status(200).send({success:true, new:true})

            } catch (err) {
                res.status(500).send({success: false, error: err})
            }

        }else{
            res.status(404).send({success:false, message: "Date et Heure invalid"})
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
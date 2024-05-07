const express = require('express');
const router=express.Router();

const Consultation=require('../models/consultation')




// ADD . R D V 
router.post('/add',async (req,res)=>{
    //get data -> create new instance -> save the new data 

    try {        
        newData =req.body;
        rdv= new Consultation(newData)
        console.log(newData)
        resp= await rdv.save()

        res.status(200).send( resp)
    } catch (error) {
        res.status(400).send(error
        )
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
        Rdv= await Consultation.findOneAndUpdate({_id:id},(rdvData))
        res.send(Rdv+"Updated")
    } catch (error) {
        res.send(error)
    }
})


// Annuler R D V
router.delete('/delete/:id',async (req,res)=>{
    try {
        myId= req.params.id
        rdv = await Consultation.findOneAndDelete({_id:myId})
        res.status(200).send(rdv)
    } catch (error) {
        res.status(400).send(error)
        
    }
})



module.exports=router
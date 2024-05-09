const express = require('express');
const router= express.Router();

const Specialite = require('../models/specialite');
const authMiddleware = require('../middlewares/authMiddleware');

// name, about
router.post('/add',async(req,res)=>{
    try {
        newData =req.body;
        newSpec= new Specialite(newData)
        resp= await newSpec.save()

        res.status(200).send({success:true, data:resp})
    } catch (err) {
        res.status(400).send({success:false,error:err})
        }
})


router.put('/update/:id',async(req,res)=>{
    try {
        id=req.params.id
        Data =req.body;
        Spec=await Specialite.findByIdAndUpdate({_id:id},Data,{new: true})

        res.status(200).send({success:true, data:Spec})
    } catch (err) {
        res.status(400).send({success:false,error:err})
        }
})


router.get('/all',async(req,res)=>{
    try {
        spec= await Specialite.find()
        res.status(200).send({success:true, data:spec})
    } catch (err) {
        res.status(400).send({success:false, error:err})
    }
})


router.get('/get/:id',authMiddleware,async(req,res)=>{
    try {
        id=req.params.id 
        spec= await Specialite.findById({'_id':id})
        res.status(200).send({success:true, data:spec})
    } catch (err) {
        res.status(400).send({success:false, error:err})
    }
})


router.delete('/delete/:id', async(req,res)=>{
    try {
        id=req.params.id
        spec= await Specialite.findByIdAndDelete({'_id':id})
        res.status(200).send({success:true, data: "Specialite Deleted"})        
    } catch (err) {
        res.status(400).send({success:false,error:err})
    }
})

//
module.exports=router
const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const Calender = require('../models/calender');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();



// add date
router.post('/add', isAdmin, async(req,res)=>{
    try {
        newData =req.body;
        newCalender= new Calender(newData)
        resp= await newCalender.save()

        res.status(200).send({success:true, data:resp})
    } catch (err) {
        res.status(400).send({success:false, error:err})
        }
})


router.put('/update/:id',isAdmin ,async(req,res)=>{
    try {
        id=req.params.id
        Data =req.body;
        Spec=await Specialite.findByIdAndUpdate({_id:id},Data,{new: true})

        res.status(200).send({success:true, data:Spec})
    } catch (err) {
        res.status(400).send({success:false,error:err})
        }
})








module.exports=router
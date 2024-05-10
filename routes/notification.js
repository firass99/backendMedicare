const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const Notification = require('../models/notification');
const router = express.Router();



router.put('/seen',authMiddleware,async(req,res)=>{

        header=req.header('Authorization')
        token=header.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);//secret key

        Notification.updateMany({id_docteur: decodedToken._id, seen: true}).then(
            (result) => {
            res.status(200).send("your Notifications marked as Seen")
        }).catch((err) => {
            res.status(400).send({error:err})
        })
})





module.exports=router
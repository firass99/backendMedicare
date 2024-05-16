const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const Notification = require('../models/notification');
const router = express.Router();



router.get('/all', authMiddleware, async (req, res) => {
    try {
        const header = req.header('Authorization');
        const token = header.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        const notifications = await Notification.find({ id_User: decodedToken._id, seen: false });

        if(notifications.length>0){
            res.status(200).send({ success: true, notifications });
        }
        else{
            res.status(200).send({ success: true, message: "You 0 notifications" });
        }
    } catch (err) {
        res.status(500).send({ success: false, error: err });
    }
});

router.put('/seen',authMiddleware,async(req,res)=>{

        header=req.header('Authorization')
        token=header.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);//secret key

        Notification.updateMany({id_User: decodedToken._id, seen: true}).then(
            (result) => {
            res.status(200).send("your Notifications marked as Seen")
        }).catch((err) => {
            res.status(400).send({error:err})
        })
})





module.exports=router
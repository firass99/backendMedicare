const mongoose = require('mongoose');

const calendrierSchema=mongoose.Schema({
    date:{type: String, required:true},
    isAvailable:{type:Boolean, required:true}
})

/**
     const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
 */

const Calendrier=mongoose.model('Calendrier',specialiteSchema)
module.exports=Calendrier
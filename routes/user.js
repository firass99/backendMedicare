const express = require('express'); 
const router=express.Router();

const User = require('../models/user');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const moment = require('moment');
const isAdmin = require('../middlewares/isAdmin');
const authMiddleware = require('../middlewares/authMiddleware');
const Specialite = require('../models/specialite');

////// START UPLOAD FILE
filename=''
const myStorage=multer.diskStorage({
    //2params
    destination:'./uploads/',

    // 3 params req , file ,where to redirect :: this function create the file name
    filename:(req,file,redirect)=>{
        let date=Date.now()
        let fle=date+'.'+file.mimetype.split('/')[1];
        redirect(null,fle)
        filename=fle
    }
})
    //et create middleare now  EZ
const upload=multer({storage:myStorage});
//// END UPLOAD FILE



router.post('/register',upload.any('image'),async (req,res)=>{
    let data=req.body
    let usr= new User(data)
///////

    userExist= User.findOne({email: data.email})
    if(userExist){
        res.status(400).send({message: "User already exists"})
    }else{

        if(filename.length>0){
            usr.image=filename
        }else{
            usr.image="default.jpeg"
        }
        //ageeing
        usr.age=moment(data.age,'YYYY-MM-DD')
        //CRYPT PASSWORD
        salt=bcrypt.genSaltSync(10)
        usr.password= await bcrypt.hashSync(data.password, salt)

        usr.save().then((saved)=>{
            filename=''
            res.status(200).send({success:true, data:saved})
        }).catch((err)=>{
            res.status(400).send({success:false, error:err})
        })
}


//////
    

})



router.post('/login',async (req,res)=>{
    data=req.body

    user= await User.findOne({email:data.email})
    if(!user){
        res.status(404).send('#Email or  Password Invalid')
    }else{
            //comapre data pass to UserFinded pass
        validPass= bcrypt.compareSync(data.password, user.password)
        if(!validPass){
            // 401 : unauthorized
            res.status(401).send('Email or  #Password Invalid')
        }else{
            /**IF Email & Pass Valid : 
                1) create token & send
            */
            payload={
                _id:user.id,
                email:user.email,
                role:user.role
            }
            secret= process.env.JWT_KEY
            token=jwt.sign(payload,secret,{expiresIn:'1d'})
            res.status(200).send({success:true, jwtToken:token })

        }}
})

router.post('/logout',authMiddleware,(req,res)=>{
        const token = req.header('Authorization');
        const tokenData = token.split(' ')[1];

        const decodedToken = jwt.verify(tokenData, process.env.JWT_KEY);//secret key
        decodedToken.exp=0;
        decodedToken.expiresIn='0d';
        res.send({data:decodedToken})

        req.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).send({ message: 'You are logged out!' });

})



router.post('/create/doctor' ,isAdmin, async(req,res)=>{
    const data= req.body;

    userExist= await User.findOne({email: data.email});
    console.log(userExist)
    if(userExist){
     return   res.status(400).send({message: "Doctor Email already exists"})
    }else{
        try {
            doct= new User({
                name:data.name,
                last_name:data.last_name,
                age:data.age,
                email:data.email,
                password:data.password,
                role:"docteur",
                phone:data.phone,
                image:"default.png",
                specialite:data.specialite,
                about:"this is default doctor description"
                })
            saved= await doct.save()
            res.status(200).send({success: true, "new Doctor" : saved})    
    
        } catch (err) {
            res.status(400).send({success:false, error:err})
        }
    }
    
})



//GET ALL with async and await ( allways try catch blocs first)
router.get('/users',async(req,res)=>{
    try{
         Data = await User.find()
         res.status(200).send(Data)
    }
    catch{(error)=>{
        res.status(404).send(error)
    }}
})


//GET ALL DOCTORS with async and await ( allways try catch blocs first)
router.get('/doctors',async(req,res)=>{
    try{
         Data = await User.find({role:'docteur'})
         res.status(200).send(Data)
    }
    catch{(error)=>{
        res.status(404).send(error)
    }}
})


//GET Doctor BY ID try catch, when user OPERATIION.then() : then drops a resolved value to treat
router.get('/doctor/:id',async (req,res)=>{
    try {
        myId= req.params.id;
//      Data= User.findOne('params') ==> first bely nheb, f object params
        Data= await User.find({_id:myId, role:'docteur'})
        res.status(200).send(Data)
    } catch (error) {
        res.status(404).send(error)
    }
})


//GET USER BY ID try catch, when user OPERATIION.then() : then drops a resolved value to treat
router.get('/get/:id',async (req,res)=>{
    try {
        myId= req.params.id;
//      Data= User.findOne('params') ==> first bely nheb, f object params
        Data= await User.findById(myId)
        res.status(200).send(Data)
    } catch (error) {
        res.status(404).send(error)
    }
})


//DELETE ACCOUNT METHOD BY REQUEST BY ID 
router.delete('/delete/:id', async(req,res)=>{

    try {
        myId= req.params.id
        UserDel = await User.findByIdAndDelete(myId)

        res.send('User Deleted Successfully')
    } catch (error) {
        res.send(error)
    }
})

//MISE A JOUR ACCOUNT
router.put('/update/:id',upload.any('image'),async(req,res)=>{
    try {
        id= req.params.id
        imgNew= req.body.image 
        UserData= req.body
        
        if(filename.length>0){
            UserData.image=filename
        }
        if(UserData.password.length>0){
        salt=bcrypt.genSaltSync(10)
        UserData.password= await bcrypt.hashSync(UserData.password, salt)
        }

        Usr= await User.findOneAndUpdate({_id:id},UserData,{new: true})
        filename=''
        
        res.status(200).send({success:true, Usr})
    } catch (err) {
        res.status(404).send({error: err})
    }
})




module.exports=router
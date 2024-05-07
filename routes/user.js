const express = require('express'); 
const router=express.Router();

const User = require('../models/user');
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer');

////// START UPLOAD FILE
filename=''
const myStorage=multer.diskStorage({
    //2params
    destination:'./uploads',

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



router.post('/register',async (req,res)=>{
    //REQ DATA
    data=req.body
    //CREATE  INSTANCE
    usr=new User({
        name:data.name,
        last_name:data.last_name,
        age:data.age,
        email:data.age,
        password:data.password,
        phone:data.phone,
        image:"default.jpeg"

    })

    if(data.role ){
        usr.role=data.role;
        //usr.specialite=data.specialite;
    }  

    //CRYPT PASSWORD
    //1) create HashKey
    salt=bcrypt.genSaltSync(10)
    //2) hash password
    usr.password= await bcrypt.hashSync(data.password, salt)

    usr.save().then((saved)=>{
        res.status(200).send(saved)
    }).catch((error)=>{
        res.status(400).send(error)
    })
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
            secret= process.env.SECRET_KEY
            token=jwt.sign(payload,secret,{expiresIn:'1d'})
            res.status(200).send({success:true, jwtToken:token })

        }}
})

router.post('/logout',(req,res)=>{
    data=req.body
    const decodedToken = jwt.verify(tokenData, process.env.secret);//secret key
    decodedToken.expiresIn='';

})

//GET ALL with async and await ( allways try catch blocs first)
router.get('/getAll',async(req,res)=>{
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
        Data= await User.find({_id:myId,role:'docteur'})
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
router.put('/update/:id',async(req,res)=>{
    try {
        id= req.params.id
        UserData= req.body
        Usr= await User.findOneAndUpdate({_id:id},(UserData))
        res.send(Usr+"Updated")
    } catch (error) {
        res.send(error)
        
    }
})




module.exports=router
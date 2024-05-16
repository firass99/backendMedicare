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
    let data=req.body;
    let usr= new User(data);

    userExist= await User.findOne({email: data.email})
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

})


// Login
router.post('/login', async (req, res) => {
    const data = req.body;

    try {
        const user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(404).send({ error: '##Email or Password Invalid' });
        }

        const validPass = bcrypt.compareSync(data.password, user.password);
        if (!validPass) {
            return res.status(401).send({ error: 'Email or ##Password Invalid' });
        }

        const payload = {
            _id: user.id,
            email: user.email,
            role: user.role
        };
        const secret = process.env.JWT_KEY;
        const token = jwt.sign(payload, secret, { expiresIn: '1d' });
        res.status(200).send({ success: true, jwtToken: token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});



/** login
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
*/

router.post('/logout', authMiddleware, (req, res) => {
    const token = req.header('Authorization');
    const tokenData = token.split(' ')[1];

    // Invalidate the token by setting a shorter expiration time
    const decodedToken = jwt.verify(tokenData, process.env.JWT_KEY, { ignoreExpiration: true });
    const invalidatedToken = jwt.sign({ ...decodedToken, exp: Math.floor(Date.now() / 1000) }, process.env.JWT_KEY);
    
    // Set the token as an empty string or send it to the client for them to clear it
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.status(200).send({ message: 'You are logged out!', invalidToken: invalidatedToken });
});


/*
router.post('/logout',authMiddleware,(req,res)=>{
        const token = req.header('Authorization');
        const tokenData = token.split(' ')[1];

        const decodedToken = jwt.verify(tokenData, process.env.JWT_KEY);//secret key
        decodedToken.exp=0;
        decodedToken.expiresIn='0d';
//        res.send({data:decodedToken})
          console.log({data:decodedToken});

        req.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).send({ message: 'You are logged out!' });

})*/


//add doctor 
router.post('/create/doctor' ,isAdmin, async(req,res)=>{
    const data= req.body;

    userExist= await User.findOne({email: data.email});
    console.log(userExist)
    if(userExist){
     return   res.status(400).send({message: "Doctor Email already exists"})
    }else{

        //CRYPT PASSWORD
        salt=bcrypt.genSaltSync(10)
        hashPass= await bcrypt.hashSync(data.password, salt)

        try {
            doct= new User({
                name:data.name,
                last_name:data.last_name,
                age:data.age,
                email:data.email,
                password:hashPass,
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
router.get('/doctors',isAdmin, async(req,res)=>{
    try{
         Data = await User.find({role:'docteur'})
         res.status(200).send(Data)
    }
    catch{(error)=>{
        res.status(404).send(error)
    }}
})


//GET Doctor BY ID try catch, when user OPERATIION.then() : then drops a resolved value to treat
router.get('/doctor/:id',isAdmin ,async (req,res)=>{
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
router.get('/get/:id',isAdmin, async (req,res)=>{
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
router.delete('/delete/:id',isAdmin , async(req,res)=>{

    try {
        myId= req.params.id
        UserDel = await User.findByIdAndDelete(myId)

        res.send('User Deleted Successfully')
    } catch (error) {
        res.send(error)
    }
})

//MISE A JOUR ACCOUNT
router.put('/update', authMiddleware, upload.any('image'), async (req, res) => {
    const token = req.header('Authorization');
    const tokenData = token.split(' ')[1];
    const decodedToken = jwt.verify(tokenData, process.env.JWT_KEY);

    try {
        const id = decodedToken._id;
        const userData = req.body;

        // Check if there's a file uploaded for the image
        if(filename.length>0){
            userData.image=filename
        }

        // Chech password 
        if (userData.password && userData.password.length > 0) {
            const salt = bcrypt.genSaltSync(10);
            userData.password = bcrypt.hashSync(userData.password, salt);
        }

        const updatedUser = await User.findOneAndUpdate({ _id: id }, userData, { new: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        filename=''
        res.status(200).send({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});



module.exports=router
const jwt = require('jsonwebtoken');

//next khatro middlware maandouch retour
const isAdmin = (req,res,next) =>{
//header c'est la partie identification de la requete
    const token = req.header('Authorization');

    try{
        //extraction du token la partie 1(khater 3ana bearer token donc bch nekhdhou juste token heka 3leh 3mlna split)
        const tokenData = token.split(' ')[1];
        const decodedToken = jwt.verify(tokenData, process.env.JWT_KEY);//secret key
        if(decodedToken.role=="admin"){
            next();
            req.userId=decodedToken._id;
        }
    }catch(error){
        return res.status(401).send('Non Authorized');
    }
}

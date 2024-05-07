const jwt = require('jsonwebtoken');

//next khatro middlware maandouch retour
const authMiddleware = (req,res,next) =>{
//header c'est la partie identification de la requete
    const token = req.header('Authorization');
    if(!token || !token.startsWith('Bearer')){
        return res.status(401).send('Authentification failed: invalid token');
    }
    try{
        //extraction du token la partie 1(khater 3ana bearer token donc bch nekhdhou juste token heka 3leh 3mlna split)
        const tokenData = token.split(' ')[1];
        const decodedToken = jwt.verify(tokenData, process.env.secret);//secret key
        //zedna aatribut f west requete
        req.userId=decodedToken._id;
        next();
    }catch(error){
        return res.status(401).send('Authentification failed');
    }
}





/**function authJwt() {
  const secret = process.env.secret;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  });
}
*/
module.exports = authMiddleware;
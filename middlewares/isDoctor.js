const jwt = require('jsonwebtoken');

const isDoctor = (req, res, next) => {
    const token = req.header('Authorization');

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_KEY);
        if (decodedToken.role === "docteur") {
            req.userId = decodedToken._id;
            next();
            return;
        }
    } catch (error) {
        return res.status(401).send('You are not authorized to access Docteur resource.');
    }
    return res.status(401).send('You are not authorized to access Docteuur resource.');
};

module.exports = isDoctor;




/**
 * 
 * 
 * const jwt = require('jsonwebtoken');

//next khatro middlware maandouch retour
const isDoctor = (req,res,next) =>{
//header c'est la partie identification de la requete
    const token = req.header('Authorization');

    try{
        //extraction du token la partie 1(khater 3ana bearer token donc bch nekhdhou juste token heka 3leh 3mlna split)
        const tokenData = token.split(' ')[1];
        const decodedToken = jwt.verify(tokenData, process.env.JWT_KEY);//secret key
        if(decodedToken.role=="docteur"){
            req.userId=decodedToken._id;
            next();
        }
    }catch(error){
        return res.status(401).send('Your Not Docteur');
    }
}


module.exports= isAdmin;

//////////
const jwt = require('jsonwebtoken');

const isDoctor = (req, res, next) => {

    const token = req.header('Authorization');
    try {
        if (!token) {
            throw new Error('Authorization header missing');
        }

        const tokenData = token.split(' ')[1];
        const decodedToken = jwt.verify(tokenData, process.env.JWT_KEY);

        if (decodedToken.role === "docteur") {
            req.userId = decodedToken._id;
            return next();
        } else {
            throw new Error('You are not authorized to Doctor Funcs');
        }
    } catch (error) {
        return res.status(401).json({ error: error.message || 'Unauthorized' });
    }
}

module.exports = isDoctor; */
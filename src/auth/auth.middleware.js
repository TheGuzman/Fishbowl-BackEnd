import jwt from 'jsonwebtoken';
import { secret } from './auth.secret.js'

export const validateJWTAuth = (req,res,next)=>{

    const headerAuth = req.get('Autorization')
    const jwtToken = headerAuth?.split(' ')[1];

    try{
        const jwtDecoded = jwt.verify(jwtToken,secret);
        req.email = jwtDecoded.user
        next()
    }
    catch(err){
        console.log(err)
        res.status(401).send('User has not a valid token')
    }
}
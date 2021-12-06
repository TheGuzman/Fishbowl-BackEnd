import jwt from 'jsonwebtoken';
import { secret } from './auth.secret.js'

export const validateJWTAuth = (req,res,next)=>{

    const headerAuth = req.get('Authorization')
    const jwtToken = headerAuth?.split(' ')[1];


    try{
        const jwtDecoded = jwt.verify(jwtToken,secret);
        console.log(jwtDecoded)
        req.userEmail = jwtDecoded.user
        console.log('valid log in from validateJWTAuth middleware')
        next()
    }
    catch(err){
        console.log(err)
        res.status(401).send('User has not a valid token')
        console.log('Invalid log in from validateJWTAuth middleware')
    }
}
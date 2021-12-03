import jwt from 'jsonwebtoken';
import { registerUser } from '../user/user.model.js';
import { secret } from './auth.secret.js'
import { getUserInfoByEmail } from './auth.model.js';
import { registerToken } from "./auth.model.js";
import { encodePassword, generateRandomEmailToken } from './auth.utils.js';
import { sendMail } from '../adapters/mail.js'; 

export const loginJWTController  = (req,res)=>{

//     const {email, password} = req.body;

//     const passEnconded = encodePassword(password)
//     const userInfo = await getUserInfoByEmailAndPassword(email, passEnconded)

//     if(userInfo!==null){
//         const token = jwt.sign ({ user:email }, secret);
//         res.send({
//             access_token: token
//         });
//     } 
//     else{
//         res.status (404).send('Wrong UserName or Password')
//     }
}

export const registerUserController = async (req, res)=>{

    const{ userName, userEmail, userPassword } = req.body;
    const userInfo =  await getUserInfoByEmail(userEmail)
    if(userInfo===null){
        const passEnconded = encodePassword(userPassword)
        if(registerUser(userName, userEmail, userPassword)){
            const tokenEmailVerification = generateRandomEmailToken();
            registerToken(tokenEmailVerification, userEmail);
            sendMail(userEmail, 'Verifica tu cuenta para seguir con el registro', `<a href="http://localhost:3000/validate-mail?token=${tokenEmailVerification}">Verificar</a>`)
            res.status(201).send('user registered');
        }
    }else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(409).send('El usuario ya existe');
    }
}
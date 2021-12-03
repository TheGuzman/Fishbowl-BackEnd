import jwt from 'jsonwebtoken';
import { registerUser, updateUserMailVerification } from '../user/user.model.js';
import { secret } from './auth.secret.js'
import { getUserInfoByEmail } from './auth.model.js';
import { registerToken, validateToken } from "./auth.model.js";
import { encodePassword, generateRandomEmailToken } from './auth.utils.js';
import { sendMail } from '../adapters/mail.js'; 

export const loginJWTController  = (req,res)=>{

    // const {email, password} = req.body;

    // const passEnconded = encodePassword(password)
    // const userInfo = await getUserInfoByEmailAndPassword(email, passEnconded)

    // if(userInfo!==null){
    //     const token = jwt.sign ({ user:email }, secret);
    //     res.send({
    //         access_token: token
    //     });
    // } 
    // else{
    //     res.status (404).send('Wrong UserName or Password')
    // }
}

export const registerUserController = async (req, res)=>{

    const{ userName, userEmail, userPassword } = req.body;


    const userInfo =  await getUserInfoByEmail(userEmail)
    if(userInfo===null){
        const passEnconded = encodePassword(userPassword)
        if(registerUser(userName, userEmail, passEnconded)){
            const tokenEmailVerification = generateRandomEmailToken();
            registerToken(tokenEmailVerification, userEmail);
            sendMail(userEmail, 'Verifica tu cuenta para seguir con el registro', `<h2>Fishbowl APP</h2><h4>Welcome to the Fishbowl app, please continue your registration by confirming your email account with the link below.</h4><a href="http://localhost:3000/validate-mail?token=${tokenEmailVerification}">Verify your email address</a>`)
            res.status(201).send('user registered');
        }
    }else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(409).send('El usuario ya existe');
    }
}

export const validateUserController = async (req, res) => {
    // llamo a mi modelo para que me diga si el token es valido o no
    const email = await validateToken(req.query.token);
    // si existe email es que es válido, sino no es válido
    if (email !== null) {
        // actualizo el estado del usuario en BBDD a SUCCESS
        updateUserMailVerification(email);
        //devuelvo al cliente un 200
        res.status(200).send();
    } else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(400).send('El token no es valido');
    }

}
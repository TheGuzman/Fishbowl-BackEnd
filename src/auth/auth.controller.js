import jwt from 'jsonwebtoken';
import { registerUser, getUserInfoByEmailAndPassword, updateUserMailVerification, getUserInfoByEmailAndUserName, getUserInfoByEmail } from '../user/user.model.js';
import { secret } from './auth.secret.js'
import { registerToken, validateToken, deleteToken,deleteResetPasswordToken, registerForgotPasswordToken,updateForgottenPasswordVerification,validateForgottenPasswordToken } from "./auth.model.js";
import { encodePassword, generateRandomEmailToken } from './auth.utils.js';
import { sendMail } from '../adapters/mail.js';

export const loginJWTController = async (req, res) => {

    const { userEmail, userPassword } = req.body;

    const passEnconded = encodePassword(userPassword)
    const userInfo = await getUserInfoByEmailAndPassword(userEmail, passEnconded)

    if (userInfo !== null) {
        const token = jwt.sign({ user: userEmail }, secret);
        console.log('valid log in from loginJWTController')
        res.send({
            access_token: token,
            status: 200
        });
    }
    else {
        res.status(404).send({ message: 'Wrong UserName or Password', status: 404 })
        console.log('invalid log in from loginJWTController')
    }
}

export const registerUserController = async (req, res) => {

    const { userName, userEmail, userPassword } = req.body;

    const userInfo = await getUserInfoByEmailAndUserName(userEmail, userName)
    if (userInfo === null) {
        const passEnconded = encodePassword(userPassword)
        if (registerUser(userName, userEmail, passEnconded)) {
            const tokenEmailVerification = generateRandomEmailToken();
            registerToken(tokenEmailVerification, userEmail);
            sendMail(userEmail, 'Verify your account to proceed with the sign up process', `<h2>Fishbowl APP</h2><h4>Welcome to the Fishbowl app, please continue your registration by confirming your email account with the link below.</h4><a href="http://localhost:3000/validate-mail?token=${tokenEmailVerification}">Verify your email address</a>`)
            res.status(201).send(JSON.stringify('user registered'));
        }
    } else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(409).send(JSON.stringify('User already exists'));
    }
}

export const validateUserController = async (req, res) => {
    // llamo a mi modelo para que me diga si el token es valido o no
    const email = await validateToken(req.query.token);
    // si existe email es que es válido, sino no es válido
    if (email !== null) {
        // actualizo el estado del usuario en BBDD a SUCCESS
        updateUserMailVerification(email);
        deleteToken(email)
        //devuelvo al cliente un 200
        res.status(200).send();
    } else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(400).send(JSON.stringify('Token is invalid'));
    }

}


export const forgotPasswordController = async (req, res) => {

    const userEmail = req.body.userEmail;

    const userInfo = getUserInfoByEmail(userEmail)

    if (userInfo !== null) {
        const tokenForgotPassword = generateRandomEmailToken();
        registerForgotPasswordToken(tokenForgotPassword, userEmail);
        sendMail(userEmail, 'Please use the following link to change your password', `<h2>Fishbowl APP</h2><h4>Hello, you have requested to change your password. Please use the following link to do so. \n If this was not you, please ignore this email. \n
        </h4><a href="http://localhost:3000/forgot-password?token=${tokenForgotPassword}"> Change your password</a>`)
        res.status(201).send(JSON.stringify('update password email sent'));
    }
    else {
        res.status(404).send(JSON.stringify('Email was not found'));
    }

}

export const validateForgottenPasswordController = async (req, res) => {
    const passEnconded = encodePassword(req.body.userPassword)
    const email = await validateForgottenPasswordToken(req.body.token);
    
    if (email !== null) {

        updateForgottenPasswordVerification(email, passEnconded);
        deleteResetPasswordToken(email)
        //devuelvo al cliente un 200
        res.status(200).send();
    } else {
        res.status(400).send(JSON.stringify('Token is invalid'));
    }

}
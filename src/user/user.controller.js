import { getUserInfoByEmail } from './user.model.js';
import { registerFishbowl, retrieveUserFishbowls } from './user.model.js'
import jwt from 'jsonwebtoken';
import { secret } from '../auth/auth.secret.js'


export const retrieveUserInfoCtrl = async (req, res) => {

    const userInfo = await getUserInfoByEmail(req.userEmail);
    console.log(req.userEmail)
    delete userInfo.userPassword;
    console.log(userInfo)
    console.log('from retrieve user controller' + userInfo)

    res.send(userInfo)
}

export const registerFihsbowlCtrl = async (req, res) => {

    let { fishbowlName, fishbowlTheme, fishbowlDescription, fishbowlDate, fishbowlCreator } = req.body;
    let jwtToken = fishbowlCreator.split(' ')[1]; //Aquí traigo el JWT token para identificar al usuario usando el secret y la funcion verify
    const jwtDecoded = await jwt.verify(jwtToken, secret);
    let email = jwtDecoded.user;
    let creator = await getUserInfoByEmail(email)
    fishbowlCreator = creator.userName

    if (await registerFishbowl(fishbowlName, fishbowlTheme, fishbowlDescription, fishbowlDate, fishbowlCreator)) {
        res.status(201).send('fishbowl registered');
    } else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(409).send('There was an error');
    }

}

export const retrieveFishbowlsCtrl = async (req, res) => {

    try {
        const headerAuth = req.get('Authorization')
        const jwtToken = headerAuth?.split(' ')[1];
        const jwtDecoded = await jwt.verify(jwtToken, secret);
        let email = jwtDecoded.user;
        const fishbowls = await retrieveUserFishbowls(email)
        res.status(201).send(fishbowls.userFishbowls)
    }
    catch(err){
        res.status(409).send('There was an error');
    }

    
}

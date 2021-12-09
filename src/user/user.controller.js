import { getUserInfoByEmail } from './user.model.js';
import { registerFishbowl, retrieveUserFishbowls, retrieveAllFishbowls, deleteFishbowlById, retrieveUserFishbowlsById } from './user.model.js'
import jwt from 'jsonwebtoken';
import { secret } from '../auth/auth.secret.js'


export const retrieveUserInfoCtrl = async (req, res) => {

    const userInfo = await getUserInfoByEmail(req.userEmail);
    console.log(req.userEmail)
    delete userInfo.userPassword;
    console.log('from retrieve user controller' + userInfo)

    res.send(userInfo)
}

export const registerFihsbowlCtrl = async (req, res) => {

    let { fishbowlName, fishbowlTheme, fishbowlDescription, fishbowlDate} = req.body;

    const headerAuth = req.get('Authorization')  //Aquí traigo el JWT token para identificar al usuario usando el secret y la funcion verify
    const jwtToken = headerAuth?.split(' ')[1];
    const jwtDecoded = await jwt.verify(jwtToken, secret);
    let email = jwtDecoded.user;
    let creator = await getUserInfoByEmail(email)
    let fishbowlCreator = creator.name

    if (await registerFishbowl(fishbowlName, fishbowlTheme, fishbowlDescription, fishbowlDate, fishbowlCreator)) {
        res.status(201).send('fishbowl registered');
    } else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(409).send('There was an error');
    }

}

export const retrieveUserFishbowlsCtrl = async (req, res) => {

    try {
        const headerAuth = req.get('Authorization')
        const jwtToken = headerAuth?.split(' ')[1];
        const jwtDecoded = await jwt.verify(jwtToken, secret);
        let email = jwtDecoded.user;
        
        const fishbowls = await retrieveUserFishbowls(email)
        const userFishbowls = await retrieveUserFishbowlsById(fishbowls)
        res.status(201).send(userFishbowls)
    }
    catch(err){
        res.status(409).send('There was an error');
    }

    
}

export const retrieveAllFishbowlsCtrl = async (req, res) => {

    try {
        const fishbowls = await retrieveAllFishbowls()
        res.status(201).send(fishbowls)
    }
    catch(err){
        res.status(409).send('There was an error');
    }

    
}


export const deleteaFishbowlByIdCtrl = async (req, res) => {

    let id = req.params.id
    id = id.substring(1)


    try {
        const fishbowlToDelete = await deleteFishbowlById(id)
        console.log(fishbowlToDelete)
        res.status(200).send(fishbowlToDelete)
    }
    catch(err){
        res.status(409).send('There was an error');
    }

    
}

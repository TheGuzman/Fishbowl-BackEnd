import { getUserInfoByEmail } from './user.model.js';
import { registerFishbowl } from './user.model.js'

export const retrieveUserInfoCtrl = async (req, res) => {

    const userInfo = await getUserInfoByEmail(req.userEmail);
    console.log('from retrieve user controller' + userInfo)
    delete userInfo.userPassword;
    res.send(userInfo)
}

export const registerFihsbowlCtrl = async (req, res) => {

    const { fishbowlName, fishbowlTheme, fishbowlDescription, fishbowlDate, fishbowlCreator } = req.body;
    if (await registerFishbowl(fishbowlName, fishbowlTheme, fishbowlDescription, fishbowlDate,  fishbowlCreator )) {
        res.status(201).send('fishbowl registered');
    } else {
        // si el usuario ya existe mando al cliente un 409 (conflict), indicando que el usuario 
        // ya existe
        res.status(409).send('There was an error');
    }
    
}
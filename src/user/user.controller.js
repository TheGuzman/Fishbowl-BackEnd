import { getUserInfoByEmail } from './user.model.js';

export const retrieveUserInfoCtrl = async (req,res)=>{

    const userInfo = await getUserInfoByEmail(req.userEmail);
    console.log('from retrieve user controller' + userInfo)
    delete userInfo.userPassword;
    res.send(userInfo)   
}
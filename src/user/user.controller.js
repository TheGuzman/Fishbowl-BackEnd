import { getUserInfoById } from './user.model.js';

export const retrieveUserInfoCtrl = async (req,res)=>{

    const userInfo = await getUserInfoById(req.email);
    console.log('from retrieve user controller' + userInfo)
    delete userInfo.password;
    res.send(userInfo)   
}

import express from 'express'
import { retrieveUserInfoCtrl } from './user.controller.js'
import { registerFihsbowlCtrl } from './user.controller.js'
import { retrieveUserFishbowlsCtrl, retrieveAllFishbowlsCtrl, deleteaFishbowlByIdCtrl, startaFishbowlByIdCtrl, retrieveFishbowlByRoomIdCtrl } from './user.controller.js'
import { deleteUserAccountCtrl, updateUserNameCtrl, updateUserPasswordCtrl, } from './user.controller.js'
import { validateJWTAuth } from '../auth/auth.middleware.js'


const router = express.Router();

router.use(validateJWTAuth)

router.route('/')
    .get(retrieveUserInfoCtrl);


//USER ROUTES

router.route('/becomeafish/myaccount/deleteuseraccount')
    .delete(deleteUserAccountCtrl)

router.route('/becomeafish/myaccount/updateusername')
    .patch(updateUserNameCtrl)

router.route('/becomeafish/myaccount/updateuserpassword')
    .patch(updateUserPasswordCtrl)




//FISHBOWL ROUTES


router.route('/becomeafish/getallfishbowls')
    .get(retrieveAllFishbowlsCtrl)

router.route('/becomeafish/myfishbowls/getuserfishbowls')
    .get(retrieveUserFishbowlsCtrl)

router.route('/becomeafish/joinfishbowl/getfishbowl/:id')
    .get(retrieveFishbowlByRoomIdCtrl)

router.route('/becomeafish/myfishbowls/createfishbowl')
    .post(registerFihsbowlCtrl)

router.route('/becomeafish/deleteafishbowl/:id')
    .delete(deleteaFishbowlByIdCtrl)

router.route('/becomeafish/startafishbowl/:id')
    .patch(startaFishbowlByIdCtrl)




export default router;
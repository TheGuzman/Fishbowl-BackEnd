
import express from 'express'
import { retrieveUserInfoCtrl } from './user.controller.js'
import { registerFihsbowlCtrl } from './user.controller.js'
import { retrieveUserFishbowlsCtrl, retrieveAllFishbowlsCtrl, deleteaFishbowlByIdCtrl } from './user.controller.js'
import { deleteUserAccountCtrl,updateUserNameCtrl, } from './user.controller.js'
import { validateJWTAuth } from '../auth/auth.middleware.js'


const router = express.Router();

router.use(validateJWTAuth)

router.route('/')
    .get(retrieveUserInfoCtrl);

router.route('/becomeafish/myaccount/deleteuseraccount')
    .delete(deleteUserAccountCtrl)

router.route('/becomeafish/myaccount/updateusername')
    .patch(updateUserNameCtrl)

router.route('/becomeafish/myaccount/updateuserpassword')
    // .patch(updateUserPasswordCtrl)


router.route('/becomeafish/getallfishbowls')
    .get(retrieveAllFishbowlsCtrl)

router.route('/becomeafish/myfishbowls/getuserfishbowls')
    .get(retrieveUserFishbowlsCtrl)

router.route('/becomeafish/myfishbowls/createfishbowl')
    .post(registerFihsbowlCtrl)

router.route('/becomeafish/deleteafishbowl/:id')
    .delete(deleteaFishbowlByIdCtrl)

router.route('/becomeafish/joinfishbowl/:roomId')


export default router;
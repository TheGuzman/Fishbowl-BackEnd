
import express from 'express'
import { retrieveUserInfoCtrl } from './user.controller.js'
import { registerFihsbowlCtrl } from './user.controller.js'
import { retrieveUserFishbowlsCtrl, retrieveAllFishbowlsCtrl, deleteaFishbowlByIdCtrl } from './user.controller.js'
import { validateJWTAuth } from '../auth/auth.middleware.js'


const router = express.Router();

router.use(validateJWTAuth)

router.route('/')
    .get(retrieveUserInfoCtrl);

router.route('/becomeafish/getallfishbowls')
    .get(retrieveAllFishbowlsCtrl)

router.route('/becomeafish/myfishbowls/getuserfishbowls')
    .get(retrieveUserFishbowlsCtrl)

router.route('/becomeafish/myfishbowls/createfishbowl')
    .post(registerFihsbowlCtrl)

router.route('/becomeafish/deleteafishbowl/:id')
    .delete(deleteaFishbowlByIdCtrl)

export default router;
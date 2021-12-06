
import express from 'express'
import { retrieveUserInfoCtrl } from './user.controller.js'
import { registerFihsbowlCtrl } from './user.controller.js'
import { retrieveFishbowlsCtrl } from './user.controller.js'
// import { validateJWTAuth } from '../auth/auth.middleware.js'


const router = express.Router();

// router.use(validateJWTAuth)
router.route('/')
    .get(retrieveUserInfoCtrl);


router.route('/becomeafish/myfishbowls/getfishbowls')
    .get(retrieveFishbowlsCtrl)

router.route('/becomeafish/myfishbowls/createfishbowl')
    .post(registerFihsbowlCtrl)





export default router;
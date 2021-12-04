
import express from 'express'
import { retrieveUserInfoCtrl } from './user.controller.js'
import { validateJWTAuth } from '../auth/auth.middleware.js'


const router = express.Router();

router.use(validateJWTAuth)
router.route('/')
    .get(retrieveUserInfoCtrl)


export default router;
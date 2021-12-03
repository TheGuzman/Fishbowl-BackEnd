import express from 'express'
import { loginJWTController, registerUserController } from './auth.controller.js'

const router = express.Router()



router.route('/login')
    .post(loginJWTController)

router.route('/register')
    .post(registerUserController)

router.route('/validate')
    .get


export default router

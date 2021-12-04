import express from 'express'
import { loginJWTController, registerUserController, validateUserController } from './auth.controller.js'

const router = express.Router()



router.route('/login')
    .post(loginJWTController)

router.route('/register')
    .post(registerUserController)

router.route('/validate')
    .get(validateUserController)


export default router

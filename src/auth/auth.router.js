import express from 'express'
import { loginJWTController, registerUserController, validateUserController,forgotPasswordController,validateForgottenPasswordController } from './auth.controller.js'

const router = express.Router()



router.route('/login')
    .post(loginJWTController)

router.route('/register')
    .post(registerUserController)

router.route('/validate')
    .get(validateUserController)


router.route('/forgot-password')
    .post(forgotPasswordController)

router.route('/validate-new-password')
    .post(validateForgottenPasswordController)



export default router

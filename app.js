import express from 'express'
import cors from 'cors';

import authRouter from './src/auth/auth.router.js';
import userRouter from './src/user/user.router.js'


const app = express()

app.use(cors());
app.use(express.json())

app.use('/auth', authRouter)
app.use('/user', userRouter)



app.listen(3001, console.log('Server is up at port 3001'))
import express from 'express'
import authRouter from './src/auth/auth.router.js'

const app = express()

app.use(express.json())

app.use('/auth', authRouter)


app.listen(3001, console.log('Server is up at port 3001'))
import express from 'express'

const app = express()

app.use(express.json())


app.listen(3001, console.log('Server is up at port 3001'))
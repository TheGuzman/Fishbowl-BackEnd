import express from 'express'
import cors from 'cors';

import { createServer } from 'http';
import { Server } from "socket.io";

import authRouter from './src/auth/auth.router.js';
import userRouter from './src/user/user.router.js'


const app = express()
const server = createServer(app);
const io = new Server(server)

app.use(cors());
app.use(express.json())



app.use('/auth', authRouter)
app.use('/user', userRouter)


// app.get('user/becomeafish/joinfishbowl/:roomId', (req, res) => {
//     res.render('room', { roomId: req.query.roomId })
// })



io.on("connection", socket => {
    socket.emit("your id", socket.id);
    socket.on('join-room', function(roomId) {
        socket.join(roomId);
        // console.log('joining room')
        // console.log(roomId)
    });
    socket.on("send message", (body) => {
        io.to(body.roomId).emit("message", body)
        // console.log('on send message')
        // console.log(body,body.roomId)

    })
})
// server.listen(3002)


server.listen(3001, console.log('Server is up at port 3001'))

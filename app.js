import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';
import Pusher from 'pusher';
import authRouter from './src/auth/auth.router.js';
import userRouter from './src/user/user.router.js'
import path from 'path';



import { appId } from './src/config/pusher.config.js'
import { key } from './src/config/pusher.config.js'
import { secret } from './src/config/pusher.config.js'
import { cluster } from './src/config/pusher.config.js'

const app = express()
const __dirname = path.resolve();

app.use(cors());
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))



//create an instance of Pusher

const pusher = new Pusher ({
    appId: appId,
    key: key,
    secret: secret,
    cluster: cluster,
    encrypted: true
})
app.get('/pusher', (req, res) => {
    return res.sendFile(__dirname + '/index.html');
});

// get authentictation for the channel;
app.post("/pusher/auth", (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    var presenceData = {
      user_id:
        Math.random()
          .toString(36)
          .slice(2) + Date.now()
    };
    const auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
  });

app.use('/auth', authRouter)
app.use('/user', userRouter)



app.listen(3001, console.log('Server is up at port 3001'))
import express, { Application, Response, Request } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import * as db from './config/db';
import dotenv from 'dotenv'

// import * as Authentication from './middleware/Authentication';

// dot env config
dotenv.config();

const port: string | Number = process.env.PORT || 5002;
const app: Application = express();
const server = createServer(app);
const io: Server = new Server(server);

db.connect();

io.on('connection', (socket: Socket) => {
    global._io = io;
    
    socket.on('chat message', (msg) => {

        socket.broadcast.emit('chat message', msg, { id: socket.id }); // send to all client, except the sender
    });
});

app.use(express.static(__dirname + '../public'))

app.get('/', (req: Request, res: Response): void => {
    res.sendFile('index.html', { root: './public' });
})

server.listen(port, () => console.log(`listen on http://localhost:${port}`));

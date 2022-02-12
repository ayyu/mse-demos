import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('views'));

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (_req, res) => {
	res.render('./socket_stream.ejs');
});

io.on('connection', (socket) => {
	
	let audioStream = fs.createReadStream(
		path.resolve(__dirname, './media/audio.webm')
	);
	audioStream.on('data', (data) => socket.emit('audio-data', data));
})

server.listen(3000);
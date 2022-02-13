import express from "express";
import http from "http";
import fs from "fs";
import path from "path";

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('views'));

const server = http.createServer(app);

app.get('/', (_req, res) => {
	res.render('./nonmuxed.ejs');
});

app.get('/audio', (_req, res) => {
	let file = path.resolve(__dirname, './media/audio.webm');
	let stream: fs.ReadStream = fs.createReadStream(file);
	res.writeHead(206, {
		'Connection': 'close',
		'Accept-Ranges': 'bytes',
		'Transfer-Encoding':'chunked',
	});
	stream.pipe(res);
});

app.get('/video', (_req, res) => {
	let file = path.resolve(__dirname, './media/video.webm');
	let stream: fs.ReadStream = fs.createReadStream(file, {
		end: 1000000,
	});
	res.writeHead(206, {
		'Connection': 'close',
		'Accept-Ranges': 'bytes',
		'Transfer-Encoding':'chunked',
	});
	stream.pipe(res);
});

server.listen(3000);

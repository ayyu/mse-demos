import express from "express";
import fs from "fs";
import path from "path";
import MultiStream from "multistream";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('views'));

app.get('/', (_req, res) => {
	res.render('./nonmuxed.ejs');
});

app.get('/audio', (_req, res) => {
	const mediaPath = path.resolve(__dirname, '../media/audio.webm');
	const jsonPath = path.resolve(__dirname, '../media/audio.json');
	const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
	const streams = [
		() => fs.createReadStream(mediaPath, {start: jsonData.init.offset, end: jsonData.init.size - 1}),
		() => fs.createReadStream(mediaPath, {start: jsonData.init.size, end: jsonData.media[15].offset - 1}),
	]
	new MultiStream(streams).pipe(res);
});

app.get('/video', (_req, res) => {
	const mediaPath = path.resolve(__dirname, '../media/video.webm');
	const jsonPath = path.resolve(__dirname, '../media/video.json');
	const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
	const streams = [
		() => fs.createReadStream(mediaPath, {start: jsonData.init.offset, end: jsonData.init.size - 1}),
		() => fs.createReadStream(mediaPath, {start: jsonData.init.size, end: jsonData.media[2].offset - 1}),
	];
	new MultiStream(streams).pipe(res);
});

app.listen(port);

import './globals.js';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const express = require('express');
const fs = require('fs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/octet-stream', limit: '100mb' }));
app.set('json spaces', 2);

app.get('/', (req, res) => {
	res.json({
		name: 'xstro-api',
		version: '1.0.0',
		description: 'API server for media and data processing',
		status: 'running',
	});
});

const loadRoutes = () => {
	const routesPath = path.join(__dirname, 'src');
	fs.readdirSync(routesPath).forEach(async file => {
		const filePath = path.join(routesPath, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			return;
		}

		if (file.endsWith('.js')) {
			const routeUrl = pathToFileURL(filePath).href;
			try {
				const {
					default: { router, path: routePath },
				} = await import(routeUrl);
				console.log(`Loaded route: ${routePath}, Router:`, router);

				if (router) {
					app.use(routePath || '/file', router);
				} else {
					console.error(`Router not found for ${file}`);
				}
			} catch (error) {
				console.error(`Error loading route: ${file}`, error);
			}
		}
	});
};

loadRoutes();

app.listen(PORT, () => {
	console.log(`xstro-api running on port ${PORT}`);
});

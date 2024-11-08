import './globals.js'; // Import globals for seamless usage
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

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Enable pretty printing of JSON responses
app.set('json spaces', 2); // Sets the indentation level to 2 spaces

// Root route to display server details
app.get('/', (req, res) => {
	res.json({
		name: 'xstro-api',
		version: '1.0.0',
		description: 'API server for media and data processing',
		status: 'running',
	});
});

// Dynamically load and apply routes from 'src' directory with file URLs
const loadRoutes = () => {
	const routesPath = path.join(__dirname, 'src');
	fs.readdirSync(routesPath).forEach(async file => {
		const routeUrl = pathToFileURL(path.join(routesPath, file)).href;
		const { path: routePath, router } = await import(routeUrl);
		app.use(routePath, router);
	});
};

// Load routes
loadRoutes();

app.listen(PORT, () => {
	console.log(`xstro-api running on port ${PORT}`);
});

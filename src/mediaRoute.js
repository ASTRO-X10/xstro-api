const router = express.Router();

router.post('/media', async (req, res) => {
	const { dataBuffer } = req.body;

	if (!dataBuffer) {
		return res.status(400).json({ error: 'No data buffer provided' });
	}

	try {
		// Example FFmpeg usage - Adjust as needed for your process
		await new Promise((resolve, reject) => {
			ffmpeg(dataBuffer).on('end', resolve).on('error', reject);
		});

		res.json({ message: 'Processing complete' });
	} catch (err) {
		res.status(500).json({ error: 'Processing error', details: err.message });
	}
});

// Export path and router for dynamic loading
export const path = '/api';
export { router };

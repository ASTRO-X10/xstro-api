import express from 'express';
import { fileTypeFromBuffer } from 'file-type';

const router = express.Router();

router.post('/file-type', async (req, res) => {
	try {
		const buffer = req.body;
		const type = await fileTypeFromBuffer(buffer);

		if (type) {
			res.json({
				success: true,
				fileType: type,
			});
		} else {
			res.status(400).json({
				success: false,
				message: 'Unable to determine file type',
			});
		}
	} catch (error) {
		console.error('Error processing file:', error);
		res.status(500).json({
			success: false,
			message: 'Server error',
		});
	}
});

export default {
	path: '/file', // Make sure 'path' is defined
	router, // Ensure 'router' is being exported
};

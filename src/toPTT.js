import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import convertToWhatsappPTT from './client/toppt.js';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const router = express.Router();

router.post('/convert-to-ptt', (req, res) => {
	console.log('Received request to convert to PTT');

	// Debugging the incoming body (buffer)
	console.log('Request body type:', typeof req.body);
	console.log('Buffer length:', req.body.length);
	console.log('Buffer first few bytes:', req.body.slice(0, 10));

	// Ensure the request body is a buffer
	if (!Buffer.isBuffer(req.body)) {
		return res.status(400).json({
			success: false,
			message: 'The provided input is not a buffer.',
		});
	}

	const buffer = req.body;

	// Check file type based on the buffer
	fileTypeFromBuffer(buffer)
		.then(type => {
			console.log('File type:', type);

			if (!type || !['audio/mpeg', 'video/mp4'].includes(type.mime)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid file type. Only audio or video files are supported.',
				});
			}

			// Start the conversion process
			console.log('Starting conversion to PTT...');

			// Use the convertToWhatsappPTT function to convert the buffer
			convertToWhatsappPTT(buffer)
				.then(pttBuffer => {
					console.log('Conversion complete, sending back response...');
					res.set('Content-Type', 'audio/ogg');
					res.set('Content-Disposition', 'attachment; filename="voiceMessage.ogg"');
					res.send(pttBuffer); // Send the PTT buffer back as the response
				})
				.catch(err => {
					console.error('Error during conversion to PTT:', err);
					res.status(500).json({
						success: false,
						message: 'Error during conversion to PTT.',
					});
				});
		})
		.catch(err => {
			console.error('Error determining file type:', err);
			res.status(500).json({
				success: false,
				message: 'Error determining file type.',
			});
		});
});

export default {
	path: '/whatsapp',
	router,
};

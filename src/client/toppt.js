import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'; // Import the ffmpeg installer
import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg'; // Ensure you have fluent-ffmpeg installed

// Set the ffmpeg path to the one from the installer
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Converts an audio or video buffer into a WhatsApp-compatible PTT voice message buffer (ogg with opus codec).
 * @param {Buffer} inputBuffer - The audio or video buffer to be converted.
 * @returns {Promise<Buffer>} - A promise that resolves to the converted PTT buffer.
 */
export default async function convertToWhatsappPTT(inputBuffer) {
	return new Promise((resolve, reject) => {
		// Create a Readable stream from the input buffer
		const bufferStream = new Readable();
		bufferStream.push(inputBuffer);
		bufferStream.push(null); // End the stream

		// Start ffmpeg conversion to .ogg (Opus audio codec)
		const outputBuffer = [];

		ffmpeg()
			.input(bufferStream)
			.inputFormat('mp4') // Assuming input is mp4, adjust for other formats as needed
			.audioCodec('libopus') // Using Opus codec for WhatsApp PTT
			.audioBitrate(64) // Standard PTT bitrate
			.format('ogg') // WhatsApp accepts ogg files for PTT
			.pipe() // Explicitly tell ffmpeg to pipe the output (to be collected in a buffer)
			.on('data', chunk => outputBuffer.push(chunk)) // Collect the chunks of the output buffer
			.on('end', () => {
				// Join the buffer chunks into a single buffer and resolve
				const finalBuffer = Buffer.concat(outputBuffer);
				resolve(finalBuffer);
			})
			.on('error', err => {
				reject(err); // Reject the promise on error
			});
	});
}

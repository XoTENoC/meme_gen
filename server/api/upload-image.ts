import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	try {
		const imageData = await readBody(event); // Assumes image data is sent as a base64 string
		const name = imageData.name;
		const buffer = Buffer.from(imageData.file, 'base64');

		// Generate high-resolution and thumbnail images
		const highRes = await sharp(buffer)
			.resize(1080)  // Resizes the image, keeping aspect ratio, with the longest edge being 1080px
			.toFormat('jpeg')
			.toBuffer();
		const thumbnail = await sharp(buffer)
			.resize(300)   // Resizes the image, keeping aspect ratio, with the longest edge being 300px
			.toFormat('jpeg')
			.toBuffer();

		// Convert buffers to base64 strings (if storing in DB directly; otherwise, save to file system)
		const highResBase64 = highRes.toString('base64');
		const thumbnailBase64 = thumbnail.toString('base64');

		// Store in the database
		const image = await prisma.image.create({
			data: {
				name,
				highRes: highResBase64,
				thumbnail: thumbnailBase64
			}
		});

		return { image };
	} catch (error) {
		console.error("Failed to upload image:", error);
		return { error: "Failed to upload image" };
	} finally {
		await prisma.$disconnect();
	}
});

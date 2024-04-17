import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const writeFile = promisify(fs.writeFile);

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	try {
		const imageData = await readBody(event);
		const name = imageData.name;
		const buffer = Buffer.from(imageData.file, 'base64');

		// Prepare file paths
		const baseDir = path.join('public', 'images');
		const highResPath = path.join(baseDir, `${name}_highres.jpeg`);
		const thumbnailPath = path.join(baseDir, `${name}_thumbnail.jpeg`);

		// Generate high-resolution and thumbnail images
		const highRes = await sharp(buffer)
			.resize(1080)  // High resolution
			.toFormat('jpeg')
			.toBuffer();
		const thumbnail = await sharp(buffer)
			.resize(300)   // Thumbnail
			.toFormat('jpeg')
			.toBuffer();

		// Save images to file system
		await writeFile(highResPath, highRes);
		await writeFile(thumbnailPath, thumbnail);

		const highResPathWeb = path.join("/images", `${name}_highres.jpeg`);
		const thumbnailPathWeb = path.join("/images", `${name}_thumbnail.jpeg`);

		// Store image paths in the database instead of the content
		const image = await prisma.image.create({
			data: {
				name,
				highRes: highResPathWeb,
				thumbnail: thumbnailPathWeb
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

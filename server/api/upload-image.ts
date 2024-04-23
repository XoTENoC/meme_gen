import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	try {
		const imageData = await readBody(event);
		let name = imageData.name;
		const buffer = Buffer.from(imageData.file, 'base64');

		// Replace spaces with underscores in the name
		name = name.replace(/\s+/g, '_');

		// Prepare file paths
		const baseDir = path.join('public', 'images');
		const outputDir = path.join('output', baseDir);
		const highResPath = path.join(baseDir, `${name}_highres.jpeg`);
		const thumbnailPath = path.join(baseDir, `${name}_thumbnail.jpeg`);
		const highResOutputPath = path.join(outputDir, `${name}_highres.jpeg`);
		const thumbnailOutputPath = path.join(outputDir, `${name}_thumbnail.jpeg`);

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

		if (await exists('output')) {
			await writeFile(highResOutputPath, highRes);
			await writeFile(thumbnailOutputPath, thumbnail);
		}

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

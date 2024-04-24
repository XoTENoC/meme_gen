import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';

// Configure the AWS SDK for JavaScript to use your MinIO instance
const s3 = new AWS.S3({
	endpoint: 'https://bucket.nuggslab.com', // MinIO endpoint
	accessKeyId: 'TnBqMJ6Bj6rfd0UZ7oC8', // MinIO Access Key
	secretAccessKey: 'JEX4ZpfIRoTeJTAGBpbf4OXLdMaReQHKNJA1plhk', // MinIO Secret Key
	s3ForcePathStyle: true, // Needed with MinIO
	signatureVersion: 'v4'
});

const bucketName = 'memegen';

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	try {
		const imageData = await readBody(event);
		let name = imageData.name;
		const buffer = Buffer.from(imageData.file, 'base64');

		// Replace spaces with underscores in the name
		name = name.replace(/\s+/g, '_');

		// Generate high-resolution and thumbnail images
		const highRes = await sharp(buffer)
			.resize(1080)  // High resolution
			.toFormat('jpeg')
			.toBuffer();
		const thumbnail = await sharp(buffer)
			.resize(300)   // Thumbnail
			.toFormat('jpeg')
			.toBuffer();

		// Prepare key paths for S3
		const highResKey = `public/${name}_highres.jpeg`;
		const thumbnailKey = `public/${name}_thumbnail.jpeg`;

		// Upload images to S3/MinIO
		await s3.upload({
			Bucket: bucketName,
			Key: highResKey,
			Body: highRes,
			ACL: 'public-read'
		}).promise();
		await s3.upload({
			Bucket: bucketName,
			Key: thumbnailKey,
			Body: thumbnail,
			ACL: 'public-read'
		}).promise();

		const baseUrl = 'https://bucket.nuggslab.com/memegen/public';
		const highResUrl = `${baseUrl}/${name}_highres.jpeg`;
		const thumbnailUrl = `${baseUrl}/${name}_thumbnail.jpeg`;

		// Store image URLs in the database instead of the content
		const image = await prisma.image.create({
			data: {
				name,
				highRes: highResUrl,
				thumbnail: thumbnailUrl
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

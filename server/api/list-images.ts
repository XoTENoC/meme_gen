import { readdir } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async () => {
	try {
		// Set the path to the directory containing images
		const directoryPath = join(process.cwd(), 'public/images/ben');

		// Read all files in the directory
		const files = await readdir(directoryPath);

		// Filter out only image files if necessary and create paths
		const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|bmp)$/.test(file))
			.map(image => ({
				name: image,
				path: `/images/ben/${image}`,
			}));

		// Return the list of images with their paths
		return {
			timestamp: new Date().toISOString(),
			images: imageFiles
		};
	} catch (error: any) {
		return {
			message: 'Failed to retrieve images',
			error: error.message,
			timestamp: new Date().toISOString()
		};
	}
});

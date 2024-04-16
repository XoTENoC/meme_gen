import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	try {
		// Fetch all images from the database
		const images = await prisma.image.findMany({
			select: {
				id: true,
				name: true,
				highRes: true,
				thumbnail: true
			}
		});
		return images;
	} catch (error) {
		console.error("Failed to fetch images:", error);
		return { error: "Failed to retrieve images" };
	} finally {
		await prisma.$disconnect();
	}
});

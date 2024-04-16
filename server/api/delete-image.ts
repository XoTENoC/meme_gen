import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
	const prisma = new PrismaClient();
	try {
		const { id } = await readBody(event);

		// Delete the image entry from the database
		const result = await prisma.image.delete({
			where: { id: Number(id) },
		});

		return { success: true, message: 'Image deleted successfully', result };
	} catch (error) {
		console.error("Failed to delete image:", error);
		return { error: "Failed to delete image" };
	} finally {
		await prisma.$disconnect();
	}
});

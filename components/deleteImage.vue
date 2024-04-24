<template>
	<div>
		<div v-for="image in images" :key="image.id">
			{{ image.name }}
			<button class="p-2 bg-red-500 hover:bg-red-400 rounded text-white" @click="deleteImage(image.id)">Delete</button>
		</div>
		<p v-if="message" :class="{ 'text-red-500': errorMessage, 'text-green-500': !errorMessage }">{{ message }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			images: [],
			message: '', // Holds the message
			errorMessage: false, // Flag to indicate if it's an error message
		};
	},
	async mounted() {
		this.fetchImages();
	},
	methods: {
		async fetchImages() {
			try {
				const response = await fetch('/api/get-images');
				if (!response.ok) throw new Error('Failed to fetch images');
				this.images = await response.json();
			} catch (error) {
				console.error('Error fetching images:', error);
				this.message = 'Failed to fetch images';
				this.errorMessage = true;
			}
		},
		async deleteImage(id) {
			try {
				const response = await fetch(`/api/delete-image`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ id })
				});
				if (!response.ok) throw new Error('Failed to delete image');
				this.message = 'Image deleted successfully!';
				this.errorMessage = false;
				this.images = this.images.filter(image => image.id !== id); // Remove the image from the local list
			} catch (error) {
				console.error('Error deleting image:', error);
				this.message = 'Failed to delete image';
				this.errorMessage = true;
			}
		}
	}
};
</script>

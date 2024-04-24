<template>
	<div>
		<div class="flex justify-center items-center">
			<div class="max-w-md mx-auto p-6 bg-white rounded-md shadow-lg">
				<h2 class="text-3xl font-semibold text-center mb-6">Image Upload</h2>
				<input id="fileInput" type="file" class="hidden" @change="previewImage" accept="image/*" />
				<label for="fileInput" class="cursor-pointer block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Browse</label>
				<div class="relative border-2 border-dashed border-gray-300 rounded-md mt-6 px-6 py-8 text-center">
					<img v-if="imageData" :src="imageData" alt="Image preview" style="max-width: 200px;">
					<p v-else>No image Selected</p>
				</div>
				<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" @click="uploadImage" :disabled="loading">Upload Image</button>
				<p v-if="message" :class="{ 'text-red-500': errorMessage, 'text-green-500': !errorMessage }">{{ message }}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			imageFile: null,
			imageData: null, // This will be the base64 encoded string of the image
			loading: false,
			message: '', // Holds the upload message
			errorMessage: false, // Flag to indicate if it's an error message
		};
	},
	methods: {
		previewImage(event) {
			const file = event.target.files[0];
			if (file) {
				this.imageFile = file;
				const reader = new FileReader();
				reader.onload = (e) => {
					this.imageData = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		},
		async uploadImage() {
			if (!this.imageData) return;

			this.loading = true;

			try {
				const response = await fetch('/api/upload-image', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: this.imageFile.name,
						file: this.imageData.split(',')[1] // Remove the base64 prefix
					})
				});

				if (!response.ok) throw new Error('Failed to upload image');
				this.message = 'Image uploaded successfully!';
				this.errorMessage = false;
			} catch (error) {
				console.error('Error uploading image:', error);
				this.message = 'Failed to upload image';
				this.errorMessage = true;
			}

			this.loading = false;
		}
	}
};
</script>

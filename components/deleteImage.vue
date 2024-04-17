<template>
    <div>
      <div v-for="image in images" :key="image.id">
        {{ image.name }}
        <button @click="deleteImage(image.id)">Delete</button>
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        images: []
      };
    },
    async mounted() {
      this.images = await this.fetchImages();
    },
    methods: {
      async fetchImages() {
        try {
          const response = await fetch('/api/get-images');
          if (!response.ok) throw new Error('Failed to fetch images');
          return response.json();
        } catch (error) {
          console.error('Error fetching images:', error);
          return [];
        }
      },
      async deleteImage(id) {
        try {
          const response = await fetch(`]/api/delete-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
          });
          if (!response.ok) throw new Error('Failed to delete image');
          alert('Image deleted successfully!');
          this.images = this.images.filter(image => image.id !== id); // Remove the image from the local list
        } catch (error) {
          console.error('Error deleting image:', error);
          alert('Failed to delete image');
        }
      }
    }
  };
  </script>

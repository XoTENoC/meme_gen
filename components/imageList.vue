<template>
	<div class="flex flex-row gap-2 align-center overflow-x-auto">
		<div v-for="image in imageStore.imageList" @click.prevent="selectImage(image)" class="shrink-0 rounded overflow-hidden">
			<img :src="image.thumbnail" class="aspect-square object-cover size max-w-32" :class="{ 'border-4 border-sky-500': image.id === imageStore.selectedImage.id}">
		</div>
	</div>
</template>

<script lang="ts">
export default {
	data() {
		return {
			numberOfImages: 0,
		};
	},
	setup() {
		const imageStore = useImagesStore();
		return { imageStore };
	},
	mounted() {
		this.imageStore.fetchImageList();
	},
	methods: {
		selectImage(image: any) {
			this.imageStore.selectedImage = image;
		},
	}
}
</script>

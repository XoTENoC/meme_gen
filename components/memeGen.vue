<template>
	<div class="flex flex-col gap-2 align-center">
		<div class="flex flex-col gap-8 p-4">
			<div class="flex flex-col">
				<label for="top-text" class="block text-sm font-semibold leading-6 text-gray-900">Top Text</label>
				<div class="mt-2.5">
					<input required="" type="text" name="top-text" id="top-text" placeholder="Enter Top Text" class="block w-full rounded-md border-0 py-3 px-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" v-model="topText">
				</div>
			</div>
			<div class="flex flex-col">
				<label for="bottom-text" class="block text-sm font-semibold leading-6 text-gray-900">Bottom Text</label>
				<div class="mt-2.5">
					<input required="" type="text" name="bottom-text" id="bottom-text" placeholder="Enter Bottom Text" class="block w-full rounded-md border-0 py-3 px-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" v-model="bottomText">
				</div>
			</div>
			<div class="flex flex-col">
				<a href="#" class="bg-blue-500 hover:bg-blue-600 text-white text-center font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" @click.prevent="downloadMeme()">Download Meme</a>
			</div>
		</div>
		<div ref="meme" v-if="validImage" class="flex relative max-w-full">
			<img :src="`data:image/jpeg;base64,${imageStore.selectedImage.highRes}`" class="object-cover w-full">
			<h1 class="absolute text-center text-8xl font-bold meme-text uppercase text-white top-0 w-full h-1/4 overflow-hidden">{{ topText }}</h1>
			<h1 class="absolute text-center text-8xl font-bold meme-text uppercase text-white bottom-0 w-full max-h-1/4 overflow-hidden">{{ bottomText }}</h1>
		</div>
		<div v-else>
			<h1>No Image Selected</h1>
		</div>
	</div>
</template>

<script lang="ts">
import { toPng } from 'html-to-image';

export default {
	data() {
		return {
			topText: "",
			bottomText: "",
		};
	},
	setup() {
		const imageStore = useImagesStore();
		return { imageStore };
	},
	computed: {
		validImage() {
			if (this.imageStore.selectedImage !== null) {
				return true;
			}

			return false;
		}
	},
	methods: {
		downloadMeme() {
			const node = this.$refs.meme;
			toPng(node)
				.then((dataUrl) => {
					const link = document.createElement('a');
					link.href = dataUrl;
					link.download = 'meme.png';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				})
				.catch((error) => {
					console.error('oops, something went wrong!', error);
				});
		},
	}
}
</script>

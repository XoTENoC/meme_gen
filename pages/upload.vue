<template>
	<div class="mx-auto p-8 w-full lg:max-w-5xl flex flex-col gap-8">
		<imageUploader />
	</div>
</template>

<script lang="ts">
import imageUploader from '../components/imageUploader.vue';

export default {
	components: {
		imageUploader,
	},
	data() {
		return {
			test: 0,
		};
	},
}
</script>

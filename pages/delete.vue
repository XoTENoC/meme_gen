<template>
	<div class="mx-auto p-8 w-full lg:max-w-5xl flex flex-col gap-8">
		<deleteImage />
	</div>
</template>

<script lang="ts">
import deleteImage from '../components/deleteImage.vue';

export default {
	components: {
		deleteImage,
	},
	data() {
		return {
			test: 0,
		};
	},
}
</script>

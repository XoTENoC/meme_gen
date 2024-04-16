<template>
	<div class="mx-auto p-8 w-full lg:max-w-5xl flex flex-col gap-8">
		<imageList />
		<memeGen />
	</div>
</template>

<script lang="ts">
import imageList from '../components/imageList.vue';
import memeGen from '../components/memeGen.vue';

export default {
	components: {
		imageList,
		memeGen,
	},
	data() {
		return {
			test: 0,
		};
	},
}
</script>

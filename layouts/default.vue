<template>
	<div>
		<headerLogo />
		<slot />
	</div>
</template>

<script lang="ts">
import headerLogo from '../components/headerLogo.vue';

export default {
	components: {
		headerLogo,
	},
}
</script>

<script>

export default {
	data: () => (
		{
			mines: [],
			rows: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
		}
	),
	mounted() {

	},
	methods: {

	}
}


</script>

<template>
	<div class="mlr-a" v-for="(row, i) in rows" :key="i" style="width: 254px; display: flex;">
		<div v-for="(data, j) in row" :key="j" style="width: 122px;">
			<div style="width: 16px; text-align: center;" class="mlr-a">
				<a>{{ data }}</a>
			</div>
		</div>
	</div>
</template>

<style scoped>
.mlr-a {
	margin-left: auto; margin-right: auto;
}
</style>

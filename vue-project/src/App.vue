<template>
	<div class="mlr-a w-152" v-for="(row, i) in rows" :key="i" style="display: flex;">
		<div class="mlr-a" v-for="(data, j) in row" :key="j">
			<div class="minescell" style="text-align: center; background-color: #eee; border-radius: 4px; margin: 4px;">
				<a>{{ data }}</a>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	data: () => (
		{
			mines: [],
			rows: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
			minescnt: 4,
		}
	),
	mounted() {

		for(var i=0; i < this.minescnt; i++)
		{
			var x = getRandomInt(4)
			var y = getRandomInt(4)

			if(this.rows[x][y] == 1) { i--;	continue; }

			this.rows[x][y] = 1
		}

	},
	methods: {

	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
</script>

<style scoped>
.mlr-a {
	margin-left: auto; margin-right: auto;
}

.w-152 {
	width: 152px
}

.minescell {
	width: 24px;
	height: 24px;
}
</style>

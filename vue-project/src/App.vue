<template>
	<div class="mlr-a w-152" v-for="(row, i) in minesrow" :key="i" style="display: flex;">
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
			minesrow: [['','','',''],['','','',''],['','','',''],['','','','']],
			minescnt: 4,
		}
	),
	mounted() {

		for(var i=0; i < this.minescnt; i++)
		{
			var x = getRandomInt(4)
			var y = getRandomInt(4)

			if(this.minesrow[x][y] == "t") { i--;	continue; }

			this.minesrow[x][y] = "t";
		}

		for(var a = 0; a < this.minescnt; a++)
		{
			for(var b = 0; b < this.minescnt; b++)
			{
				if (this.minesrow[a][b] == "t") continue;

				var cnt = 0;
				if (a-1>=0) {
					if (b-1>=0 && this.minesrow[a-1][b-1] == "t") cnt++;
					if (this.minesrow[a-1][b] == "t") cnt++;
					if (b+1<4 && this.minesrow[a-1][b+1] == "t") cnt++;
				}

				if(b-1>=0 && this.minesrow[a][b-1] == "t") cnt++;
				if(b+1<4 && this.minesrow[a][b+1] == "t") cnt++;

				if(a+1<4) {
					if(b-1>=0 && this.minesrow[a+1][b-1] == "t") cnt++;
					if(this.minesrow[a+1][b] == "t") cnt++;
					if(b+1<4 && this.minesrow[a+1][b+1] == "t") cnt++;
				}

				this.minesrow[a][b] = String(cnt);
			}
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

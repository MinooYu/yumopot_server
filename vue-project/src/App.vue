<template>
	<div class="mlr-a rowlength" :style="rowlen">
		<div class="mlr-a" v-for="(row, i) in minesrow" :key="i" style="display: flex;">
			<div class="minescell" v-for="(data, j) in row" :key="j" style="text-align: center; background-color: #eee; border-radius: 4px; margin: 4px;" v-on:click="digrow[i][j] = true;">
				<a v-if="digrow[i][j]">{{ data }}</a>
				<a v-else v-on:click="digrow[i][j] = true"></a>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	data: () => (
		{
			digrow: [[false,false,false,false],[false,false,false,false,],[false,false,false,false,],[false,false,false,false,]],
			minesrow: [['','','',''],['','','',''],['','','',''],['','','','']],
			minescnt: 4,
			rowcnt: 4,
		}
	),
	computed: {
		rowlen() {
			console.log( this.rowcnt * 32)
			return {
				'--rowlen' : this.rowcnt * 32,
			}
		}
	},
	mounted() {

		for(var i=0; i < this.minescnt; i++)
		{
			var x = getRandomInt(this.rowcnt)
			var y = getRandomInt(this.rowcnt)

			if(this.minesrow[x][y] == "t") { i--;	continue; }

			this.minesrow[x][y] = "t";
		}

		for(var a = 0; a < this.rowcnt; a++)
		{
			for(var b = 0; b < this.rowcnt; b++)
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

.rowlength {
	width: calc(1px * var(--rowlen));
}
</style>

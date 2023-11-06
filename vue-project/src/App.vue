<template>
	<div class="mlr-a" style="width: 1200px;height: 400px;">
		<div class="mlr-a rowlength" :style="rowlen" style="margin-top: 48px; z-index: 5;">
			<div class="mlr-a" v-for="(row, i) in minesrow" :key="i" style="display: flex;">
				<div class="minescell" v-for="(data, j) in row" :key="j" style="font-size: 32px; text-align: center; background-color: #eee; border-radius: 4px; margin: 4px;" v-on:click="digrow[i][j] = true;">
					<a v-if="digrow[i][j]" >{{ data }}</a>
					<a v-else v-on:click="digrow[i][j] = true"></a>
				</div>
			</div>
		</div>
		<!-- <div v-if="memomode" style="position: absolute; top: 0; z-index: 7;">
			<canvas ref="canvasElement" style="border: 2px solid #a3a3a3; border-radius: 4px; width: 1200px; height: 400px;"></canvas>
		</div>
		<div v-else style="position: absolute; top: 0; z-index: 7; pointer-events: none;">
			<canvas ref="canvasElement" style="border: 2px solid #a3a3a3; border-radius: 4px; width: 1200px; height: 400px;"></canvas>
		</div> -->
		<div :class="drawf" id="main" style="position: absolute; top: 0;">
			<!-- <p style="user-select: none;">X: {{ mouseX }} Y: {{ mouseY }}</p> -->
			<canvas style="border:1px solid black;" 
					ref="canvas" width="1200" height="420"
					v-on:mousemove="paint"
					v-on:mousedown="dragStart"
					v-on:mouseup="dragEnd"
					>
			</canvas>
		</div>
	</div>

	

	<div class="mlr-a" style="width: 400px; display: flex;">
		<button v-on:click="memomode = !memomode" style="width: 120px; margin-left: auto; margin-right: auto; z-index: 12;">
			メモする
		</button>
		<!-- <button v-on:click="" style="width: 120px; margin-left: auto; margin-right: auto;">
			問題変更
		</button> -->
	</div>

	<!-- <DrawTool /> -->

	<!-- <div id="canvas-area">
		<canvas id="myCanvas" style="border: 2px solid #a3a3a3; border-radius: 4px; width: 1200px; height: 400px;" @mousedown="dragStart" @mouseup="dragEnd" @mouseout="dragEnd" @mousemove="draw"></canvas>
	</div> -->
</template>

<script>
import DrawTool from './components/DrawTool.vue'

export default {
	name: 'App',
	components: {
		DrawTool
	},
	el: "#main",
	data: () => (
		{
			digrow: [[false,false,false,false],[false,false,false,false,],[false,false,false,false,],[false,false,false,false,]],
			minesrow: [['','','',''],['','','',''],['','','',''],['','','','']],
			minescnt: 4,
			rowcnt: 4,
			memomode: false,
			mouseX: 0,
    		mouseY: 0,
			isDrag: false,
		}
	),
	computed: {
		rowlen() {
			console.log( this.rowcnt * 72)
			return {
				'--rowlen' : this.rowcnt * 72,
			}
		},
		drawf() {
			if(!this.memomode) return 'draw-f'
		},
	},
	mounted() {
		this.canvas = this.$refs.canvas;
    	this.context = this.canvas.getContext("2d");


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
		paint: function(e){
			
			this.rect = this.canvas.getBoundingClientRect();
			this.mouseX = e.clientX - this.rect.left;
			// this.mouseY = e.clientY - this.rect.top -24;
			this.mouseY = e.clientY - this.rect.top;

			if(!this.isDrag) {
				return;
			}

			// this.context.fillRect(this.mouseX, this.mouseY, 2, 2);

			var x = e.layerX
			// var y = e.layerY -24
			var y = e.layerY
		
			this.context.lineTo(x, y);
			this.context.stroke();
		},
		dragStart:function(e) {
			console.log("start")
			var x = e.layerX
			// var y = e.layerY -24
			var y = e.layerY
		
			this.context.beginPath();
			this.context.lineTo(x, y);
			this.context.stroke();
		
			this.isDrag = true;
		},
		// 描画終了（mouseup, mouseout）
		dragEnd: function() {
			console.log("end")
			this.context.closePath();
			this.isDrag = false;
		}
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
</script>

<style scoped>
.canvas-container {
  border: 1px solid grey;
}

.mlr-a {
	margin-left: auto; margin-right: auto;
}

.w-152 {
	width: 152px
}

.minescell {
	width: 64px;
	height: 64px;
}

.rowlength {
	width: calc(1px * var(--rowlen));
}

.draw-f {
	pointer-events: none;
}

</style>

<template>
	<div class="mlr-a" style="width: 1200px;height: 400px;">

		<div class="mlr-a rowlength" :style="rowlen" style="margin-top: 64px; z-index: 5;">
			<div class="mlr-a" v-for="(row, i) in minesrow" :key="i" style="display: flex;">
				<div class="minescell back-e" v-for="(data, j) in row" :key="j" style="font-size: 32px; text-align: center; border-radius: 4px; margin: 4px;" v-on:click.left="minedig(i, j)">
					<div v-if="digrow[i][j] == minesenum.dig" class="minescell back-e" style="border-radius: 4px;">{{ data }}</div>
					<div v-else-if="digrow[i][j] == minesenum.flag" class="minescell back-r" style="width: 100%; height: 100%; border-radius: 4px;"></div>
					<div v-else class="minescell back-e" style="border-radius: 4px;"></div>
				</div>
			</div>
		</div>

		<div :class="drawf" id="main" style="position: absolute; top: 0; margin-top: 12px;">
			<!-- <p style="user-select: none;">X: {{ mouseX }} Y: {{ mouseY }}</p> -->
			<canvas style="border:1px solid black;" 
				ref="canvas" width="1200" height="420"
				v-on:mousemove="paint"
				v-on:mousedown="dragStart"
				v-on:mouseup="dragEnd">
			</canvas>
		</div>

	</div>


	<div class="mlr-a">

		<div style="width: 400px; display: flex; margin-left: auto; margin-right: auto;">
			<button v-on:click="memomode = !memomode" style="width: 120px; margin-left: auto; margin-right: auto; z-index: 12;">
				メモする : {{ memomode }}
			</button>
			<button v-on:click="" style="width: 120px; margin-left: auto; margin-right: auto;" @click="clear">
				クリア
			</button>
			<button v-on:click="mine_dig_flag = !mine_dig_flag" style="width: 120px; margin-left: auto; margin-right: auto; z-index: 12;">
				掘る : {{ mine_dig_flag }}
			</button>
		</div>

		<div style="margin-top: 16px;">
			<div style="width: 400px; display: flex; margin-left: auto; margin-right: auto;">
				<div style="margin-left: auto; margin-right: auto;">
					<button v-on:click="colorch('#df2a2a',0)" style="border: none; background-color: #df2a2a; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#dfd32a',0)" style="border: none; background-color: #dfd32a; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#2a3cdf',0)" style="border: none; background-color: #2a3cdf; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#252525',0)" style="border: none; background-color: #252525; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#252525',1)" style="border: 1px solid; background-color: #fff; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
				</div>
			</div>
			<div style="text-align: center; margin-top: 4px;">ペン色を変える</div>
		</div>
		<div class="mlr-a"><div style="text-align: center;"> connect! * {{ connectcnt }} </div></div>
	</div>

	<!-- <DrawTool /> -->

</template>

<script>
import { pushScopeId } from 'vue';
import DrawTool from './components/DrawTool.vue'
import io from "socket.io-client";

const minesenum = {dig:'dig',flag:'flag',none:'none'}

export default {
	name: 'App',
	components: {
		DrawTool
	},
	el: "#main",
	data: () => (
		{
			minesenum: minesenum,
			digrow: [[minesenum.none,minesenum.none,minesenum.none,minesenum.none],[minesenum.none,minesenum.none,minesenum.none,minesenum.none],[minesenum.none,minesenum.none,minesenum.none,minesenum.none],[minesenum.none,minesenum.none,minesenum.none,minesenum.none],],
			minesrow: [['','','',''],['','','',''],['','','',''],['','','','']],
			minescnt: 4,
			rowcnt: 4,
			memomode: false,
			mouseX: 0,
    		mouseY: 0,
			isDrag: false,
			mine_dig_flag: true,
			canvas: null,
			context: null,
			drawstyle: 0,

			socket: io("http://localhost:3031"),
			connectcnt: 0,
		}
	),
	created() {
		this.socket.on("connect", () => {
			console.log("connected");
			this.socket.emit("helloroom");
		});
	},
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
		this.context.lineCap = 'round';
		this.context.lineJoin = 'round';
		this.context.lineWidth = 8;
		this.context.strokeStyle = '#dfb52a';

		// this.context2 = this.canvas.getContext("2d");
		// this.context2.lineCap = 'round';
		// this.context2.lineJoin = 'round';
		// this.context2.lineWidth = 8;
		// this.context2.strokeStyle = '#dfb52a';

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

		this.socket.on("hello", (str, cnt) => {
			console.log(str);
			this.connectcnt = cnt;
		});

		this.socket.on("dragStart", (x, y) => {
			this.context.beginPath();
			this.context.lineTo(x, y);
			this.context.stroke();
		});

		this.socket.on("paint", (x, y) => {
			this.context.lineTo(x, y);
			this.context.stroke();
		});

		this.socket.on("dragEnd", () => {
			this.context.closePath();
		});

		this.socket.on("clear", () => {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		});
		this.socket.on("colorch", (colornum) => {
			this.context.strokeStyle = colornum;
		});

		this.socket.on("minedig", (i,j, flagnum) => {
			// 掘る場所をサーバで共有させる
			if (this.mine_dig_flag && this.digrow[i][j] == minesenum.none) { this.digrow[i][j] = minesenum.dig; }
			else if (!this.mine_dig_flag && this.digrow[i][j] == minesenum.flag) { this.digrow[i][j] = minesenum.none; }
			else if (!(this.digrow[i][j] == minesenum.dig)) { this.digrow[i][j] = minesenum.flag; }
		});
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
			this.socket.emit("paint", x, y);
		},
		clear: function() {
			this.socket.emit("clear");
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		colorch: function(colornum, stylenum) {
			this.context.strokeStyle = colornum;

			this.socket.emit("colorch", colornum);

			this.drawstyle = stylenum;
			if(this.drawstyle == 0) { this.context.globalCompositeOperation = 'source-over'; this.context.lineWidth = 8; }
			else if(this.drawstyle == 1) { this.context.globalCompositeOperation = 'destination-out'; this.context.lineWidth = 32; }
		},
		dragStart:function(e) {
			
			console.log("start")
			var x = e.layerX
			// var y = e.layerY -24
			var y = e.layerY

			this.socket.emit("dragStart", x, y);

			this.isDrag = true;
		},
		// 描画終了（mouseup, mouseout）
		dragEnd: function() {
			console.log("end")
			this.socket.emit("dragEnd");
			this.isDrag = false;
			
		},
		minedig: function(i, j) {
			if (this.mine_dig_flag && this.digrow[i][j] == minesenum.none) { this.digrow[i][j] = minesenum.dig; }
			else if (!this.mine_dig_flag && this.digrow[i][j] == minesenum.flag) { this.digrow[i][j] = minesenum.none; }
			else if (!(this.digrow[i][j] == minesenum.dig)) { this.digrow[i][j] = minesenum.flag; }
		},
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
.back-e {
	background-color: #eee;
}
.back-r {
	background-color: #df2a2a;
}
</style>

<template>
	<div style="width: 880px; height: 460px; user-select: none; margin-top: 20px;">

		<!-- まいんすいーぱーの箇所 コメントアウト -->

		<!-- <div class="mlr-a rowlength" :style="rowlen" style="margin-top: 64px; z-index: 5;">
			<div class="mlr-a" v-for="(row, i) in minesrow" :key="i" style="display: flex;">
				<div class="minescell back-e" v-for="(data, j) in row" :key="j" style="font-size: 32px; text-align: center; border-radius: 4px; margin: 4px;" v-on:click.left="minedig(i, j)">
					<div v-if="digrow[i][j] == minesenum.dig" class="minescell back-e" style="border-radius: 4px;">{{ data }}</div>
					<div v-else-if="digrow[i][j] == minesenum.flag" class="minescell back-r" style="width: 100%; height: 100%; border-radius: 4px;"></div>
					<div v-else class="minescell back-e" style="border-radius: 4px;"></div>
				</div>
			</div>
		</div> -->

		<!-- <div :class="drawf" id="main" style="position: absolute; top: 0; margin-top: 32px;"> -->
		<div class="mlr-a" :class="drawf" id="main" style="width: 840px;">
			<!-- <p style="user-select: none;">X: {{ mouseX }} Y: {{ mouseY }}</p> -->
			<!-- position: absolute; -->
			<canvas class="canvaslayer" style="border:0.6px solid rgb(175, 175, 175); border-radius: 4px;  position: absolute;"
				ref="canvas1" width="840" height="460"
				v-on:mousemove="paint"
				v-on:mousedown="dragStart"
				v-on:mouseup="dragEnd"
				v-on:mouseout="dragEnd"
				>
			</canvas>
		</div>

	</div>


	<div class="mlr-a" style="height: 120px;">

		<div style="width: 320px; display: flex; margin-left: auto; margin-right: auto; margin-top: 12px;">
			<!-- <button v-on:click="memomode = !memomode" style="width: 120px; margin-left: auto; margin-right: auto; z-index: 12; user-select: none;">
				メモする : {{ memomode }}
			</button> -->

			<!-- マインスイーパ機能 -->
			<!-- <button v-on:click="mine_dig_flag = !mine_dig_flag" style="width: 120px; margin-left: auto; margin-right: auto; z-index: 12;">
				掘る : {{ mine_dig_flag }}
			</button> -->
		</div>

		<div style="margin-top: 8px;">
			<div style="width: 320px; display: flex; margin-left: auto; margin-right: auto;">
				<div style="margin-left: auto; margin-right: auto; height:">
					<button v-on:click="colorch('#df2a2a',0)" style="border: none; background-color: #df2a2a; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#dfd32a',0)" style="border: none; background-color: #dfd32a; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#2a3cdf',0)" style="border: none; background-color: #2a3cdf; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#252525',0)" style="border: none; background-color: #252525; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<button v-on:click="colorch('#fff',0)" style="border: 1px solid; background-color: #fff; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
					<!-- <button v-on:click="colorch('#fff',1)" style="border: 1px solid; background-color: #fff; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button> -->
					<button v-on:click="clear" style="border: 1px dashed; background-color: #fff; border-radius: 4px; width: 32px; height: 32px; z-index: 12; margin-left: 2px; margin-right: 2px;"></button>
				</div>
			</div>
			<div style="text-align: center; margin-top: 4px;"><input type="range" name="speed" min="1" max="36" v-model="linewid" style=""><label style="margin-left: 4px;">{{ linewid }}</label></div>
			<div style="display: flex; width: 120px; margin-left: auto; margin-right: auto; align-items: center;">
				<div class="colcell" style="margin-left: auto; margin-right: auto; width: 8px; height: 8px; border-radius: 50%; border: 1px solid #555;" v-on:click="pensizech(8)"></div>
				<div class="colcell" style="margin-left: auto; margin-right: auto; width: 12px; height: 12px; border-radius: 50%; border: 1px solid #555;" v-on:click="pensizech(12)"></div>
				<div class="colcell" style="margin-left: auto; margin-right: auto; width: 16px; height: 16px; border-radius: 50%; border: 1px solid #555;" v-on:click="pensizech(16)"></div>
				<div class="colcell" style="margin-left: auto; margin-right: auto; width: 24px; height: 24px; border-radius: 50%; border: 1px solid #555;" v-on:click="pensizech(24)"></div>
				<div class="colcell" style="margin-left: auto; margin-right: auto; width: 36px; height: 36px; border-radius: 50%; border: 1px solid #555;" v-on:click="pensizech(36)"></div>
			</div>
		</div>
		<!-- <div class="mlr-a"><div style="text-align: center;"> {{ drawimg }} </div></div> -->
		<!-- <div class="mlr-a"><div style="text-align: center;"><img :src="drawimg"></div></div> -->
	</div>
	<!-- <DrawTool /> -->

</template>

<script>
import { pushScopeId } from 'vue';
import io from "socket.io-client";

const minesenum = {dig:'dig',flag:'flag',none:'none'}

export default {
	name: 'App',
	props: ['roomid', 'socket'],
	components: {
	},
	el: "#main",
	data: () => (
		{
			minesenum: minesenum,
			digrow: [[minesenum.none,minesenum.none,minesenum.none,minesenum.none],[minesenum.none,minesenum.none,minesenum.none,minesenum.none],[minesenum.none,minesenum.none,minesenum.none,minesenum.none],[minesenum.none,minesenum.none,minesenum.none,minesenum.none],],
			minesrow: [['','','',''],['','','',''],['','','',''],['','','','']],
			minescnt: 4,
			rowcnt: 4,
			memomode: true,
			mouseX: 0,
    		mouseY: 0,
			isDrag: false,
			mine_dig_flag: true,
			canvas: null,
			context: null,
			drawstyle: 0,
			linewid: 1,
			connectcnt: 0,
			nowpath: null, 
			drawimg: null,
			colornum: "#fff",
			layercnt: 0,
		}
	),
	created() {
		// var socket =  this.socket
		this.socket.on("connect", () => {
			// this.socket.emit("joinmineswiper");
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
		colnum() {
			return {
				'--colnum' : this.colornum
			}
		}
		
	},
	watch: {
	},
	mounted() {

		this.canvas = this.$refs.canvas1;
		// console.log(this.canvas)
		
		console.log(this.canvas)
		let targets = document.getElementsByClassName('canvaslayer');
		console.log(targets)

    	this.context = this.canvas.getContext("2d");
		this.context.lineCap = 'round';
		this.context.lineJoin = 'round';
		this.context.lineWidth = 1;
		this.context.strokeStyle = '#dfb52a';
		this.context.fillStyle = 'rgb( 255, 255, 255)';
		this.context.fillRect(0, 0, 840, 460);

		this.socket.emit("initcanvas", this.roomid, this.drawimg);

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
			console.log("start")
			this.nowpath = this.context.beginPath();
			this.context.lineTo(x, y);
			this.context.stroke();
		});

		this.socket.on("paint", (x, y) => {
			this.context.lineTo(x, y);
			this.context.stroke();
		});

		this.socket.on("dragEnd", () => {
			this.nowpath = this.context.closePath();
			console.log("end")
		});

		this.socket.on("canvas", (canvasimgurl) => {
			this.drawimg = canvasimgurl
			console.log(this.drawimg)
			const chara = new Image();
			chara.src = this.drawimg;
			chara.onload = () => {
				this.context.drawImage(chara, 0, 0, 840, 460)
			};
		});

		this.socket.on("clear", () => {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		});

		this.socket.on("colorch", (colornum, stylenum) => {
			this.colornum = colornum;
			this.context.strokeStyle = colornum;
			this.drawstyle = stylenum;
			if(this.drawstyle == 0) { this.context.globalCompositeOperation = 'source-over'; }
			else if(this.drawstyle == 1) { this.context.globalCompositeOperation = 'destination-out'; }
		});

		this.socket.on("widthch", (linewidth) => {
			this.context.lineWidth = linewidth;
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

			if(!this.isDrag) {
				return;
			}
			// this.context.fillRect(this.mouseX, this.mouseY, 2, 2);

			var x = e.pageX - this.rect.left
			// var y = e.layerY -24
			var y = e.pageY - this.rect.top
			this.socket.emit("paint", this.roomid, x, y);
		},
		clear: function() {
			this.socket.emit("clear", this.roomid);
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		colorch: function(colornum, stylenum) {
			this.colornum = colornum
			this.context.strokeStyle = colornum;

			this.socket.emit("colorch", this.roomid, colornum, stylenum);
		},
		pensizech(num) {
			this.linewid = num;
		},
		dragStart:function(e) {
			var x = e.pageX - this.rect.left
			// var y = e.layerY -24
			var y = e.pageY - this.rect.top

			this.context.lineWidth = this.linewid;
			this.socket.emit("widthch", this.roomid, this.linewid);
			this.socket.emit("dragStart", this.roomid, x, y);

			this.isDrag = true;
		},
		// 描画終了（mouseup, mouseout）
		dragEnd: function() {
			if(!this.isDrag) {
				return;
			}

			this.socket.emit("dragEnd", this.roomid);
			this.isDrag = false;

			var nowDate = new Date();
			var year = nowDate.getFullYear();
			var month = nowDate.getMonth()+1;
			var date = nowDate.getDate();
			var hor = nowDate.getHours();
			var min = nowDate.getMinutes();
			var sec = nowDate.getSeconds();

			var now = year + '_' + month + '_' + date + '_' + hor + '_' + min + '_' + sec;

			// const a = document.createElement("a");
			// a.href = this.canvas.toDataURL("image/png", 1); // PNGなら"image/png"
			// a.download = now + ".png";
			// this.drawimg = this.canvas.toDataURL("image/png", 1)
			this.socket.emit("canvas", this.roomid, this.canvas.toDataURL("image/png", 1));

			// var base64 = this.canvas.toDataURL("image/png");
			// this.canvas.href = base64;
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
.colcell {
	background-color: var(--colnum);
}
</style>

<template>
    <div class="mlr-a" style="width: 1200px;">
        <h1>DrawTool</h1>
		<div id="canvas-area">
			<canvas id="myCanvas" width="1200px" height="400px" @mousedown="dragStart" @mouseup="dragEnd" @mouseout="dragEnd" @mousemove="draw"></canvas>
		</div>
    </div>
</template>

<script>
export default {
	name: "DrawTool",
	data() {
		return {
			canvas: null,
			context: null,
			isDrag: false
		};
	},
	mounted(){
		this.canvas = document.getElementById('myCanvas')
		this.context = this.canvas.getContext('2d')
		this.context.lineCap = 'round';
		this.context.lineJoin = 'round';
		this.context.lineWidth = 5;
		this.context.strokeStyle = '#000000';
		this.context.fillStyle = "blue";
		this.context.fillRect(10, 10, 150, 150);
	},
	methods: {
		// 描画
		draw :function(e) {
			var x = e.layerX
			var y = e.layerY
		
			if(!this.isDrag) {
				return;
			}
		
			this.context.lineTo(x, y);
			this.context.stroke();
		},
		// 描画開始（mousedown）
		dragStart:function(e) {
			console.log("start")
			var x = e.layerX
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
};
</script>

<style scoped>
.mlr-a {
	margin-left: auto; margin-right: auto;
}

#myCanvas {
	border-radius: 4px;
	border: 2px solid #a3a3a3;
	width:1200px;
	height:400px;
}
</style>
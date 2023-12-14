<template>
	<div class="mlr-a" style="min-width: 880px; max-width: 1260px; display: flex; flex-wrap: wrap; padding-top: 24px;">
		<div class="mlr-a">
			<div>
				<label>文字列</label>
				<input type="text" v-model="inputText">
				<input type="button" @click="generate" value="生成">
			</div>
			<vue-qrcode v-if="targetText" :value="targetText" :options="option" tag="img"></vue-qrcode>
		</div>
	</div>
	<div>
		<p class="decode-result">Last result: <b>{{ result }}</b></p>
		<qr-capture @decode="onDecode" />
  	</div>
</template>
  
<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { QrStream, QrCapture, QrDropzone } from 'vue3-qr-reader';

export default {
	components: {
		VueQrcode,
		QrStream,
		QrCapture,
		QrDropzone
	},
	data() {
		return {
			inputText: "",
			targetText: "",
			option: {
				errorCorrectionLevel: "M",
				maskPattern: 0,
				margin: 10,
				scale: 2,
				width: 300,
				color: {
				dark: "#000000FF",
				light: "#FFFFFFFF"
				}
			},
			result: null,
			error: null,
			dragover: false
		};
	},
	methods: {
		generate: function() {
			this.targetText = this.inputText;
		},
		onDecode (result) {
			console.log(result)
			this.result = result
		},

		logErrors (promise) {
			promise.catch(console.error)
		},

		onDragOver (isDraggingOver) {
			this.dragover = isDraggingOver
		}
	}
};
</script>

<style scoped>
.mlr-a {
	margin-left: auto; margin-right: auto;
}

.drop-area {
  height: 300px;
  color: #fff;
  text-align: center;
  font-weight: bold;
  padding: 10px;

  background-color: rgba(0,0,0,.5);
}

.dragover {
  background-color: rgba(0,0,0,.8);
}

.drop-error {
  color: red;
  font-weight: bold;
}
</style>
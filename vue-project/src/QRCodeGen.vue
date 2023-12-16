<template>
	<div class="mlr-a" style="margin-top: 24px; padding-top: 24px; padding-bottom: 24px; background-color: #fff; min-width: 640px; max-width: 720px; border-radius: 32px;">
		<p style="margin-bottom: 24px; font-weight: 600; font-size: 16px; text-align: center;"> Gen QRcode</p>
		<div class="mlr-a" style="text-align: center;">
			<div style=" margin-bottom: 12px;">
				<!-- <label>文字列</label> -->
				<!-- <input type="text" v-model="inputText"> -->
				<input type="button" @click="generate" value="部屋生成" style="padding: 2px 12px;">
			</div>
			<vue-qrcode v-if="targetText" :value="targetText" :options="option" tag="img"></vue-qrcode>
		</div>
		<div class="mlr-a" style="text-align: center;">
			<p v-if="rommjsondata"> room : "{{ rommjsondata.room }}"</p>
			<p v-if="rommjsondata"> pass : "{{ rommjsondata.pass }}"</p>
		</div>
	</div>
	<div class="mlr-a" style="min-width: 640px; max-width: 720px; border-radius: 32px; padding-top: 24px; padding-bottom: 24px; text-align: center; margin-top: 32px; background-color: #fff;">
		<p style="margin-bottom: 24px; font-weight: 600; font-size: 16px;" class="decodetext">QRcode decode</p>
		<qr-capture @decode="onDecode" />
		<div style="margin-top: 12px;">
			<p v-if="decodejsondata"> room : "{{ decodejsondata.room }}"</p>
			<p v-if="decodejsondata"> pass : "{{ decodejsondata.pass }}"</p>
		</div>
		<!-- <p class="decode-result">Last result: <b>{{ result }}</b></p> -->
		<!-- <p>rommjsondata</p> -->
		<!-- <p>{{ rommjsondata }}</p> -->
		
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
				margin: 4,
				scale: 2,
				width: 300,
				color: {
				dark: "#000000FF",
				light: "#FFFFFFFF"
				}
			},
			result: null,
			error: null,
			dragover: false,
			rommjsondata: null,
			decodejsondata: null,
		};
	},
	methods: {
		generate: function() {
			var room = getRndStr(8);
			var rnd = 0;
			while (true) {
				rnd = Math.floor(Math.random() * 32);
				if (rnd > 6) break;
			}
			var pass = getRndStrPass(rnd);
			const json = '{"room":"' + room +'", "pass":"' + pass + '"}';
			this.targetText = json;
			this.rommjsondata = JSON.parse(json);
		},
		onDecode (result) {
			console.log(result)
			this.result = result

			this.decodejsondata = JSON.parse(this.result);
		},

		logErrors (promise) {
			promise.catch(console.error)
		},

		onDragOver (isDraggingOver) {
			this.dragover = isDraggingOver
		}
	}
};

function getRndStr(len){
	//使用文字の定義
	var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	
	//桁数の定義
	var len = len;
	
	//ランダムな文字列の生成
	var result = "";
	for(var i=0;i<len;i++){
		result += str.charAt(Math.floor(Math.random() * str.length));
	}
	return result;
}

function getRndStrPass(len){
	//使用文字の定義
	var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!";
	
	//桁数の定義
	var len = len;
	
	//ランダムな文字列の生成
	var result = "";
	for(var i=0;i<len;i++){
		result += str.charAt(Math.floor(Math.random() * str.length));
	}
	return result;
}

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

.decodetext ::after {
	background-color: rgb(255, 0, 0);
	height: 12px;
}
</style>
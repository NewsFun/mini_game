module utils {

	export class Base64 {

		private static _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		/**
		 * 判断是否原生支持Base64位解析
		 * @version Egret 3.0.3
		 */
		static get nativeBase64() {
			return (typeof (window.atob) === "function");
		}

		/**
		 * 解码
		 * @param input
		 * @version Egret 3.0.3
		 */
		static decode(input: string): string {
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			if (this.nativeBase64) {
				return window.atob(input);
			} else {
				var output: any = [], chr1: number, chr2: number, chr3: number, enc1: number, enc2: number, enc3: number, enc4: number, i: number = 0;

				while (i < input.length) {
					enc1 = this._keyStr.indexOf(input.charAt(i++));
					enc2 = this._keyStr.indexOf(input.charAt(i++));
					enc3 = this._keyStr.indexOf(input.charAt(i++));
					enc4 = this._keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output.push(String.fromCharCode(chr1));

					if (enc3 !== 64) {
						output.push(String.fromCharCode(chr2));
					}
					if (enc4 !== 64) {
						output.push(String.fromCharCode(chr3));
					}
				}

				output = output.join("");
				return output;
			}
		}


		/**
		 * 编码
		 * @param input
		 * @version Egret 3.0.3
		 */
		static encode(input: string): string {
			input = input.replace(/\r\n/g, "\n");
			if (this.nativeBase64) {
				return window.btoa(input);
			} else {
				var output: any = [], chr1: number, chr2: number, chr3: number, enc1: number, enc2: number, enc3: number, enc4: number, i: number = 0;
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output.push(this._keyStr.charAt(enc1));
					output.push(this._keyStr.charAt(enc2));
					output.push(this._keyStr.charAt(enc3));
					output.push(this._keyStr.charAt(enc4));
				}

				output = output.join("");
				return output;
			}
		}

		static encodeArrayToBase64 = function (buffer: ArrayBuffer) {
			var bytes = new Uint8Array(buffer),
				i, len = bytes.length, base64 = "";

			for (i = 0; i < len; i += 3) {
				base64 += this._keyStr[bytes[i] >> 2];
				base64 += this._keyStr[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
				base64 += this._keyStr[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
				base64 += this._keyStr[bytes[i + 2] & 63];
			}

			if ((len % 3) === 2) {
				base64 = base64.substring(0, base64.length - 1) + "=";
			} else if (len % 3 === 1) {
				base64 = base64.substring(0, base64.length - 2) + "==";
			}

			return base64;
		};

		/**
		 * 解析Base64格式数据
		 * @param input
		 * @param bytes
		 * @version egret 3.0.3
		 */
		static decodeBase64AsArray(input: string): ArrayBuffer {
            var lookup = new Uint8Array(256);
            for (var j = 0; j < this._keyStr.length; j++) {
                lookup[this._keyStr.charCodeAt(j)] = j;
            }

            var bufferLength = input.length * 0.75,
                len = input.length, i, p = 0,
                encoded1, encoded2, encoded3, encoded4;

            if (input[input.length - 1] === "=") {
                bufferLength--;
                if (input[input.length - 2] === "=") {
                    bufferLength--;
                }
            }

            var arraybuffer = new ArrayBuffer(bufferLength),
                bytes = new Uint8Array(arraybuffer);

            for (i = 0; i < len; i += 4) {
                encoded1 = lookup[input.charCodeAt(i)];
                encoded2 = lookup[input.charCodeAt(i + 1)];
                encoded3 = lookup[input.charCodeAt(i + 2)];
                encoded4 = lookup[input.charCodeAt(i + 3)];

                bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
                bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }

            return arraybuffer;
		}

		/**
		 * 暂时不支持
		 * @param data
		 * @param decoded
		 * @param compression
		 * @version egret 3.0.3
		 * @private
		 */
		static decompress(data: string, decoded: any, compression: string): any {
			throw new Error("GZIP/ZLIB compressed TMX Tile Map not supported!");
		}

		/**
		 * 解析csv数据
		 * @param input
		 * @version egret 3.0.3
		 */
		static decodeCSV(input: string): Array<number> {
			var entries: Array<any> = input.replace("\n", "").trim().split(",");

			var result: Array<number> = [];
			for (var i: number = 0; i < entries.length; i++) {
				result.push(+entries[i]);
			}
			return result;
		}
	}
}

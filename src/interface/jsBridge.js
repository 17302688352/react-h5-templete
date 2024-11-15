/**
 * 鑫一付 和 Plus JSBridge
 */

import deviceMark from "./deviceMark";

export const initJSBridge = () => {
	if (window.JSBridge) return window.JSBridge;
	let callbackIdCalculator = 0;
	const callbacks = {};
	const registerFuncs = {};
	let nativeBridge = null;

	if (deviceMark.isXYF) {
		nativeBridge = window.ReactNativeWebView || window;
	} else {
		if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.mpos_bridge) {
			// ios的WKWebView
			nativeBridge = window.webkit.messageHandlers.mpos_bridge;
		} else if (window.mpos_bridge) {
			// android 4.2以上
			nativeBridge = window.mpos_bridge;
		} else {
			nativeBridge = {
				postMessage() {
					console.log("未知设备调用postMessage!");
				}
			};
		}
	}

	window.JSBridge = {
		// js调用native接口, 如果只是注册，并不调用,data不用传或传null，返回一个id
		// 当想执行时 callback设为返回的id，并附上需要的参数
		invoke(functionName, callback, data = {}, async = false) {
			let thisCallbackId;
			if (typeof callback === "function") {
				thisCallbackId = ++callbackIdCalculator;
				callbacks[thisCallbackId] = callback;
				if (data === null) {
					return thisCallbackId;
				}
			} else {
				thisCallbackId = callback;
			}

			if (deviceMark.isXYF) {
				nativeBridge.postMessage(
					JSON.stringify({
						functionName,
						data: data || {},
						callbackId: thisCallbackId,
						async
					})
				);
			} else if (deviceMark.isPlus) {
				if (deviceMark.isIOS) {
					nativeBridge.postMessage({
						functionName,
						data: data || {},
						callbackId: thisCallbackId
					});
				} else {
					if (deviceMark.getAndroidVersion() <= 4.2) {
						const result = prompt(
							`mposjs://postMessage?jsonParams=${JSON.stringify({
								data,
								functionName,
								callbackId: thisCallbackId
							})}`
						);
						if (result) {
							this.receiveMessage(result);
						}
					} else {
						nativeBridge.postMessage(
							JSON.stringify({
								functionName,
								data: data || {},
								callbackId: thisCallbackId
							})
						);
					}
				}
			} else {
				throw Error("未知移动设备！");
			}
			return undefined;
		},
		// native调用js
		receiveMessage(params) {
			const { functionName, callbackId, responseId, errorCode, errorMsg } = params;
			const data = params.data || {};

			if (errorCode) {
				console.log(errorCode, errorMsg);
			}

			if (callbackId && callbacks[callbackId]) {
				callbacks[callbackId](data);
			} else if (functionName) {
				const result = {};
				if (registerFuncs[functionName]) {
					Object.assign(result, registerFuncs[functionName](data));
				} else {
					result.error = "web未找到调用方法";
				}

				if (deviceMark.isXYF) {
					// 鑫一付 通过 postMessage 返回JSON
					nativeBridge.postMessage(
						JSON.stringify({
							responseId,
							data: result
						})
					);
				} else if (deviceMark.isPlus) {
					// ios通过postMessage返回
					if (deviceMark.isIOS) {
						nativeBridge.postMessage({
							responseId,
							data: result
						});
					} else {
						if (deviceMark.getAndroidVersion() >= 4.4) {
							// 先判断是不是android4.4以上、如果是直接返回
							return {
								responseId,
								data: result
							};
						} else if (deviceMark.getAndroidVersion() <= 4.2) {
							// 如果是android4.2以下，通过prompt返回
							prompt(
								`mposjs://postMessage?jsonParams=${JSON.stringify({
									responseId,
									data: result
								})}`
							);
						} else {
							// 剩下的android通过postMessage返回
							nativeBridge.postMessage(
								JSON.stringify({
									responseId,
									data: result
								})
							);
						}
					}
				} else {
					throw Error("未知移动设备！");
				}
			}
			return undefined;
		},
		// 提供给native调用的方法，此方法有待扩充
		register: (functionName, callback) => {
			// Fixed 允许重新注册方法
			registerFuncs[functionName] = callback;
		}
	};

	if (deviceMark.isXYF) {
		if (deviceMark.isIOS) {
			window.addEventListener("message", (textValue) => {
				if (typeof textValue.data === "string" && textValue.origin.indexOf("https://qiyukf.com") === -1) {
					try {
						window.JSBridge.receiveMessage(JSON.parse(textValue.data));
					} catch (e) {
						console.log(e);
					}
				} else {
					window.JSBridge.receiveMessage(textValue.data);
				}
			});
		} else {
			window.document.addEventListener("message", (textValue) => {
				if (textValue.origin.indexOf("https://qiyukf.com") === -1) {
					window.JSBridge.receiveMessage(JSON.parse(textValue.data));
				}
			});
		}
	}

	return undefined;
};

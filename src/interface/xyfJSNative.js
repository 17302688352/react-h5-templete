import { handleAppVersion } from "./utils";

const emptyMethod = function () {};

/**
 * 打开新页面
 **/
const xyf_nativeOpenNewWebView = (params, callback = emptyMethod) => {
	window.JSBridge.invoke("openNewNativeWebView", callback, params);
};

/**
 * 关闭当前WebView
 **/
const xyf_nativeCloseWebview = () => {
	window.JSBridge.invoke("closeWindow");
};
/**
 * 获取用户基础信息
 **/
const xyf_getNativeRequestBaseParams = (callback = emptyMethod) => {
	window.JSBridge.invoke("getRequestBaseParams", (res) => callback(res), {});
};

/**
 * 获取位置信息
 * 返回示例
 * {
    cityCode: "010"
    cityName: "北京市"
    country: "中国"
    countyCode: "110107"
    countyName: "石景山区"
    detailAddress: "实兴大街"
    latiTude: "39.937271"
    longAddress: "北京市石景山区实兴大街靠近西山汇"
    longiTude: "116.191752"
    province: "北京市"
}
 * */
const xyf_getNativeLocationInfo = (callback = emptyMethod) => {
	window.JSBridge.invoke(
		"getLocationInfo",
		(response) => {
			const { citycode, city, country, adcode, district, street, coordinate, formattedAddress, province } = response || {};
			const { latitude, longitude } = coordinate || {};
			callback({
				cityCode: citycode,
				cityName: city,
				country,
				countyCode: adcode,
				countyName: district,
				detailAddress: street,
				latiTude: latitude.toFixed(6).toString(),
				longAddress: formattedAddress,
				longiTude: longitude.toFixed(6).toString(),
				province
			});
		},
		{}
	);
};

/**
 * @description 调用原生的图片上传
 * @param call
 */
const xyf_openImagePicker = (callback = emptyMethod) => {
	window.JSBridge.invoke(
		"openImagePicker",
		(res) => {
			callback(res);
		},
		{}
	);
};

/**
 * @description 保存图片到相册
 */
const xyf_saveImageToPhoneLibrary = (params) => {
	window.JSBridge.invoke("generateImage", null, params);
};

/**
 * 展示右侧文字按钮
 * @param params {visible: boolean, text: string }
 */
const xyf_nativeShowRightButton = (callback = emptyMethod, params) => {
	console.log("调用--", params);
	window.JSBridge.invoke("rightButton", callback, params, true);
};

/**
 *  调用原生分享功能
 *  webpageUrl: 打开连接
 *  title: 分享标题
 *  description: 分享的详细描述
 *  thumbImageUrl: 图片的URL地址
 *  shareContentType: 01 网页， 其他的是图片
 *  scene：0微信聊天、 1微信朋友圈 需要传的是数字类型！！！
 */
const xyf_nativeShareToWeChat = (
	params = {
		webPageUrl: "",
		title: "",
		description: "",
		thumbImageUrl: "",
		shareContentType: "01",
		scene: 0
	}
) => {
	window.JSBridge.invoke("shareToWeChat", null, params);
};

/**
 * 调用原生 支付宝 交易
 * @param params: {orderString: '订单号'}
 */
const xyf_nativeAliPay = (orderString, callback = emptyMethod) => {
	window.JSBridge.invoke(
		"aliPay",
		(response) => {
			/**
			 * resultStatus
			 * 9000: 订单支付成功
			 * 8000: 正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
			 * 4000: 订单支付失败
			 * 5000: 重复请求
			 * 6001: 用户中途取消
			 * 6002: 网络连接出错
			 * 6004: 支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
			 * 其它: 其它支付错误
			 */
			console.log("支付宝----->>>", response);
			const { resultStatus } = response;
			const payDone = resultStatus === "9000" || resultStatus === "8000" || resultStatus === "6004";
			if (resultStatus === "6001") {
				response["memo"] = "您已取消支付!";
			}
			callback({ payDone, ...response });
		},
		{ payStr: orderString }
	);
};

const xyf_nativePages = {
	coupon: "MineCouponList", // 优惠券
	homePage: "PaymentPage", // 首页
	homePayQr: "SmallAmountGathering", // 首页二维码支付tab
	setting: "SettingPage" // 设置页面
};

/**
 * 打开原生页面
 **/
const xyf_nativeOpenPage = (params, callback = () => {}) => {
	window.JSBridge.invoke("openNativePage", callback, params);
};

const xyf_newOpenNativePage = (params, callback = () => {}) => {
	window.JSBridge.invoke("newOpenNativePage", callback, params);
};

/**
 * 自定义返回按钮的功能
 * @param request
 * @param call
 */
const xyf_nativeResetBackButton = (request = {}, call = emptyMethod) => {
	window.JSBridge.invoke("resetBackButton", call, request, true);
};

/*
 * 关闭iOSWebView自带弹簧效果
 * */
const xyf_closeWebViewScrollBounces = () => {
	window.JSBridge.invoke("bouncesStatus", { status: false }, {});
};

/*
 * 修改title
 * */
const xyf_setTitle = (title) => {
	console.log("JSBridge", window?.JSBridge?.invoke);
	window.JSBridge.invoke("resetTitle", () => {}, { title });
};

/**
 * @description 获取APP当前通知开启状态
 * @param successCallback
 */
const xyf_getNotificationStatus = (call = emptyMethod) => {
	xyf_getNativeRequestBaseParams((res) => {
		const appVersions = handleAppVersion(res.APP_VERSIONS);
		if (appVersions >= 319) {
			window.JSBridge.invoke(
				"getNotificationStatus",
				(data) => {
					call(data);
				},
				{}
			);
		} else {
			call({});
		}
	});
};

/**
 * 获取当前APP内首页积分tab角标上的类型及内容
 */
const xyf_getMainIntegralTabTextAndType = (call = emptyMethod) => {
	xyf_getNativeRequestBaseParams((res) => {
		if (parseInt(res.APP_VERSIONS.replace(/\./g, "")) >= 319) {
			window.JSBridge.invoke(
				"getMainIntegralTabTextAndType",
				(data) => {
					call(data);
				},
				false
			);
		} else {
			call({});
		}
	});
};

/**
 * 打开APP设置-消息提醒页面
 */
const xyf_openNotificationSettingPage = (request = {}) => {
	xyf_getNativeRequestBaseParams((res) => {
		if (parseInt(res.APP_VERSIONS.replace(/\./g, "")) >= 319) {
			window.JSBridge.invoke("openNotificationSettingPage", () => {}, request);
		}
	});
};

// 启动原生人脸识别功能
const xyf_nativeStartLiveFace = (callback = emptyMethod) => {
	xyf_nativeOpenPage({
		routeName: "LiveDetectionGuideWebView"
	});
	window.JSBridge.register("webGlobalEvent", (result) => {
		const { type, data } = result;
		switch (type) {
			case "face":
				callback(data);
				break;
			default:
		}
	});
};

// 打开原生相机方法
const xyf_nativeOpenCameraLibrary = (callback = emptyMethod) => {
	window.JSBridge.invoke(
		"nativeOpenCameraLibrary",
		(res) => {
			callback({ imgBase64String: res });
		},
		{}
	);
};

/**
 * 唤起原生扫描身份证识别功能
 * source
 * UPDATE_ID_CARD(部分数据，姓名、身份证号、起始日期、截止日期、正面照片、反面照片、头像),
 * ALL 全量数据
 * name、idCard、sex、nation、birthday、organization、startTime、endTime、frontPhotoPath、backPhotoPath、headerPhotoPath
 */
// nativeStartScanIdCard
const xyf_nativeStartScanIdCard = (params = { source: "ALL" }, callback = emptyMethod) => {
	window.JSBridge.invoke(
		"startScanIdCard",
		(res) => {
			callback(res);
		},
		params
	);
};

export {
	xyf_nativePages,
	xyf_nativeOpenNewWebView,
	xyf_nativeCloseWebview,
	xyf_getNativeRequestBaseParams,
	xyf_getNativeLocationInfo,
	xyf_openImagePicker,
	xyf_saveImageToPhoneLibrary,
	xyf_nativeShowRightButton,
	xyf_nativeAliPay,
	xyf_nativeOpenPage,
	xyf_newOpenNativePage,
	xyf_closeWebViewScrollBounces,
	xyf_nativeOpenCameraLibrary,
	xyf_setTitle,
	xyf_nativeShareToWeChat,
	xyf_nativeResetBackButton,
	xyf_getNotificationStatus,
	xyf_getMainIntegralTabTextAndType,
	xyf_openNotificationSettingPage,
	xyf_nativeStartLiveFace,
	xyf_nativeStartScanIdCard
};

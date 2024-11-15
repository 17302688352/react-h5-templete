/**
 * 打开相机
 * */
import { Toast } from "antd-mobile";
import deviceMark from "@/interface/deviceMark";
import { handleAppVersion } from "./utils";

const emptyMethod = function () {};

/**
 * 打开新页面
 **/
const plus_nativeOpenNewWebView = (params, callback = emptyMethod) => {
	if (deviceMark.isIOS) {
		window.JSBridge.invoke("openPage", callback, params);
	} else {
		window.JSBridge.invoke("openNewNativeWebView", callback, params);
	}
};

/**
 * 关闭当前WebView
 **/
const plus_nativeCloseWebview = () => {
	window.JSBridge.invoke("closeCurrentWebview");
};

const plus_openCamera = (callback = emptyMethod) => {
	window.JSBridge.invoke(
		"nativeOpenCamera",
		(res) => {
			const { imgBase64String } = res || {};
			callback({ data: imgBase64String });
		},
		{}
	);
};

/**
 * 打开相册
 * */
const plus_openPhotoLibrary = (callback = emptyMethod) => {
	window.JSBridge.invoke(
		"nativeOpenPhotoLibrary",
		(res) => {
			const { imgBase64String } = res || {};
			callback({ data: imgBase64String });
		},
		{}
	);
};

/**
 * 获取用户基础信息
 **/
const plus_getNativeRequestBaseParams = (callBack = emptyMethod) => {
	window.JSBridge.invoke("getRequestBaseParams", callBack, {});
};

/**
 * 获取位置信息
 * 位置为空的时候，key有值，value为空串
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
const plus_getNativeLocationInfo = (callback = emptyMethod) => {
	window.JSBridge.invoke("GetLocationHandler", callback, {});
};

/**
 * @description 保存图片到相册
 */
const plus_saveImageToPhoneLibrary = (params) => {
	window.JSBridge.invoke(
		"downloadPic",
		(res) => {
			const { result } = res || {};
			if (result === "Y") {
				Toast.show("保存成功");
			} else {
				Toast.show("保存失败");
			}
		},
		params
	);
};

/**
 * 展示右侧文字按钮
 * @param params {visible: boolean, text: string }
 * @param callback
 */
const plus_nativeShowRightButton = (params, callback = emptyMethod) => {
	window.JSBridge.invoke("setNavigationBarRightTitle", callback, params);
};

/**
 * 调用原生分享功能(包含web功能)
 * @param params:    { shareUrl, title, hint, shareImgUrl }
 * @param callback:  ({ type: 'COPY_URL' / 'QR_CODE' }) => {}
 * Example:
 *        nativeWebShare({ shareUrl, title, hint, shareImgUrl }, (data) => {
 *          if (type == 'COPY_URL') { ...处理点击复制URL返回  }
 *          else if (type == 'QR_CODE') { ...处理点击二维码返回 }
 *        });
 */
const plus_nativeWebShare = (params = { shareUrl: "", title: "", hint: "", shareImgUrl: "" }, callback = emptyMethod) => {
	window.JSBridge.invoke("nativeWebShare", (response) => callback(response), params);
};

/**
 *  调用原生分享功能
 *  shareUrl: 打开连接
 *  title: 分享标题
 *  hint: 分享的详细描述
 *  shareImgUrl: 图片的URL地址
 *  entry: 平台 0001代表微信、0002代表朋友圈、0003代表QQ、0004代表QQ空间
 *  其中：可以只传一个分享通道、也可传入多个，用、号分割。
 */
const plus_nativeShare = (
	params = {
		shareUrl: "",
		title: "",
		hint: "",
		shareImgUrl: "",
		entry: "0001",
		shareContentType: deviceMark.isIOS ? "shareImageType" : undefined
	}
) => {
	window.JSBridge.invoke("customShare", null, params);
};

/**
 * 调用原生 支付宝 交易
 * @param params: {orderString: '订单号'}
 */
const plus_nativeAliPay = (orderString, callback = emptyMethod) => {
	window.JSBridge.invoke(
		"nativeAlipay",
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
			const { resultStatus } = response;
			const payDone = resultStatus === "9000" || resultStatus === "8000" || resultStatus === "6004";
			if (resultStatus === "6001") {
				response["memo"] = "您已取消支付!";
			}
			callback({ payDone, ...response });
		},
		{ orderString }
	);
};

/**
 * 打开原生登录界面，登录成功后回到web页面
 * @param call    成功回调
 * Example:
 *        nativeLogin((response) => {
 *          if (response.errorCode == '0000') { ...登录成功 }
 *          else { ...登录取消 }
 *        });
 */
const plus_nativeLogin = (callback = emptyMethod) => {
	window.JSBridge.invoke("nativeLogin", (response) => callback(response));
};

const plus_nativeQuitLogin = () => {
	window.JSBridge.invoke("logout", () => {}, {});
};

// iOS 版本 3.87之后支持跳原生页面，部分路由和Android有差别
const plus_nativePages = {
	coupon: "sxfPlus://operation/coupon", // 优惠券
	homePage: "sxfPlus://operation/homePayCard", // 首页
	homePayCard: "sxfPlus://operation/homePayCard", // 首页刷卡支付tab
	homePayQr: "sxfPlus://operation/homePayQr", // 首页二维码支付tab
	homePayYunPay: "sxfPlus://operation/homePayYunPay", // 首页云闪付tab
	taskCenter: "sxfPlus://TaskCenter", // 任务中心
	setting: "sxfPlus://operation/setting" // 设置页面
};

/*
 * 关闭iOSWebView自带弹簧效果
 * */
const plus_closeWebViewScrollBounces = () => {
	window.JSBridge.invoke("closeWebViewScrollBounces", null, {});
};

/**
 * 打开原生tabbar目录
 * sxfPlus://OpenMainPageShowAssignTab?tabType=HOME("HOME","ACTIVITY","MY","INTEGRAL")分别对应(收款,活动,我的,积分)
 * index = 0，1，2，3
 */
const plus_nativeOpenTabBarPage = (index) => {
	plus_getNativeRequestBaseParams((res) => {
		const appVersions = handleAppVersion(res.APP_VERSIONS);
		if (appVersions < 437) {
			Toast.show("暂不支持该功能");
		} else {
			let page = "HOME";
			if (index === 1) {
				page = "INTEGRAL";
			} else if (index === 2) {
				page = "ACTIVITY";
			} else if (index === 3) {
				page = "MY";
			}
			let url = `sxfPlus://OpenMainPageShowAssignTab?tabType=${page}`;
			plus_nativeOpenNewWebView({ url });
		}
	});
};

/**
 * @description 获取APP当前通知开启状态
 * @param successCallback
 */
const plus_getNotificationStatus = (call = emptyMethod) => {
	plus_getNativeRequestBaseParams((res) => {
		const appVersions = handleAppVersion(res.APP_VERSIONS);
		if (appVersions >= 442) {
			window.JSBridge.invoke(
				"getNotificationStatus",
				(response) => {
					call(response);
				},
				{}
			);
		} else {
			call({});
		}
	});
};
/**
 * 打开系统设置页面 - 通知页面
 * */
const plus_openNativeStystemSettingPage = () => {
	plus_getNativeRequestBaseParams((res) => {
		const appVersions = handleAppVersion(res.APP_VERSIONS);
		if (appVersions >= 453) {
			window.JSBridge.invoke("openSystemNotiPage", null, {});
		}
	});
};

/**
 * 获取当前APP内首页积分tab角标上的类型及内容
 */
const plus_getMainIntegralTabTextAndType = (successCallback) => {
	plus_getNativeRequestBaseParams((res) => {
		const appVersions = handleAppVersion(res.APP_VERSIONS);
		if (appVersions >= 442) {
			window.JSBridge.invoke(
				"getMainIntegralTabTextAndType",
				(response) => {
					successCallback(response);
				},
				{}
			);
		} else {
			successCallback({});
		}
	});
};

/**
 * 打开APP设置-消息提醒页面
 * @param request
 */
const plus_openNotificationSettingPage = (request = {}) => {
	plus_getNativeRequestBaseParams((res) => {
		const appVersions = handleAppVersion(res.APP_VERSIONS);
		if (appVersions >= 442) {
			window.JSBridge.invoke("openNotificationSettingPage", null, request);
		}
	});
};

// plus 启动人脸识别功能
const plus_nativeStartLiveFace = (callback = emptyMethod) => {
	window.JSBridge.invoke("nativeStartLiveFace", (res) => callback(res));
};
// 打开原生相机方法(带有Sheet弹框)
const plus_nativeOpenCameraLibrary = (callback = emptyMethod) => {
	window.JSBridge.invoke(
		"nativeOpenCameraLibrary",
		(res) => {
			callback(res);
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
const plus_nativeStartScanIdCard = (params = { source: "ALL" }, callback = emptyMethod) => {
	window.JSBridge.invoke(
		"startScanIdCard",
		(res) => {
			callback(res);
		},
		params
	);
};

export {
	plus_nativePages,
	plus_nativeOpenNewWebView,
	plus_nativeCloseWebview,
	plus_openCamera,
	plus_openPhotoLibrary,
	plus_getNativeRequestBaseParams,
	plus_getNativeLocationInfo,
	plus_saveImageToPhoneLibrary,
	plus_nativeShowRightButton,
	plus_nativeWebShare,
	plus_nativeAliPay,
	plus_nativeQuitLogin,
	plus_closeWebViewScrollBounces,
	plus_nativeShare,
	plus_nativeOpenTabBarPage,
	plus_getNotificationStatus,
	plus_getMainIntegralTabTextAndType,
	plus_openNotificationSettingPage,
	plus_nativeStartLiveFace,
	plus_nativeLogin,
	plus_openNativeStystemSettingPage,
	plus_nativeOpenCameraLibrary,
	plus_nativeStartScanIdCard
};

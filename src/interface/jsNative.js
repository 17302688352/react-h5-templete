/* 鑫一付 Plus 整合 js 调用 原生方法 */
import deviceMark, { IS_JXQY_MINI, IS_SSB_MINI, IS_XYF_MINI } from "./deviceMark";
import {
	xyf_getNativeLocationInfo,
	xyf_getNativeRequestBaseParams,
	xyf_nativeOpenNewWebView,
	xyf_nativeShowRightButton,
	xyf_openImagePicker,
	xyf_saveImageToPhoneLibrary,
	xyf_nativePages,
	xyf_nativeOpenPage,
	xyf_closeWebViewScrollBounces,
	xyf_setTitle,
	xyf_nativeShareToWeChat,
	xyf_nativeCloseWebview,
	xyf_getNotificationStatus,
	xyf_getMainIntegralTabTextAndType,
	xyf_nativeOpenCameraLibrary,
	xyf_openNotificationSettingPage,
	xyf_nativeStartLiveFace,
	xyf_nativeAliPay,
	xyf_nativeStartScanIdCard
} from "@/interface/xyfJSNative";

import {
	plus_getNativeLocationInfo,
	plus_getNativeRequestBaseParams,
	plus_nativeCloseWebview,
	plus_nativeOpenNewWebView,
	plus_nativeQuitLogin,
	plus_nativeShowRightButton,
	plus_openCamera,
	plus_saveImageToPhoneLibrary,
	plus_nativePages,
	plus_closeWebViewScrollBounces,
	plus_nativeShare,
	plus_getNotificationStatus,
	plus_getMainIntegralTabTextAndType,
	plus_openNotificationSettingPage,
	plus_nativeStartLiveFace,
	plus_nativeAliPay,
	plus_openNativeStystemSettingPage,
	plus_nativeOpenCameraLibrary,
	plus_nativeStartScanIdCard
} from "@/interface/plusJSNative";

import { mini_nativeCloseWebview, mini_getNativeRequestBaseParams, mini_nativeOpenNewWebView, mini_xyf_nativeJumpPage, mini_isWeixinMiniProgram } from "@/interface/miniWxNative";
import { dev_getNativeLocationInfo } from "./mockData";
import { Toast } from "@/components";
import { saLogout } from "@/utils/sa";
import { isWebUrl } from "@/utils";

const emptyMethod = function () {};

/**
 * 打开新页面
 **/
const nativeOpenNewWebView = (params) => {
	if (!params.url) return;
	if (deviceMark.isXYF) {
		xyf_nativeOpenNewWebView(params);
	} else if (deviceMark.isPlus) {
		plus_nativeOpenNewWebView(params);
	} else {
		if (IS_XYF_MINI || IS_JXQY_MINI) {
			mini_nativeOpenNewWebView(params);
		} else {
			window.location.href = `${isWebUrl(params.url) ? "" : window.origin}${params.url}`;
		}
	}
};
// 打开原生页面
const openNativePage = (name) => {
	if (deviceMark.isPlus) {
		nativeOpenNewWebView({
			url: plus_nativePages[name] || name
		});
	} else {
		if (deviceMark.isXYF) {
			xyf_nativeOpenPage({
				routeName: xyf_nativePages[name] || name
			});
		} else {
			if (IS_XYF_MINI || IS_SSB_MINI) {
				mini_xyf_nativeJumpPage(name);
			}
		}
	}
};
// 打开积分商城页面 source = 02Plus公众号,03xyf公众号
const nativeOpenPointsMallPage = async (source) => {
	const pointsMallUrl = `${window.location.origin}/points/pointsMall`;
	// 公众号中打开
	if (source === "02") {
		window.location.href = `https://mpaw.suixingpay.com/static/html/openAppWebPage.html?url=${encodeURIComponent(window.btoa(pointsMallUrl))}`;
	} else if (deviceMark.isXYF || deviceMark.isPlus) {
		nativeOpenNewWebView({ url: pointsMallUrl });
	} else {
		const isXYFMini = await mini_isWeixinMiniProgram();
		if (isXYFMini) {
			// 小程序
			mini_nativeOpenNewWebView({ url: pointsMallUrl });
		} else {
			Toast.info("请在App/小程序中查看");
		}
	}
};

/**
 * 关闭当前WebView
 **/
const nativeCloseWebview = () => {
	if (deviceMark.isXYF) {
		xyf_nativeCloseWebview();
	} else if (deviceMark.isPlus) {
		plus_nativeCloseWebview();
	} else if (IS_XYF_MINI || IS_JXQY_MINI) {
		mini_nativeCloseWebview();
	} else {
		window.history.back();
	}
};

/**
 * 获取用户基础信息
 **/
const nativeRequestBaseParams = () => {
	return new Promise((resolve) => {
		if (deviceMark.isPlus) {
			return plus_getNativeRequestBaseParams(resolve);
		} else if (deviceMark.isXYF) {
			return xyf_getNativeRequestBaseParams(resolve);
		} else if (IS_XYF_MINI || IS_JXQY_MINI) {
			return mini_getNativeRequestBaseParams(resolve);
		}
		return dev_getNativeLocationInfo(resolve);
	});
};

/**
 * 获取定位信息
 */
const nativeGetLocationInfo = (successCallback = emptyMethod) => {
	if (deviceMark.isXYF) {
		xyf_getNativeLocationInfo(successCallback);
	}
	if (deviceMark.isPlus) {
		plus_getNativeLocationInfo(successCallback);
	}
};

/**
 * 打开相机相册获取图片，plus需要补充，安卓需要实现actionsheet
 * */
const nativeOpenCameraAndPhotoLibrary = (successCallback = emptyMethod) => {
	if (deviceMark.isXYF) {
		xyf_openImagePicker(successCallback);
	} else {
		plus_openCamera(successCallback);
	}
};

/**
 * 保存图片到相册
 */
const nativeSaveImgToPhoneLibrary = (params = { img: "" }) => {
	if (deviceMark.isXYF) {
		xyf_saveImageToPhoneLibrary(params);
	} else if (deviceMark.isPlus) {
		const { img } = params || {};
		plus_saveImageToPhoneLibrary({ baseUrl: img });
	} else {
		Toast.info("保存失败！");
	}
};

const nativeQuitLogin = () => {
	saLogout();
	if (deviceMark.isPlus) {
		plus_nativeQuitLogin();
	}
};

const nativeShowRightButton = (params = { visible: true, text: "" }, callback = emptyMethod) => {
	if (deviceMark.isXYF) {
		xyf_getNativeRequestBaseParams((res) => {
			const versionStr = res.APP_VERSIONS;
			const versionNumber = parseInt(versionStr.split(".").join(""));
			const { visible, text } = params;
			xyf_nativeShowRightButton({ visible, text, color: versionNumber >= 320 ? "#333" : "#fff" }, callback);
		});
	} else {
		plus_nativeShowRightButton(params, callback);
	}
};

const closeWebViewScrollBounces = () => {
	if (deviceMark.isXYF) {
		xyf_closeWebViewScrollBounces();
	} else if (deviceMark.isPlus) {
		plus_closeWebViewScrollBounces();
	}
};

/**
 * 分享到微信
 * shareUrl: 点击打开的URL
 * title: 标题
 * description: 描述
 * thumbImageUrl: 图片icon(http协议图片)
 * scene: 0微信会话,1微信朋友圈 需要传递数字类型
 * shareContentType: 鑫一付中01为网页（01为字符串类型）
 */
const nativeShareToWeChat = (
	params = {
		shareUrl: "",
		title: "",
		description: "",
		thumbImageUrl: "",
		scene: 0,
		shareContentType: "0"
	}
) => {
	if (deviceMark.isXYF) {
		xyf_nativeShareToWeChat({
			webPageUrl: params.shareUrl,
			title: params.title,
			description: params.description,
			thumbImageUrl: params.thumbImageUrl,
			scene: params.scene,
			shareContentType: params.shareContentType
		});
	} else if (deviceMark.isPlus) {
		plus_nativeShare({
			shareUrl: params.shareUrl,
			title: params.title,
			hint: params.description,
			shareImgUrl: params.thumbImageUrl,
			entry: String(params.scene) === "1" ? "0002" : "0001"
		});
	} else {
		Toast.info("分享失败！");
	}
};
/**
 * 设置标题
 */
const nativeSetTitle = (title) => {
	document.title = title;
	if (deviceMark.isXYF) {
		xyf_setTitle(title);
	}
};

/**
 *启动原生人脸识别功能
 * 入参:无
 * 出参:{bestFaceImageUrl: 'https://dasdadada'}
 *
 nativeStartLiveFace(res => {
  const { bestFaceImageUrl } = res || {};
 });
 */
const nativeStartLiveFace = (callback = emptyMethod) => {
	if (deviceMark.isPlus) {
		plus_nativeStartLiveFace(callback);
	} else if (deviceMark.isXYF) {
		xyf_nativeStartLiveFace(callback);
	}
};

/**
 *打开原生相机方法(带有Sheet弹框)
 * 入参:无
 * 出参{imgBase64String: 'kdadasdadasdadad'}
 *
 openImagePickerOnlyCamera(res => {
  const { imgBase64String } = res || {};
 });
 */
const openImagePickerOnlyCamera = (callback = emptyMethod) => {
	if (deviceMark.isXYF) {
		xyf_nativeOpenCameraLibrary(callback);
	}
	if (deviceMark.isPlus) {
		plus_nativeOpenCameraLibrary(callback);
	}
};

/**
 * 唤起原生扫描身份证识别功能
 * source
 * UPDATE_ID_CARD(部分数据，姓名、身份证号、起始日期、截止日期、正面照片、反面照片、头像),
 * ALL 全量数据
 * name、idCard、sex、nation、birthday、organization、startTime、endTime、frontPhotoPath、backPhotoPath、headerPhotoPath
 */
const nativeStartScanIdCard = (params, callback = emptyMethod) => {
	if (deviceMark.isPlus) {
		plus_nativeStartScanIdCard(params, callback);
	}

	if (deviceMark.isXYF) {
		xyf_nativeStartScanIdCard(params, callback);
	}
};

/**
 * 获取APP的通知权限开关
 * callback {}
 * notificationsEnabled Y N 为空的时候APP版本太低或者不是APP原生
 */
const nativeGetNotificationStatus = () => {
	return new Promise((resolve) => {
		if (deviceMark.isPlus) {
			plus_getNotificationStatus(resolve);
		} else if (deviceMark.isXYF) {
			xyf_getNotificationStatus(resolve);
		} else {
			resolve({});
		}
	});
};

/**
 * 打开系统设置页面 - 通知页面
 * */
const nativeOpenStystemSettingPage = () => {
	if (deviceMark.isPlus) {
		plus_openNativeStystemSettingPage();
	}
};

/**
 * 获取当前APP内首页积分tab角标上的类型及内容
 */
const getMainIntegralTabTextAndType = () => {
	return new Promise((resolve) => {
		if (deviceMark.isPlus) {
			plus_getMainIntegralTabTextAndType(resolve);
		} else if (deviceMark.isXYF) {
			xyf_getMainIntegralTabTextAndType(resolve);
		} else {
			resolve({});
		}
	});
};

/**
 * 打开APP设置-消息提醒页面
 */
const openNotificationSettingPage = () => {
	if (deviceMark.isXYF) {
		xyf_openNotificationSettingPage({ action: "GUIDE" });
	} else if (deviceMark.isPlus) {
		plus_openNotificationSettingPage({ action: "GUIDE" });
	}
};

// 是否登录状态
export const nativeIsLogin = async () => {
	const res = await nativeRequestBaseParams();
	const { TOKEN_ID } = res;
	return TOKEN_ID && TOKEN_ID.length > 0;
};

/**
 * 调用原生支付宝支付
 * @param {* 订单信息} orderString
 */
const nativeAlipay = (orderString, callback = emptyMethod) => {
	if (deviceMark.isPlus) {
		plus_nativeAliPay(orderString, callback);
	} else if (deviceMark.isXYF) {
		xyf_nativeAliPay(orderString, callback);
	}
};

// 通用方法
const isHideNavBar = () => {
	if (deviceMark.isXYF) {
		return true;
	}
	if (deviceMark.isPlus) {
		return true;
	}
	// h5
	return false;
};

export {
	nativeRequestBaseParams,
	nativeOpenNewWebView,
	nativeCloseWebview,
	nativeGetLocationInfo,
	nativeOpenCameraAndPhotoLibrary,
	nativeSaveImgToPhoneLibrary,
	nativeQuitLogin,
	nativeShowRightButton,
	openNativePage,
	closeWebViewScrollBounces,
	nativeSetTitle,
	nativeShareToWeChat,
	nativeStartLiveFace,
	openImagePickerOnlyCamera,
	nativeStartScanIdCard,
	nativeGetNotificationStatus,
	getMainIntegralTabTextAndType,
	openNotificationSettingPage,
	nativeOpenPointsMallPage,
	nativeAlipay,
	nativeOpenStystemSettingPage,
	isHideNavBar
};

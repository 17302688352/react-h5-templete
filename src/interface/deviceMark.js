import { dealUrl } from "@/utils";
const ua = window.navigator.userAgent;
export const isAndroid = /Android/i.test(ua);
export const isIOS = /iPhone|iPad|iPod/i.test(ua);
export const isPlus = /SuiXingPay-Mpos/i.test(ua);
export const isXYF = /Suixingpay-XYF/i.test(ua);
export const isWeixin = /MicroMessenger/i.test(ua);
export const isXlmHm = /Suixingpay-Xlm-Hm/i.test(ua);

// 应用名称
export const AppName = isPlus ? "随行付Plus" : "鑫一付";
// 是否是鑫一付小程序
export const IS_XYF_MINI = dealUrl(window.location.search) && dealUrl(window.location.search).weappName === "XYF";

// 是否是随申宝小程序
export const IS_SSB_MINI = dealUrl(window.location.search) && dealUrl(window.location.search).weappName === "SSB_MINI";

// 是否是集享权益小程序
export const IS_JXQY_MINI = dealUrl(window.location.search) && dealUrl(window.location.search).weappName === "JXQY";

// 判断安卓版本
const getAndroidVersion = () => {
	const uaLowerCase = ua.toLowerCase();
	let version = null;
	if (uaLowerCase.indexOf("android") >= 0) {
		const reg = /android [\d._]+/gi;
		const vInfo = uaLowerCase.match(reg);
		// 得到版本号
		version = `${vInfo}`.replace(/[^0-9|_.]/gi, "").replace(/_/gi, ".");
		// 得到版本号第1,2位
		version = parseFloat(`${version.split(".")[0]}.${version.split(".")[1]}`);
	}
	return version;
};

export default {
	isAndroid,
	isIOS,
	isPlus,
	isXlmHm,
	isXYF,
	isWeixin,
	getAndroidVersion
};

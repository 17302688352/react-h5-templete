import { dealUrl } from "@/utils";
import { IS_JXQY_MINI, IS_XYF_MINI, isWeixin } from "@/interface/deviceMark";
// 鑫一付小程序页面
const xyf_miniProgramPages = {
	coupon: "/pages/coupon/AvailableCouponList/AvailableCouponList", // 优惠券
	homePage: "/pages/mainTab/HomePage/HomePage" // 首页
};
// 关闭当前WebView
const mini_nativeCloseWebview = () => {
	window.wx.miniProgram.navigateBack();
};
// 获取用户基础信息
const mini_getNativeRequestBaseParams = () => {
	const { token, inMno } = dealUrl(window.location.search);
	// 小程序通过URL中的 token 和 inMno 判断登录状态
	if (token && token.length > 0 && token !== "undefined" && inMno && inMno.length > 0 && inMno !== "undefined") {
		return true;
	} else {
		return false;
	}
};

// 鑫一付小程序 跳转页面
const mini_xyf_nativeJumpPage = (name) => {
	if (name === "homePage") {
		window.wx.miniProgram.switchTab({
			url: xyf_miniProgramPages[name] || name
		});
	} else {
		window.wx.miniProgram.navigateTo({
			url: xyf_miniProgramPages[name] || name
		});
	}
};

// 打开新页面
const mini_nativeOpenNewWebView = (params) => {
	if (IS_XYF_MINI) {
		window.wx.miniProgram.navigateTo({
			url: `/pages/common/CommonWeb/CommonWeb?url=${encodeURIComponent(params.url)}`
		});
	}
	if (IS_JXQY_MINI) {
		window.wx.miniProgram.navigateTo({
			url: `/sub/tools/web?url=${encodeURIComponent(params.url)}`
		});
	}
};

// 判断是否是在小程序中打开的页面
export const mini_isWeixinMiniProgram = () =>
	new Promise((resolve) => {
		if (isWeixin) {
			window.wx.miniProgram.getEnv((res) => {
				const { miniprogram } = res || {};
				resolve(miniprogram);
			});
		} else {
			resolve(false);
		}
	});

export { mini_nativeCloseWebview, mini_getNativeRequestBaseParams, mini_nativeOpenNewWebView, mini_xyf_nativeJumpPage };

import sa from "sa-sdk-javascript";
import { IS_JXQY_MINI, IS_SSB_MINI, IS_XYF_MINI, isXYF, isPlus } from "@/interface/deviceMark";
import { nativeRequestBaseParams } from "@/interface/jsNative";
import { isDev } from "@/config";
import { useStore } from "@/store";
import { dealUrl } from "@/utils";

const isOpen = import.meta.env.VITE_SA_OPEN === "true";

/**
 * 埋点对应的平台服务URL、platformName
 */
const projectConfig = {
	test: {
		plus: {
			projectName: "MPOS_TEST",
			platformName: "随行付plus"
		},
		xyf: {
			projectName: "xin_quickpass",
			platformName: "鑫一付APP"
		},
		jxqy: {
			projectName: "collective_benefits",
			platformName: "集享权益"
		}
	},
	production: {
		plus: {
			projectName: "SXF_PLUS",
			platformName: "随行付plus"
		},
		xyf: {
			projectName: "xin_quickpass",
			platformName: "鑫一付APP"
		},
		jxqy: {
			projectName: "collective_benefits",
			platformName: "集享权益"
		}
	}
};

// 用于特定的页面源映射
const pageSourceMapping = {
	"02": "外部链接",
	"03": "鑫一付公众号" // 只对鑫一付适用
};
export const saBaseInfo = () => {
	const { saPlatform = "", saPageSource = "" } = dealUrl(window.location.search) as any;
	const isTestEnvironment = window.location.href.includes("test.suixingpay.com") || isDev;

	// 根据环境选择配置
	const environment = isTestEnvironment ? "test" : "production";

	// 预设的默认值
	let projectName = "";
	let platformName = "";

	// Plus
	if (isPlus || saPlatform === "02" || saPageSource === "02") {
		const config = projectConfig[environment].plus;
		projectName = config.projectName;
		platformName = config.platformName;

		// 处理特定页面源
		if (saPlatform === "02") {
			platformName = pageSourceMapping["02"];
		} else if (saPageSource === "02") {
			platformName = "随行付Plus公众号";
		}
	}

	// 鑫一付
	if (isXYF || IS_XYF_MINI || IS_SSB_MINI || saPlatform === "03" || saPageSource === "03") {
		const config = projectConfig[environment].xyf;
		projectName = config.projectName;
		platformName = config.platformName;

		// 处理特定页面源
		if (saPlatform === "03") {
			platformName = pageSourceMapping["03"];
		} else if (saPageSource === "03") {
			platformName = "鑫一付公众号";
		}
	}

	// 集享权益
	if (IS_JXQY_MINI) {
		const config = projectConfig[environment].jxqy;
		projectName = config.projectName;
		platformName = config.platformName;
	}

	return {
		saUrl: `https://xlm-sc.suixingpay.com/sa?project=${projectName}`,
		saPlatformName: platformName
	};
};

export default sa;
// 退出登录
export const saLogout = () => {
	if (!isOpen) {
		return;
	}
	sa.logout();
};

const saTrack = (e: string, p: any) => {
	if (!isOpen) {
		return;
	}
	// console.log('埋点', e, p);
	sa.track(e, p);
};

// 自定义页面浏览时长属性
export let saCustomWebPageLeaveProps = {};

/**
 *
 * @param {页面浏览时长埋点} page_name页面名称必填项
 * 用法 直接调用即可，不需要自己计算时长
 */
export const saWebPageLeave = ({ page_name = "", ...other }) => {
	if (page_name.length > 0) {
		saCustomWebPageLeaveProps = {
			event: "$WebPageLeave",
			props: {
				page_name,
				...other
			}
		};
	} else {
		saCustomWebPageLeaveProps = {};
	}
};

/**
 * 页面曝光
 * @param {*} page_name 页面名称
 */
export const saPageShow = ({ page_name = "", ...other }) => {
	saTrack("page_show", {
		page_name,
		...other
	});
};

/**
 * 模块曝光
 * @param {*} page_name 页面名称
 */
export const saModShow = ({ page_name = "", mod_name = "", ...other }) => {
	saTrack("mod_show", {
		page_name,
		mod_name,
		...other
	});
};

/**
 * 模块点击
 * @param {*} page_name 页面名称
 */
export const saModClick = ({ page_name = "", mod_name = "", ...other }) => {
	saTrack("mod_click", {
		page_name,
		mod_name,
		...other
	});
};

/**
 * 按钮点击
 * @param {*} page_name 页面名称
 */
export const saButtonClick = ({ page_name = "", button_name = "", ...other }) => {
	saTrack("button_click", {
		page_name,
		button_name,
		...other
	});
};

/**
 * 按钮曝光
 * @param {*} page_name 页面名称
 */
export const saButtonShow = ({ page_name = "", button_name = "", ...other }) => {
	saTrack("button_show", {
		page_name,
		button_name,
		...other
	});
};

/**
 * 页面离开
 */
export const saPageLeave = ({ page_name = "", ...other }) => {
	saTrack("page_leave", {
		page_name,
		...other
	});
};

/**
 * 按钮曝光组件
 * @returns 曝光内容
 */
export function ButtonShow({ children, sensor }: any) {
	saTrack("button_show", {
		page_name: document.title,
		...sensor
	});
	return <>{children}</>;
}

/**
 * 模块曝光组
 * @returns 曝光内容
 */
export function ModShow({ children, sensor }: any) {
	saTrack("mod_show", {
		page_name: document.title,
		...sensor
	});
	return <>{children}</>;
}

/**
 * 模块曝光hooks 应对神策初始化问题；
 */
export const useSaModShow = async ({ mod_show, ...other }: any) => {
	saTrack("mod_show", {
		page_name: document.title,
		mod_show,
		...other
	});
};

/**
 * 页面曝光
 */
export const useSaPageShow = async ({ page_name = "", ...other }) => {
	console.log("埋点", {
		page_name: page_name || document.title,
		prepage_name: document.referrer,
		...other
	});
	saTrack("page_show", {
		page_name: page_name || document.title,
		prepage_name: document.referrer,
		...other
	});
};

/**
 * 浏览时长
 */
export const useSaAppPageLeave = async ({ page_name = "", ...other }) => {
	const begin = Date.now();
	return () => {
		const length_time = (Date.now() - begin) / 1000;
		saTrack("$AppPageLeave", {
			page_name: page_name || document.title,
			prepage_name: document.referrer,
			$event_duration: length_time,
			...other
		});
	};
};

/**
 * 页面滑动
 * @param {*} page_name 页面名称
 */
export const saPageSwipe = ({ page_name = "", ...other }) => {
	saTrack("page_swipe", {
		page_name,
		...other
	});
};

/**
 * 神策初始化
 */
export const SAInit = () => {
	console.log("SAInit", import.meta.env.VITE_SA_OPEN === true);
	if (!isOpen) {
		return;
	}
	const { saUrl, saPlatformName } = saBaseInfo() || {};
	sa.init({
		server_url: saUrl,
		app_js_bridge: true, //埋点打通APP
		show_log: isDev, // 日志开关
		cross_subdomain: true,
		heatmap: {
			//是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
			clickmap: "not_collect",
			//是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
			scroll_notice_map: "not_collect"
		}
	});
	sa.use("PageLeave", {});
	// 设置公共属性
	sa.registerPage({ browse_platform: saPlatformName });
	const registerPlugin = sa.use("RegisterProperties", {});
	registerPlugin.register({
		events: ["$WebPageLeave"],
		properties: {
			platForm: "H5",
			$screen_name: "APP Web",
			$title: document.title
		}
	});
	// 用户浏览时长添加自定义属性上报
	registerPlugin.hookRegister(function (res: any) {
		let customProperties = {};
		const { event, props } = saCustomWebPageLeaveProps as any;
		// 浏览时长上报时，添加自定义属性
		if (props && res && res.event === event) {
			customProperties = props;
		}
		return customProperties;
	});

	window.onload = async function () {
		if (isPlus || isXYF) {
			const nativeParams = await nativeRequestBaseParams();
			sa.login(nativeParams["inMno"]);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			useStore.setState({
				inMno: nativeParams["inMno"]
			});
		}
	};
};

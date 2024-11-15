/*
 * @Date: 2024-08-07 14:02:10
 * @LastEditors: shawn
 * @LastEditTime: 2024-08-07 16:00:33
 */
import { Toast } from "antd-mobile";

export const info = (msg: string, duration?: number, maskClickable?: boolean) => {
	if (duration === undefined) duration = 2;
	if (maskClickable === undefined) maskClickable = true;
	Toast.show({
		content: msg,
		duration: duration * 1000,
		maskClickable: maskClickable
	});
};

export const fail = (msg: string, duration?: number, maskClickable?: boolean) => {
	if (duration === undefined) duration = 2;
	if (maskClickable === undefined) maskClickable = true;
	Toast.show({
		icon: "fail",
		content: msg,
		duration: duration * 1000,
		maskClickable: maskClickable
	});
};

export const success = (msg: string, duration?: number, maskClickable?: boolean) => {
	if (duration === undefined) duration = 2;
	if (maskClickable === undefined) maskClickable = true;
	Toast.show({
		icon: "success",
		content: msg,
		duration: duration * 1000,
		maskClickable: maskClickable
	});
};

export const loading = (msg?: string, duration?: number, maskClickable?: boolean) => {
	if (duration === undefined) duration = 10;
	if (msg === undefined) msg = "加载中...";
	if (maskClickable === undefined) maskClickable = false;
	Toast.show({
		icon: "loading",
		content: msg,
		duration: duration * 1000,
		maskClickable: maskClickable
	});
};

export const custom = (msg: string, icon: React.ReactNode, duration?: number, maskClickable?: boolean) => {
	if (duration === undefined) duration = 2;
	if (maskClickable === undefined) maskClickable = true;
	console.log(duration);
	Toast.show({
		icon: icon,
		content: msg,
		duration: duration * 1000,
		maskClickable: maskClickable
	});
};

export const hide = () => {
	Toast.clear();
};

export default { info, fail, success, loading, hide, custom };

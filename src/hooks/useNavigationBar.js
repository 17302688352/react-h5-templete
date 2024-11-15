import { useStore } from "@/store";
import { useEffect } from "react";
import { isHideNavBar } from "@/interface/jsNative";

export const useNavigationBar = () => {
	const { hideNavBar } = useStore("hideNavBar");
	useEffect(() => {
		return () => {
			useSetDefaultShowNavBar();
		};
	}, []);
	return hideNavBar === "hide";
};

/**
 * 根据端设置默认是否隐藏导航栏
 * 设置默认隐藏导航栏
 */
export const useSetDefaultShowNavBar = () => {
	useStore.setState({
		hideNavBar: isHideNavBar() ? "hide" : "show"
	});
};

/**
 * 手动修改设置是否显示导航栏 只影响当前页面
 * @param type 1: 隐藏导航栏 2: 显示导航栏 3: 取原生导航栏
 */
export const useSettingNavBar = (type = "hide") => {
	useStore.setState({
		hideNavBar: type === "hide" ? "hide" : "show"
	});
};

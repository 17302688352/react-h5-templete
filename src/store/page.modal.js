/**
 * 页面信息相关状态
 */

export default {
	// 持久化存储的key
	persistWhiteList: [],
	create: (set) => ({
		// 页面标题
		title: "",
		setTitle: (title) => {
			set({ title });
		},

		// 是否隐藏导航栏
		hideNavBar: "hide",
		setHideNavBar: (hideNavBar) => {
			set({ hideNavBar });
		},
		// debugger搜索关键字
		searchWord: "",
		setSearchWord: (searchWord) => {
			set({ searchWord });
		}
	})
};

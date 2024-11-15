/**
 * 用户信息相关状态
 */
export default {
	// 持久化存储的key
	persistWhiteList: ["token", "inMno"],
	create: (set) => ({
		// 用户token
		token: "",
		setToken: (token) => {
			set({ token });
		},
		// 商编信息
		inMno: "",
		setInMno: (inMno) => {
			set({ inMno });
		}
	})
};

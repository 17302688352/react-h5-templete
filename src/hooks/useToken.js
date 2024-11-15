import { useEffect } from "react";
import { useStore } from "@/store";
import { nativeRequestBaseParams } from "@/interface/jsNative";

// 用于管理 token 的自定义 Hook
export const useToken = () => {
	const { token, setToken } = useStore("token", "setToken");

	useEffect(() => {
		if (!token) {
			nativeRequestBaseParams().then((res) => {
				setToken(res.TOKEN_ID);
			});
		}
	}, [token, setToken]);

	return token;
};

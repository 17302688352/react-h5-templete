import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import qs from "qs";
import { cancelRequest } from "./requestCancel";
import { useStore } from "@/store";
// import { useStore } from '@/store';

type R<T> = Res.ResponseRes<T>;

// axios基础配置
const service = axios.create({
	timeout: 20000,
	baseURL: import.meta.env.VITE_APP_BASE_URL
});

// 请求拦截
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig<unknown>) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		const { token } = useStore.getState();
		console.log("请求拦截 toke11n:>> ", token);

		if (token) {
			config.headers["token"] = token;
		}

		cancelRequest.addPending(config); // 添加当前请求至请求列表

		// console.log('请求拦截 config:>> ', config)
		return config;
	},
	(err: AxiosError) => {
		return Promise.reject(err);
	}
);

// 响应拦截
service.interceptors.response.use(
	(response: AxiosResponse<R<unknown>, unknown>) => {
		cancelRequest.removePending(response.config); // 删除重复请求
		if (response.data.code === 200) {
			return response;
		} else {
			return Promise.reject(response);
		}
	},
	(err: AxiosError) => {
		/**
		 * 将取消请求的错误捕获
		 * 根据需要设置 因为需要对每个请求单独处理catch 所以隐藏取消请求的错误返回
		 */
		console.error("响应异常:>> ", err);

		if (err.code === "ERR_CANCELED") {
			console.log("请求取消url:>> ", err.config?.url);
		} else if (err.code === "ECONNABORTED" && err.message.includes("timeout")) {
			// message.error('请求超时,请检查服务器状态')
			return Promise.reject(err);
		} else {
			// message.error(err.message)
			return Promise.reject(err);
		}
	}
);

/**
 * 基础的请求
 */
/** POST表单格式 */
export function post<T = unknown>(url: string, params?: unknown) {
	return new Promise<R<T>>((resolve, reject) => {
		service
			.post<R<T>>(url, qs.stringify(params), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
				}
			})
			.then(
				(response) => {
					resolve(response.data);
				},
				(err: AxiosError) => {
					reject(err);
				}
			)
			.catch((err: AxiosError) => {
				reject(err);
			});
	});
}

/** POST JSON格式 */
export function postJSON<T = unknown>(url: string, params?: unknown) {
	return new Promise<R<T>>((resolve, reject) => {
		service
			.post(url, params)
			.then(
				(response: AxiosResponse<R<T>>) => {
					resolve(response.data);
				},
				(err: AxiosError) => {
					reject(err);
				}
			)
			.catch((error: AxiosError) => {
				reject(error);
			});
	});
}

/** GET请求 */
export function get<T = unknown>(url: string, params?: unknown) {
	return new Promise<R<T>>((resolve, reject) => {
		service
			.get(url, { params })
			.then(
				(response: AxiosResponse<R<T>>) => {
					resolve(response.data);
				},
				(err: AxiosError) => {
					reject(err);
				}
			)
			.catch((error: AxiosError) => {
				reject(error);
			});
	});
}

/**
 * PUT请求
 */
export function put<T = unknown>(url: string, params?: unknown) {
	return new Promise<R<T>>((resolve, reject) => {
		service
			.put(url, params)
			.then(
				(response: AxiosResponse<R<T>>) => {
					resolve(response.data);
				},
				(err: AxiosError) => {
					reject(err);
				}
			)
			.catch((error: AxiosError) => {
				reject(error);
			});
	});
}

/**
 * DELETE请求
 */
export function del<T = unknown>(url: string, params?: unknown) {
	return new Promise<R<T>>((resolve, reject) => {
		service
			.delete(url, { params })
			.then(
				(response: AxiosResponse<R<T>>) => {
					resolve(response.data);
				},
				(err: AxiosError) => {
					reject(err);
				}
			)
			.catch((error: AxiosError) => {
				reject(error);
			});
	});
}

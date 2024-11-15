/**
 * 接口response data类型
 */
declare namespace Res {
	/** response */
	interface ResponseRes<T = any> {
		code: number;
		data: T;
		msg: string;
	}
}

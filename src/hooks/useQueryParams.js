/**
 * 获取序列化后的URL查询参数 ?a=1&b=2 返回{ a:1, b:2 }
 * @returns
 */
export const useQueryParams = () => Object.fromEntries(new URLSearchParams(location.search).entries());

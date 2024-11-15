import { get } from "@/axios";

/** 测试接口 */
export const GetCaptcha = (params) => get("api/captcha", params);

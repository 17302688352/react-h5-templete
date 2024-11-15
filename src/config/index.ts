// 是否为开发环境
export const isDev = process.env.NODE_ENV === "development";

export const isProd = process.env.NODE_ENV === "production";

export const isTest = process.env.NODE_ENV === "test";

export const ENV = process.env.NODE_ENV || "development";

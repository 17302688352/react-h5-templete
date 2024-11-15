/**
 *将APP的版本号处理成数字
 */
export const handleAppVersion = (version) => {
	const array = version.split(".");
	const versionNum = Number(array.join(""));
	return versionNum;
};

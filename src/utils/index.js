// 监听document.title变化
export const observeDocumentTitle = (onChange) => {
	const observer = new MutationObserver(() => {
		onChange(document.title);
	});
	observer.observe(document.head, { childList: true, subtree: true });

	return () => observer.disconnect();
};

/**
 * 处理url中的参数 转成对象
 * @param {*} url
 * @returns
 */
export const dealUrl = (url) => {
	const params = {};
	if (url.indexOf("?") !== -1) {
		const paramsUrl = url.split("?")[1];
		const paramsArr = paramsUrl.split("&");
		for (let i = 0; i < paramsArr.length; i += 1) {
			params[paramsArr[i].split("=")[0]] = paramsArr[i].split("=")[1];
		}
	}
	return params;
};

// 判断是否是网址
export const isWebUrl = (url) => {
	return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
};

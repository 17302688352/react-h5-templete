/**
 * 登出
 * @param callBack
 * @returns
 */
export const hm_logout_native = (callBack) => {
	window.JSBridge.invoke("logOut", callBack);
};

/**
 * 获取token
 * @param callBack
 * @returns
 */
export const hm_getToken_native = (callBack) => {
	window.JSBridge.invoke("get_token", callBack);
};

/**
 * 路由返回栈顶
 * @param callBack
 * @returns
 */
export const hm_routerBackTop_native = (callBack) => {
	window.JSBridge.invoke("router_back_top", callBack);
};

/**
 * 路由返回
 * @param callBack
 * @returns
 */
export const hm_routerBack_native = (params, callBack) => {
	window.JSBridge.invoke("router_back", callBack, {
		url: (params && params?.url) || "",
		pageParams: params
	});
};

/**
 * 路由跳转
 * @param callBack
 * @returns
 */
export const hm_routerPush_native = (url, params, callBack) => {
	window.JSBridge.invoke("router_push", callBack, { url, ...params });
};

/**
 * 路由替换
 * @param callBack
 * @returns
 */
export const hm_routerReplace_native = (url, params, callBack) => {
	window.JSBridge.invoke("router_replace", callBack, { url, ...params });
};

/**
 * 调用自定义方法
 * @param callBack
 * @returns
 */
export const hm_callCustomMethod_native = (funcName, callBack) => {
	window.JSBridge.callCustomMethod(funcName, callBack);
};

/**
 * 调用app导航栏右侧按钮
 * @param callBack
 * @returns
 */
export const hm_navRightBtn_native = (options, callBack) => {
	window.JSBridge.invoke("nav_right_btn", callBack, options);
};

/**
 * 获取app一些常用参数
 * @param callBack
 * @returns
 */
export const hm_appParams_native = (callBack) => {
	window.JSBridge.invoke("app_params", (res) => {
		res = typeof res === "string" ? JSON.parse(res) : res;
		callBack(res);
	});
};

/**
 * 获取页面标题
 * @param callBack
 * @returns
 */
export const hm_getPageTitle_native = (callBack) => {
	return window.JSBridge.invoke("get_title", (res) => {
		callBack(res);
	});
};

/**
 * 更新app导航页面标题
 * @param callBack
 * @returns
 */
export const hm_setPageTitle_native = (title, callBack) => {
	return window.JSBridge.invoke("set_title", callBack, { title: title });
};

/**
 * 检查权限
 * @param permissions
 * ohos.permission.CAMERA 相机
 *
 * @param callBack
 * @returns
 */
export const hm_requestPermissions_native = (permissions, callBack) => {
	return window.JSBridge.invoke("request_permissions", callBack, permissions);
};
/**
 * 请求权限
 * @param permissions
 * ohos.permission.CAMERA 相机
 *
 * @param callBack
 * @returns
 */
export const hm_checkPermissions_native = (permissions, callBack) => {
	return window.JSBridge.invoke("check_permissions", callBack, permissions);
};

/**
 * 获取定位信息
 * @param callBack
 * @returns
 */
export const hm_getLocation_native = (callBack) => {
	return window.JSBridge.invoke("get_location", callBack);
};

/**
 * 拉起相机拍照
 * @param callBack
 * @returns
 */
export const hm_callCamera_native = (callBack) => {
	return window.JSBridge.invoke("call_camera", callBack);
};

/**
 * 打开设置
 * @param callBack
 * @returns
 */
export const hm_goSetting_native = (callBack) => {
	return window.JSBridge.invoke("go_setting", callBack);
};

/**
 * 相册选择一张图片
 * @param callBack
 * @returns
 */
export const hm_pickerSelectOneImage_native = (callBack) => {
	return window.JSBridge.invoke("picker_select_one_image", callBack);
};

/**
 * 获取页面参数
 * @param callBack
 * @returns
 */
export const hm_getPageParams_native = (callBack) => {
	window.JSBridge.invoke("get_page_params", (res) => {
		res = typeof res === "string" ? JSON.parse(res) : res;
		callBack(res);
	});
};

/**
 * 返回需要拦截执行的方法
 * @param callBack
 */
export const hm_interceptBack_native = (params, callBack) => {
	window.JSBridge.invoke("intercept_back", callBack, { params: params });
};

// id_card_ocr
/**
 * 身份证识别
 * @param cameraImgType 0正面 1反面
 * @param callBack
 */

export const hm_idCardOcr_native = (cameraImgType, callBack) => {
	return window.JSBridge.invoke(
		"id_card_ocr",
		(res) => {
			res = typeof res === "string" ? JSON.parse(res) : res;
			callBack(res);
		},
		{
			cameraImgType
		}
	);
};

/**
 * 扫码
 *
 * @param callBack
 */
export const hm_scanCode_native = (scanType, callBack, from = 1) => {
	return window.JSBridge.invoke(
		"scan_code",
		(res) => {
			res = typeof res === "string" ? JSON.parse(res) : res;
			callBack(res);
		},
		{
			scanType,
			from
		}
	);
};

// 人脸识别初始化
export const hm_faceRecognitionInit_native = (callBack) => {
	return window.JSBridge.invoke("face_recognition_init", (res) => {
		res = typeof res === "string" ? JSON.parse(res) : res;
		callBack(res);
	});
};

// 人脸识别
export const hm_faceRecognition_native = (obj, callBack) => {
	return window.JSBridge.invoke(
		"face_recognition",
		(res) => {
			res = typeof res === "string" ? JSON.parse(res) : res;
			callBack(res);
		},
		{ authType: obj?.authType || "01", oldPhoneNo: obj?.oldPhoneNo }
	);
};

// 设置状态栏颜色
// set_status_bar_color
export const hm_setStatusBarColor_native = (theme, callBack) => {
	return window.JSBridge.invoke("set_status_bar_color", callBack, {
		theme
	});
};

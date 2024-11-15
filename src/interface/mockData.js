const mockData = {
	getRequestBaseMockParams: {
		APPVERSION: "4.3.8",
		APP_VERSIONS: "4.3.8",
		Mobile: "15836900002",
		PHONE_FIRM: "Apple",
		PHONE_IMEI: "f84370dd58f04d7bb6f732e849159638",
		PHONE_LANGUAGE: "zh-CN",
		PHONE_MAC: "C8:94:BB:6F:11:3B",
		PHONE_MODLE: "MHA-AL00",
		PHONE_NETWORK: "NETWORK_WIFI",
		PHONE_PLATFORM: "iOS",
		PHONE_VERSIONS: "15.4",
		PLATFORM: "ios",
		QUERY_ID: "MADR419WEBTYPEXXX220426144333216",
		ROOTED: "0",
		TOKEN_ID: "50e8b6598b2e40ddb2d323fb3fc093fd",
		channelNo: "01",
		env: "test_inter",
		inMno: "700000001196267",
		mobileNoEnc: "RkZpoW3HVCwjg33+KPYHZA=="
	},

	nativeLogin: {
		APP_VERSIONS: "3.0.0",
		PHONE_VERSIONS: "11.4",
		PHONE_PLATFORM: "iOS",
		token: "7a35658e6c6840a69a38c2b41e216a6e",
		channelNo: "01",
		PHONE_LANGUAGE: "en",
		PHONE_FIRM: "Apple",
		PHONE_IMEI: "7b306e23a99a40c492cc3032f5a795da",
		APPKEY: "com.vbill.shoushuaBusiness",
		PHONE_MAC: "",
		PHONE_MODLE: "iPhoneSimulator",
		PHONE_NETWORK: "WIFI",
		inMno: "700000001191026",
		QUERY_ID: "",
		status: "success"
	},
	nativeOcrBankCard: {
		cardType: "借记卡",
		bankName: "工商银行",
		expiryDate: "00/00",
		bankCode: "01020000",
		cardName: "牡丹卡普卡",
		cardNumber: "6000261302017200000",
		errorCode: "0000"
	},
	nativeAlipay: {
		memo: "处理成功",
		result: {
			alipay_trade_app_pay_response: {
				code: "10000",
				msg: "Success",
				app_id: "2016091900546255",
				auth_app_id: "2016091900546255",
				charset: "utf-8",
				timestamp: "2018-08-07 11:45:01",
				out_trade_no: "0807114236-4208",
				total_amount: "0.01",
				trade_no: "2018080721001004590201093500",
				seller_id: "2088102176305689"
			},
			sign: "BbDfrshYFuv/SkLmQeGo01n34qC7hJnL9HFMv53tsCEC4/61LlIa6hPNfMxl9JvcAgAhDjA7oDRg4r8Ku8ql9fSZETjg/OMgW4s0jG8P0aIDdkC1G2NEDK/YsfWrT/GP13uxOsAzoFAFJCfBTyVTn7l2Tghgw3LzB+lYBqiahls0e7iVblqYd+n0ZtjgG4WzdTkGJQfmpOZuOj2QNHlUWrOSKjeDGteJZkQApbDswkaxz8xtO/xEBDbanRoPcZP/VnZGjsP3oF0XFG22DdbXFjBbBtd9CXd0vGjsxhJBp+5JVJct+llQcPMDvcRaPk7gKfzEhrPR6B1Bo1gAJfEVug==",
			sign_type: "RSA2"
		},
		resultStatus: "9000"
	},
	nativeSaveWebView2Png: {
		result: "0000"
	},
	nativeSwipePay: {
		errorCode: "0000"
	},
	nativeGetQRCodeContent: {
		content: "https://172.16.40.188:3200/activity/OpenRedEnvelope/700000001192610/150****0030/95278245ab9ba64f80a2777d7ec4b7e8"
	},
	nativeWebShare: {
		type: "COPY_URL"
		// type: 'QR_CODE'
	},
	nativeEnterModule: {}
};

export default mockData;

// 获取模拟用户信息
export const dev_getNativeLocationInfo = (successCallback) => {
	successCallback(mockData.getRequestBaseMockParams);
};

//

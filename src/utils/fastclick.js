import deviceMark from "@/interface/deviceMark";
import Fastclick from "fastclick";

export const initFastClick = () => {
	Fastclick.prototype.needsClick = function (target) {
		switch (target.nodeName.toLowerCase()) {
			case "button":
			case "select":
			case "textarea":
				if (target.disabled) {
					return true;
				}
				break;
			case "input":
				if ((deviceMark.isIOS && target.type === "file") || target.disabled) {
					return true;
				}
				break;
			case "label":
			case "video":
				return true;
			default:
				return true;
		}
		return /\bneedsclick\b/.test(target.className);
	};

	Fastclick.prototype.needsFocus = function (target) {
		switch (target.nodeName.toLowerCase()) {
			case "textarea":
				return true;
			case "select":
				return !deviceMark.isAndroid;
			case "input":
				switch (target.type) {
					case "button":
					case "checkbox":
					case "file":
					case "image":
					case "radio":
					case "submit":
						return false;
				}
				return !target.disabled && !target.readOnly;
			default:
				return /\bneedsfocus\b/.test(target.className);
		}
	};
};

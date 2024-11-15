import { useEffect, useState } from "react";
import { observeDocumentTitle } from "@/utils";
import { nativeSetTitle } from "@/interface/jsNative";

export const useTitle = (title) => {
	if (document.title !== title) {
		document.title = title;
		nativeSetTitle(title);
	}
};

// 用于管理文档标题的自定义 Hook
export const useSettingTitle = (initialTitle) => {
	const [title, setTitle] = useState(initialTitle);

	useEffect(() => {
		const handleTitleChange = (newTitle) => {
			if (title !== newTitle) {
				setTitle(newTitle);
			}
		};
		const cleanup = observeDocumentTitle(handleTitleChange);
		return () => cleanup();
	}, [title]);

	return [title, setTitle];
};

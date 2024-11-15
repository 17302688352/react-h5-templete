import React, { lazy } from "react";
import BasicsLayout from "@/layouts/basics";
import { Navigate } from "react-router-dom";
import { Toast } from "@/components";
import { isDev, isProd } from "@/config";

const withLayout = (Component, module) => {
	const MemoizedComponent = React.memo(Component);
	return (props) => (
		<BasicsLayout pageOptions={module.default.options} {...props}>
			<MemoizedComponent {...props} />
		</BasicsLayout>
	);
};
// 动态导入所有的页面模块
const modules = import.meta.glob("../pages/**/*.(nav.jsx|nav.tsx)");

async function createRoutes() {
	const routes = [];

	for (const path in modules) {
		const name = extractPath(path);
		if (!name) {
			return;
		}
		const module = await modules[path]();
		// 使用 @vite-ignore 注释 告诉 Vite 在构建过程中忽略对特定动态导入的静态分析，这样可以避免警告，同时保持代码的懒加载功能
		const LazyComponent = lazy(() => import(/* @vite-ignore */ path));
		if (isProd && module?.default?.options?.isDebugger) {
			//  不做处理 为了就是删除掉 debugger页面
		} else {
			const route = {
				name,
				path: `/${name}`,
				options: module.default.options || {},
				Component: withLayout(LazyComponent, module),
				children: []
			};
			routes.push(route);
		}
	}
	if (isDev) {
		routes.push({
			path: "*",
			options: {
				menuHide: true
			},
			Component: () => <Navigate replace to='/AllPage' />
		});
	} else {
		routes.push({
			path: "*",
			options: {
				title: "404",
				menuHide: true
			},
			Component: () => <Navigate replace to='/NotFoundPage' />
		});
	}

	return routes;
}

export default createRoutes;

function isCamelCaseWithPageSuffix(s) {
	// ^ 表示字符串开始
	// [A-Z] 表示首字母大写
	// [a-zA-Z]* 表示后续是任意字母的组合
	// Page$ 表示字符串以Page结尾
	const pattern = /^[A-Z][a-zA-Z0-9]*Page$/;
	if (pattern.test(s)) {
		return true;
	} else {
		const tips = `路由名【${s}】不符合规范，以大驼峰写法，以“Page”结尾，如：LoginPwdPage`;
		Toast.fail(tips);
		throw new Error(tips);
	}
}

// 将路径转换为路由路径
function extractPath(file) {
	// 正则表达式匹配以 .nav.tsx 结尾的文件名，并忽略路径
	const matches = file.match(/([^/]+)\.nav\.(jsx|tsx)$/);
	if (matches && matches.length > 0 && matches[1] && isCamelCaseWithPageSuffix(matches[1])) {
		return matches[1];
	}
	// 如果匹配成功，返回文件名的前缀，否则返回 "/NotFoundPage"
	return "";
}

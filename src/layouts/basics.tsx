import React, { Children, ReactNode, Suspense, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "antd-mobile";
import { Loading } from "@/components";
import { useToken, useSettingTitle, useNavigationBar } from "@/hooks";
import * as ajax from "@/axios";
import { imageMap } from "@/assets/images";
import { useStore } from "@/store";

type PropsType = { useStore: any; imageMap: any; ajax: any; pageOptions: pageOptionsProps; navigate: any };
// 定义AppInfo的类型
interface pageOptionsProps {
	left?: (propsData: PropsType) => React.ReactNode;
	backIcon?: (propsData: PropsType) => React.ReactNode;
	right?: (propsData: PropsType) => React.ReactNode;
	title?: string;
	hideBack?: boolean;
	navBackground?: string;
}

const BasicsLayout = ({ pageOptions, children }: { pageOptions: pageOptionsProps; children: ReactNode }) => {
	const navigate = useNavigate();
	const token = useToken();
	const [title] = useSettingTitle(pageOptions?.title || "");
	const hideNavBar = useNavigationBar();

	if (!token) {
		return <Loading />;
	}

	const propsData = { useStore, imageMap, ajax, pageOptions, navigate };

	return (
		<div className='flex-col flex min-h-screen'>
			{!hideNavBar && (
				<NavBar
					onBack={() => navigate(-1)}
					left={pageOptions?.left && typeof pageOptions.left === "function" ? pageOptions.left(propsData) : null}
					backIcon={pageOptions?.backIcon && typeof pageOptions.backIcon === "function" ? pageOptions.backIcon(propsData) : null}
					back={pageOptions?.hideBack ? null : true}
					right={pageOptions?.right && typeof pageOptions.right === "function" ? pageOptions.right(propsData) : null}
					style={{
						position: "sticky",
						top: 0,
						width: "100%",
						zIndex: 999,
						backgroundColor: pageOptions?.navBackground || "#fff",
						transition: "background-color 0.3s"
					}}>
					{title}
				</NavBar>
			)}
			{Children.map(children, (child: any, index) => (
				<Suspense fallback={<Loading />} key={child?.key || child.props.name || index}>
					{cloneElement(child as any, propsData)}
				</Suspense>
			))}
		</div>
	);
};

export default BasicsLayout;

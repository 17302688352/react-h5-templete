import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, Input, Switch, ProgressBar, Tag } from "antd-mobile";
import createRoutes from "@/router/routes";
import { Loading } from "@/components";
import { useStore } from "@/store";
const Item = List.Item;

const AllPage = () => {
	const [routes, setRoutes] = useState([]);
	// const [searchValue, setSearchValue] = useState("");
	const [isListMode, setIsListMode] = useState(true);
	const [loadedCount, setLoadedCount] = useState(0);
	const { searchWord, setSearchWord } = useStore("searchWord", "setSearchWord");

	const navigate = useNavigate();

	useEffect(() => {
		createRoutes().then((loadedRoutes) => {
			const visibleRoutes = loadedRoutes.filter((item) => !item?.options?.menuHide);
			// 初始化时过滤路由
			filterRoutes(visibleRoutes);
		});
	}, []);

	const filterRoutes = (routesToFilter) => {
		const filteredRoutes = routesToFilter.map((route) => ({
			...route,
			isVisible: `${route.author}-${route?.name}-${route?.path}-${route?.options?.title}`.toLowerCase().includes(searchWord.toLowerCase())
		}));
		setRoutes(filteredRoutes);
	};

	useEffect(() => {
		// 当 searchWord 更新，过滤当前已加载的路由
		filterRoutes(routes);
	}, [searchWord]);

	const handleIframeLoad = () => {
		setLoadedCount((prev) => prev + 1);
	};

	const currentRoutes = routes.slice(0, loadedCount + 1);

	if (routes.length === 0) {
		return <Loading />;
	}

	return (
		<div>
			<div className='border py-1 bg-white flex flex-row gap-[20px]'>
				<div className='bg-[#f5f5f5] flex-1 px-[20px] py-[10px] rounded'>
					<Input className='flex-1' placeholder='根据关键字筛选页面' clearable value={searchWord} onChange={setSearchWord} />
				</div>
				<Switch checked={isListMode} onChange={setIsListMode} />
			</div>
			<div>
				{!isListMode && (
					<ProgressBar
						percent={(loadedCount / routes.length) * 100}
						text={`${loadedCount} / ${routes.length}`}
						style={{
							"--text-width": "80px"
						}}
					/>
				)}
			</div>
			<List header={`所有页面展示: 共${routes.length}个`} style={{ display: isListMode ? "block" : "none" }}>
				{routes.map(
					(item, index) =>
						item.isVisible && (
							<Item
								extra={item.options.isDebugger ? <Tag color='danger'>仅调试可见</Tag> : null}
								description={item.path}
								value={item?.options?.title}
								clickable
								key={item.path}
								onClick={() => navigate(item.path)}>
								{index + 1}、{item?.options?.title}
							</Item>
						)
				)}
			</List>
			<div className='flex flex-row flex-wrap justify-between' style={{ width: "100%", display: isListMode ? "none" : "flex" }}>
				{currentRoutes.map((route, index) => (
					<div
						key={index}
						style={{
							width: 750 / 4 + "px",
							height: 400 + "px",
							display: route.isVisible ? "block" : "none"
						}}>
						<div className='flex flex-col'>
							<span style={{ fontSize: 12, color: "#fff" }}>
								{index + 1}、{route.title}
							</span>
							<a style={{ fontSize: 12, color: "#0A62FF" }} onClick={() => navigate(route.path)}>
								查看详情
							</a>
						</div>
						<iframe
							src={route.path + "?preview=true"}
							style={{
								width: 750 / 4 + "px",
								height: 333.5 + "px",
								border: "none"
							}}
							loading={!isListMode ? "eager" : "lazy"}
							onLoad={handleIframeLoad}
							onError={handleIframeLoad}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

AllPage.options = {
	title: "所有页面",
	menuHide: true,
	hideNavBar: true,
	isDebugger: true
};

export default AllPage;

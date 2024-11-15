/*
 * @Date: 2024-08-07 09:33:17
 * @LastEditors: shawn
 * @LastEditTime: 2024-08-07 14:12:39
 */
import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { PullToRefresh, InfiniteScroll } from "antd-mobile";
import { PullStatus } from "antd-mobile/es/components/pull-to-refresh";
interface IItem {
	data: [];
	total: number;
}
interface paramsProps {
	pageNum: number;
}
interface IProps {
	loadMore: (params: paramsProps) => Promise<IItem>; // 加载更多
	renderItem: (item: unknown, index: number, total?: number) => JSX.Element; // 渲染item

	ListEmptyComponent?: () => JSX.Element; // 空数据
	ListHeaderComponent?: () => JSX.Element; // 头部
	autoLoad?: boolean; // 是否自动加载
	disabledFresh?: boolean; // 是否禁用下拉刷新
	innerClassName?: string; // 内容样式
	pullThreshold?: number; // 下拉刷新阈值
	threshold?: number; // 上拉加载阈值
	statusRecord?: Record<PullStatus, string>; // 下拉刷新状态文案
	canClickRefresh?: boolean; // 是否可以点击刷新
}

// const statusRecord: Record<PullStatus, string> = {
//   pulling: '用力拉',
//   canRelease: '松开吧',
//   refreshing: '玩命加载中...',
//   complete: '好啦',
// }

const InfiniteScrollWithRefresh = forwardRef(
	(
		{
			loadMore,
			innerClassName: innerClassName = "",
			renderItem,
			ListEmptyComponent,
			autoLoad = true,
			disabledFresh = false,
			ListHeaderComponent,
			pullThreshold = 60,
			threshold = 250,
			statusRecord,
			canClickRefresh = true
		}: IProps,
		ref
	) => {
		const [dataList, setDataList] = useState([]);
		const [hasMore, setHasMore] = useState(autoLoad);
		const pageNum = useRef(1);
		const [loadingError, setLoadingError] = useState(false);
		const refresh = () => {
			pageNum.current = 1;
			setHasMore(true);
			setDataList([]);
		};

		useImperativeHandle(ref, () => ({
			refresh: refresh
		}));

		const fetchMoreData = async () => {
			if (!hasMore || loadingError) return; // 如果已经存在错误，停止加载更多数据
			try {
				const { data, total } = await loadMore({ pageNum: pageNum.current });
				setDataList((prevDataList) => {
					setHasMore([...prevDataList, ...data].length < total);
					return pageNum.current === 1 ? data : [...prevDataList, ...data];
				});
				pageNum.current++;
				setLoadingError(false); // 成功后重置错误状态
			} catch (error) {
				console.error("Loading failed:", error);
				setLoadingError(true); // 设置错误状态
				return; // 提前返回，防止状态更新
			}
		};

		const onRefresh = async () => {
			if (!disabledFresh) {
				pageNum.current = 1;
				setHasMore(true);
				await fetchMoreData();
			}
		};

		return (
			<PullToRefresh threshold={pullThreshold} renderText={(status) => statusRecord?.[status] || "下拉刷新"} onRefresh={onRefresh} disabled={disabledFresh}>
				{ListHeaderComponent && ListHeaderComponent()}
				{dataList.length ? (
					<div className={innerClassName ? innerClassName : ""}>
						{dataList.map((item, index) => (
							<div key={index}>{renderItem(item, index, dataList.length)}</div>
						))}
					</div>
				) : null}

				{dataList.length === 0 && ListEmptyComponent && !hasMore ? (
					<div
						onClick={() => {
							if (canClickRefresh) {
								refresh();
							}
						}}>
						{ListEmptyComponent()}
					</div>
				) : (
					<InfiniteScroll threshold={threshold} loadMore={fetchMoreData} hasMore={hasMore} />
				)}
			</PullToRefresh>
		);
	}
);

export default InfiniteScrollWithRefresh;

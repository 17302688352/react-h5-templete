# InfiniteScroll 无限滚动

列表滚动到底部自动加载更多数据。

## 代码示例

```jsx
import { InfiniteScrollWithRefresh } from "@/components";

function Example() {
	const loadMore = async ({ pageNum }) => {
		console.log("当前查询页数", pageNum);
		const { data, total } = await ajax.post("/api/list", { pageNum });
		return { data, total };
	};

	const renderItem = ({ item }) => {
		return (
			<div>
				<span>{item}</span>
			</div>
		);
	};

	return <InfiniteScroll loadMore={loadMore} renderItem={renderItem} />;
}
```

## 属性说明

| **属性**            | **说明**                                                 | **类型**                                                                     | **可选值** | **默认值** |
| ------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------- | ---------- |
| loadMore            | 加载数据的异步方法，返回数据对象                         | async (pageNum: Number, sourceData: Array) => ({data: Array, total: Number}) | 必填       | -          |
| renderItem          | 渲染列表项                                               | (item: any, sourceData: Array) => React.ReactNode                            | 必填       | -          |
| ListEmptyComponent  | 空数据展示dom                                            | React.ReactNode                                                              | 可选       | none       |
| ListHeaderComponent | 列表头部                                                 | React.ReactNode                                                              | 可选       | none       |
| autoLoad            | 是否自动加载                                             | Boolean                                                                      | 可选       | true       |
| disabledFresh       | 是否禁用下拉刷新                                         | Boolean                                                                      | 可选       | false      |
| pullThreshold       | 下拉刷新阈值                                             | Number                                                                       | 可选       | 60         |
| threshold           | 上拉加载阈值                                             | Number                                                                       | 可选       | 250        |
| statusRecord        | 下拉刷新状态文案                                         | Record<PullStatus, string>                                                   | 可选       | '下拉刷新' |
| canClickRefresh     | 空数据时是否可以点击刷新，当ListEmptyComponent不为空可见 | boolean                                                                      | 可选       | true       |

## 方法

`ref`可调用的方法

### refresh：刷新列表

刷新列表，pageNum 会重置为 1；

import { useState } from "react";
import { Image, Input, Tag } from "antd-mobile";
import { Toast } from "@/components";

function renderImages(imageMap, lastKey, searchKey) {
	return Object.keys(imageMap).flatMap((key) => {
		const item = imageMap[key];
		const fullKey = `${lastKey}.${key}`; // 记录完整的 key

		// 处理模糊搜索，根据完整的 key 进行匹配
		const isMatch = fullKey.toLowerCase().includes(searchKey.toLowerCase());

		// 如果是对象，则递归渲染，并检查子元素是否匹配
		if (typeof item === "object") {
			const childImages = renderImages(item, fullKey, searchKey);

			// 如果当前层级不匹配，但子元素匹配，则仍然渲染当前层级的 DemoBlock
			return (
				childImages.length > 0 && (
					<div key={key} className='flex flex-wrap gap-[10px]'>
						{childImages}
					</div>
				)
			);
		}

		// 如果是字符串，渲染图片
		if (isMatch) {
			return (
				<div key={fullKey} className='bg-white mb-[20px] rounded relative' onClick={() => copy(fullKey)}>
					<Tag color='red' className='absolute top-0 right-0 opacity-50'>
						{key}
					</Tag>
					<Image src={item} className='w-full' height={80} />
					<div className='text-center mt-[20px] pb-[10px] text-[20px] line-clamp-1 px-[20px]'>{fullKey}</div>
				</div>
			);
		}

		return []; // 返回空数组，如果没有匹配
	});
}

function copy(text) {
	navigator.clipboard.writeText(text).then(
		() => {
			Toast.info("复制成功:  " + text);
		},
		() => {
			Toast.fail("复制失败");
		}
	);
}

function AllImagePage({ imageMap }) {
	const [searchKey, setSearchKey] = useState("");

	//  获取后缀

	return (
		<div className='bg-gray-100 min-h-screen'>
			<div className='sticky top-0 p-[20px] bg-white'>
				<Input
					type='text'
					placeholder='搜索图片...'
					value={searchKey}
					onChange={(val) => {
						setSearchKey(val);
					}}
					className='mb-[20px] p-[10px] rounded border'
				/>
			</div>
			<div className='flex flex-wrap gap-[10px] px-[20px] mt-[20px]'>{renderImages(imageMap, "imageMap", searchKey)}</div>
		</div>
	);
}

AllImagePage.options = {
	title: "项目图片",
	isDebugger: true
};

export default AllImagePage;

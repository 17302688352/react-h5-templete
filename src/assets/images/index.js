// 导入所有图片
const images = import.meta.glob("@/assets/images/**/*.{png,svg,jpg,jpeg,gif,webp}", {
	eager: true
});

// 创建一个新的对象来存储处理后的路径
const imageMapList = {};

// 遍历导入的图片路径
for (const path in images) {
	if (Object.prototype.hasOwnProperty.call(images, path)) {
		const pathParts = path.split("/"); // 分割路径
		const fileName = pathParts.pop()?.replace(/\.(png|svg|jpg|jpeg|gif|webp)$/, ""); // 获取文件名
		let currentLevel = imageMapList; // 初始化当前层级为imageMapList

		// 遍历路径中的每个部分，构建嵌套结构
		for (let i = 1; i < pathParts.length; i++) {
			const folderName = pathParts[i];

			// 如果当前层级没有该文件夹，则创建它
			if (!currentLevel[folderName]) {
				currentLevel[folderName] = {};
			}

			// 移动到下一个层级
			currentLevel = currentLevel[folderName];
		}

		// 将文件名作为键，路径作为值
		if (fileName) {
			currentLevel[fileName] = images[path].default;
		}
	}
}
export const imageMap = imageMapList.src.assets.images;

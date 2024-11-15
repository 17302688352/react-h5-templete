import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import hoistNonReactStatic from "hoist-non-react-statics";

import { useSelector } from "./useSelector";

const modals = import.meta.glob("@/store/*.modal.js");

const commonCreate = (set) => ({
	setState: (state) => set(() => ({ ...state }))
});

const initializers = [commonCreate];
const whiteList = [];

const initializeModals = async () => {
	const importPromises = Object.keys(modals).map(async (key) => {
		const module = await modals[key]();
		const { create: initializer, persistWhiteList = [] } = module.default;
		initializers.push(initializer);
		whiteList.push(...persistWhiteList);
	});

	await Promise.all(importPromises);
};

const storeContainer = { useBaseStore: null };
let storeInitialized = false;
export const initStore = () => {
	return new Promise((resolve, reject) => {
		// Define an async function to perform the initialization
		const initialize = async () => {
			try {
				if (storeInitialized) {
					return; // If already initialized, resolve immediately
				}

				storeInitialized = true;

				await initializeModals();

				storeContainer.useBaseStore = create(
					persist(
						(set) => {
							let stateKeys = [];
							const stores = initializers.map((initializer) => {
								const slice = initializer(set);
								stateKeys.push(...Object.keys(slice)); // Using push to add keys
								return slice;
							});

							const store = Object.assign({}, ...stores);

							// Check for duplicate state keys
							const findDuplication = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
							const duplication = findDuplication(stateKeys);

							if (duplication.length) {
								throw new Error(`store 属性重复: ${duplication[0]}，请修改！`);
							}

							return store;
						},
						{
							name: "syt-data",
							storage: createJSONStorage(() => sessionStorage),
							partialize: (state) => {
								// Only persist whitelisted state properties
								return Object.keys(state).reduce((acc, key) => {
									if (whiteList.includes(key)) {
										acc[key] = state[key];
									}
									return acc;
								}, {});
							}
						}
					)
				);

				// Ensure hoistNonReactStatic returns a Promise
				await hoistNonReactStatic(useStore, storeContainer.useBaseStore);
				resolve(); // Initialization completed, resolve the Promise
			} catch (error) {
				console.error("Store initialization failed:", error);
				reject(error); // Reject the Promise on error
			}
		};

		initialize(); // Call the async function
	});
};

const useStore = (...stateKeys) => {
	if (!storeContainer.useBaseStore) {
		throw new Error("store 初始化失败，请检查是否调用 initStore");
	}
	const store = storeContainer.useBaseStore(useSelector(["setState", ...stateKeys]));
	return store;
};

// 热更新监听

if (import.meta.hot) {
	storeInitialized = false; // 重置初始化标志
	import.meta.hot.accept(() => {
		initStore(); // 重新初始化 store
	});
}

export { useStore };

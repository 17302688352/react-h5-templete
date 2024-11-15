module.exports = {
	types: [
		{ value: "feat", name: "feat:     新增功能" },
		{ value: "fix", name: "fix:      修复 bug" },
		{ value: "docs", name: "docs:     文档变更" },
		{ value: "style", name: "style:    代码格式变更（不影响功能，比如空格、格式化、缺失的分号等）" },
		{ value: "refactor", name: "refactor: 代码重构" },
		{ value: "perf", name: "perf:     性能优化" },
		{ value: "test", name: "test:     添加或修改测试" },
		{ value: "chore", name: "chore:    构建过程或辅助工具的变更" },
		{ value: "revert", name: "revert:   回滚到上一个版本" }
	],
	allowCustomScopes: true,
	allowBreakingChanges: ["feat", "fix"]
};

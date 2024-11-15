import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,

	{
		languageOptions: {
			parserOptions: {
				warnOnUnsupportedTypeScriptVersion: false
			}
		},
		settings: {
			react: {
				version: "detect"
			}
		},
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",
			"react/prop-types": "off",
			"react/display-name": "off",
			"@typescript-eslint/no-explicit-any": ["off"],
			// "no-unused-vars": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn", // 或者 "off" 来禁用
				{
					varsIgnorePattern: "^_", // 忽略以下划线开头的变量
					args: "after-used", // 忽略 args 参数
					argsIgnorePattern: "^_", // 忽略以下划线开头的参数
					caughtErrors: "none" // 忽略没有被捕获的错误
				} // 忽略以下划线开头的参数
			],

			"@typescript-eslint/no-unsafe-function-type": "off"
		}
	}
];

# 简介

一个自用的 React 移动端 H5 项目模板，主要为了减少每次项目开发前的重复操作。主要采用 Vite + React + TypeScript + SWC + Tailwind css + Zustand + Ant Design Mobile 等常用技术栈和常用库构建。

# 安装

> node >=18
>
> 或
>
> 18.18.0

```plain
yarn
```

# 运行

```bash
yarn dev
// 注意修改 .env.development 文件
```

测试打包

````bash
yarn rancher
// 注意修改 .env.test文件
````

# 生产打包

```bash
yarn build
// 注意修改 .env.production文件
```

# 技术栈与库

-   react
-   zustand(用法规范与react-native相似)
-   antd-mobile(最新5.x)
-   tailwindcss
    -   也支持模块化css(less)
-   githooks
    -   规范提交代码
    -   自动生成版本记录

# 能力

-   神策（符合随行付埋点规范）
-   sentry（监控平台）
-   兼容老机型
    -   vite 目前4.4.4 否则老机型会白屏
-   px to rem
-   多环境配置
    -   vite
-   动态引入路由
    -   自动加载pages文件夹以nav.jsx结尾的文件作为路由
    -   AllPage页面可搜索或直接预览所有页面UI
-   动态引入图片
    -   AllImagePage页面可搜索或预览所有图片
-   多端对接
    -   x 鑫联盟
    -   鑫一付
    -   mpos
    -   x 鑫联盟鸿蒙
-   规范
    -   最新eslint规范代码
    -   editorconfig 统一编辑器规范
    -   commitlint 规范提交
        -   执行 yarn gitadd
-   rancher
    -   自动部署到测试环境
-   npm-check-updates
    -   检查当前项目依赖与最新版本，可一键升级或指定升级
-   patch-package
    -   根据项目情况使用patch-package进行npm包补丁处理
    -   比如：生成补丁
        -   npx patch-package antd-mobile
-   待完善(后续)
    -   微信公众号授权打通
    -   小程序接口能力
    -   完善功能日志记录

# 组件

-   Toast(用法规范与react-native相似)
-   配置化导航
-   InfiniteScrollWithRefresh(用法规范与react-native相似)
    -   下拉刷新 上拉加载更多（详细见组件md文档）
-   props自动导出
    -   useStore（zustand）
        -   支持配置持久化（详细见md文档）
    -   imageMap(所有图片映射，根据文件夹分层)
    -   pageOptions(页面传入属性)
    -   navigate(导航)
    -   ajax（请求接口）
    -   jsNative(原生提供方法统一规范入口)
  
# 使用
- 默认支持jsx与tsx 可根据个人习惯使用，组件建议使用tsx，方便后续使用
- src/layouts/basics.tsx为所有页面默认套件，可处理一下共用处理的事务
- 改变标题，可以直接使用useTitle("页面标题")或直接使用document.title = "xxxx"
- 引用图片使用 props.imageMap.xxx.xxx(默认支持懒加载)
- 调用接口使用props.ajax.post(url,{xxx}) (postJSON,post,get...)
- 使用状态管理器props.useStore
- 使用导航navigate：props.navigate
- 获取当前页面的options：props.pageOptions
- 获取用户基本信息nativeRequestBaseParams
- 使用神策sa: 开关VITE_SA_OPEN = "true" 具体使用见sa.tsx
- 与原生交互方法都在src/interface/jsNative.js 可根据实际情况新增和修改
- 已支持css模块化和tailwindcss 可根据个人习惯使用
- 最新eslint已支持
- 已支持的组件：
  - 上拉加载更多组件
  - Toast简易封装
  - ErrorBoundary 系统报错套件
  - 默认支持导航 可通过配置：全局禁用或单页面显示隐藏等，具体见useNavigationBar

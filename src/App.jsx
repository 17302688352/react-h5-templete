/*
 * @Date: 2024-06-03 10:43:29
 * @LastEditors: shawn
 * @LastEditTime: 2024-09-06 09:19:45
 */
import React from "react";
import { initStore } from "@/store";
import { RouterProvider } from "react-router-dom";
import { setupRouter } from "./router";
import { Suspense, useEffect, useState } from "react";
import { Loading, ErrorBoundary } from "@/components";
import VConsole from "vconsole";
import { SAInit } from "@/utils/sa";
import { isProd } from "./config";
import { initJSBridge } from "@/interface/jsBridge";
import { initFastClick } from "@/utils/fastclick";
import { useSetDefaultShowNavBar } from "@/hooks";

const initializeVConsole = () => {
  let vConsole;
  let preview = false;
  // 获取浏览器参数
  const urlParams = new URLSearchParams(window.location.search);
  preview = urlParams.get("preview") === "true";
  // 如果是开发环境，就实例vConsole
  if (typeof window !== "undefined" && !isProd && !preview) {
    vConsole = new VConsole({ theme: "dark" });
  }
  return vConsole;
};

initJSBridge();

export default function App() {
  const [storeInitialized, setStoreInitialized] = useState(false);
  const [router, setRouter] = useState(null);
  //如果是dev环境，就实例vConsole
  initializeVConsole();

  useEffect(() => {
    setupRouter().then(setRouter);
  }, []);

  useEffect(() => {
    initFastClick();
    const initializeStore = async () => {
      await initStore();
      setStoreInitialized(true);
      // 注册神策
      SAInit();
      useSetDefaultShowNavBar();
    };
    initializeStore();
  }, []);


  if (!storeInitialized || !router) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {isProd ? (
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      ) : (
        <RouterProvider router={router} />
      )}
    </Suspense>
  );
}

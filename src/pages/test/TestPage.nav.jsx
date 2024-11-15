import { useEffect, useState } from "react";
import { Button, Swiper, Collapse } from "antd-mobile";
import { InfiniteScrollWithRefresh, Toast } from "@/components";
import { useTitle, useSettingNavBar } from "@/hooks";

function TestPage(props) {
  const { useStore, imageMap, pageOptions, navigate, ajax } = props;
  const [num, setNum] = useState(0);
  const { hideNavBar, token, setHideNavBar, setToken } = useStore("hideNavBar", "token", "setHideNavBar", "setToken");

  // useStore 使用仓库
  // imageMap 图片映射
  // pageOptions 当前页面options配置
  // navigate 跳转

  const handleTitleChange = (type) => {
    const _a = 1;
    setNum((prevNum) => {
      Toast.info(`点击了${type},${prevNum + 1}次`);

      return prevNum + 1;
    });
    // 坑啦！这样写竟然num不会变了
    // setNum(num + 1);
    // Toast.info(`点击了${type},${num}次`);
  };

  useEffect(() => {
    //  设置默认是否隐藏导航栏
    useSettingNavBar("hide");
    pageOptions.rightClick = () => {
      handleTitleChange(1);
    };
    pageOptions.rightClick2 = () => {
      handleTitleChange(2);
    };
    console.log("pageOptions", pageOptions, ajax);
  }, []);

  const colors = ["#ace0ff", "#bcffbd", "#e4fabd", "#ffcfac"];
  const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
      <div
        className='h-[120px]'
        style={{ background: color }}
        onClick={() => {
          Toast.info(`你点击了卡片 ${index + 1}`);
        }}>
        {index + 1}
      </div>
    </Swiper.Item>
  ));

  // 接口
  async function loadMore() {
    // { pageNum }
    // 条件
    // const Moreparams = {
    //   pageNum: pageNum,
    //   pageSize: 10
    // };
    // // 接口
    // const res = await ajax.post(
    //   "/xlm-app/deviceManage/getAppDeviceManageList",
    //   Moreparams
    // );

    // // 返回值必须是data和total
    // return {
    //   data: res?.data?.records || [],
    //   total: res?.data?.total || 0,
    // };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], total: 10 });
      }, 3000);
    });
  }

  return (
    <div>
      <Collapse defaultActiveKey={["1"]} accordion>
        <Collapse.Panel key='1' title='Toast'>
          <Button color='primary' onClick={() => Toast.info("toast")}>
            toast info
          </Button>
          <Button color='danger' onClick={() => Toast.fail("toast")}>
            toast fail
          </Button>
          <Button color='primary' onClick={() => Toast.loading("toast", 3)}>
            toast loading
          </Button>

          <Button color='primary' onClick={() => Toast.success("toast")}>
            toast success
          </Button>

          <Button color='primary' onClick={() => Toast.custom("toast", <img src={imageMap.icons.box} />)}>
            toast 自定义
          </Button>

          <Button color='primary' onClick={() => Toast.hide()}>
            toast 关闭
          </Button>
        </Collapse.Panel>
        <Collapse.Panel key='2' title='zustand的使用'>
          <Button color='primary' onClick={() => setToken(Math.random().toString())}>
            点击设置随机token token:{token}
          </Button>
        </Collapse.Panel>

        <Collapse.Panel key='3' title='展示图片'>
          <div>
            <div>props中导出imageMap即可： imageMap.文件夹1.文件夹2.文件名 如：imageMap.icons.box</div>
            <img src={imageMap.icons.box} alt='' />
            <Button color='primary' onClick={() => navigate("/AllImagePage")}>
              查看项目全部图片
            </Button>
          </div>
        </Collapse.Panel>

        <Collapse.Panel key='4' title='页面跳转'>
          <div>props导出navigate即可使用</div>
          <Button color='primary' onClick={() => navigate("/LoginPage")}>
            跳转到login
          </Button>
        </Collapse.Panel>

        <Collapse.Panel key='5' title='下拉刷新组件'>
          <div>下拉刷新 上拉加载更多</div>
          <InfiniteScrollWithRefresh loadMore={loadMore} renderItem={(item) => <div>{item}</div>} />

          <div>下拉刷新 上拉加载更多 + 头部展示</div>
          <InfiniteScrollWithRefresh
            ListHeaderComponent={() => (
              <div className='px-[100px]'>
                <Swiper autoplay>{items}</Swiper>
              </div>
            )}
            loadMore={loadMore}
            renderItem={(item) => <div>{item}</div>}
          />

          <div>不能下拉刷新 上拉加载更多</div>
          <InfiniteScrollWithRefresh loadMore={loadMore} disabledFresh={true} renderItem={(item) => <div>{item}</div>} />
        </Collapse.Panel>

        <Collapse.Panel key='6' title='请求接口'>
          <div>props 导出ajax即可使用 post,get,postJSON</div>
          <Button
            onClick={() => {
              Toast.info("请求接口");
              ajax.post("/xlm-app/deviceManage/getAppDeviceManageList", {
                pageNum: 1,
                pageSize: 10
              }).then((res) => {
                console.log(res);
              });
            }}>
            发起请求
          </Button>
        </Collapse.Panel>

        <Collapse.Panel key='7' title='标题改变'>
          <div>props导出useTitle即可</div>
          <Button color='primary' onClick={() => useTitle("手动改变title" + Math.random())}>
            改变title
          </Button>
          num: {num}
        </Collapse.Panel>

        <Collapse.Panel key='8' title='是否隐藏导航'>
          <div>props导出useTitle即可</div>
          <Button color='primary' onClick={() => setHideNavBar(hideNavBar === "hide" ? "show" : "hide")}>
            改变导航
          </Button>
          num: {num}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

const right = (props) => {
  const { pageOptions } = props;
  return (
    <div className='flex flex-row gap-[10px] justify-end'>
      <div
        className='text-[24px]'
        onClick={() => {
          pageOptions.rightClick();
        }}>
        操作1
      </div>

      <div
        className='text-[24px]'
        onClick={() => {
          pageOptions.rightClick2();
        }}>
        操作2
      </div>
    </div>
  );
};

TestPage.options = {
  title: "功能展示页面",
  isDebugger: true,
  right: right
};
export default TestPage;

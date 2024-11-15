let loadSuccess = false;

/**
 * 初始化高德导航
 */
export const initMap = callback => {
  var sdk_key = 'c1c8fb49db3521e7c7d0384e1ce706dc';
  var sdk_url = 'https://webapi.amap.com/maps?v=1.4.8&key=' + sdk_key;
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = sdk_url;
  head.appendChild(script);

  script.onload = function () {
    callback();
    loadSuccess = true;
  };
};

/**
 * 获取定位信息
 */
export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (loadSuccess) {
      amapLocationListener(resolve, reject);
    } else {
      initMap(() => {
        amapLocationListener(resolve, reject);
      });
    }
  });
};

const amapLocationListener = (resolve, reject) => {
  const locationRes = {
    province: null, // 省
    city: null, // 市
    lng: null, // 经度
    lat: null, // 纬度
    address: null, // 详细地址
  };

  const { AMap } = window;
  var mapObj = new AMap.Map('iCenter');
  mapObj.plugin('AMap.Geolocation', function () {
    const geolocation = new AMap.Geolocation({
      timeout: 3000,
    });
    mapObj.addControl(geolocation);
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete', function (a) {
      const { addressComponent, position } = a;
      console.log(a);
      resolve({
        ...locationRes,
        province: addressComponent.province,
        city: addressComponent.city,
        lng: position.lng,
        lat: position.lat,
        address: a.formattedAddress,
      });
    });

    AMap.event.addListener(geolocation, 'error', function () {
      geolocation.getCityInfo(function (status, result) {
        console.log(result);
        if (status === 'complete') {
          resolve({
            ...locationRes,
            province: result.province,
            city: result.city,
            lng: result.center[0],
            lat: result.center[1],
          });
        } else {
          reject(result);
        }
      });
    });
  });
};

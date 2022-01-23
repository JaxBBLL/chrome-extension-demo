let timer = null;
let userInfo = {};
const HOST = "http://192.168.80.12:9566";

fetchClose();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background", request);
  if (request.type == "LOGIN_CHECK") {
    getLoginState((res) => {
      sendResponse({
        type: request.type,
        data: res,
        message: "操作成功",
      });
    });
  } else if (request.type == "SYNC_START") {
    fetchRepeat((res) => {
      sendResponse({
        type: request.type,
        data: res,
        message: "操作成功",
      });
    });
  } else if (request.type === "SYNC_CLOSE") {
    fetchClose();
    sendResponse({
      type: request.type,
      message: "同步关闭",
    });
  } else {
    sendResponse({
      type: request.type,
      message: "未知操作",
    });
  }
  return true;
});

function notification(id, message) {
  chrome.notifications.getPermissionLevel((level) => {
    // 获取用户是否为当前应用或应用启用通知（permissions中已配置可直接调用notifications）
    if (level == "granted") {
      chrome.notifications.create(id, {
        type: "basic",
        title: "提示",
        message: message,
        iconUrl: "images/logo.png",
        requireInteraction: false,
      });
    } else {
      alert(message);
    }
  });
}

function getCookies() {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll(
      {
        url: "https://b2bservice.baidu.com",
      },
      (cookies) => {
        const ret = cookies
          .map((cookie) => cookie.name + "=" + cookie.value)
          .join("; ");
        resolve(ret);
      }
    );
  });
}

function getLoginState(callback) {
  fetch("https://b2bservice.baidu.com/api/auth/getuserinfo", {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      var isLogin = (res.data && res.data.isLogin) || 0;
      chrome.storage.local.set({ isLogin: isLogin });
      userInfo = res;
      var ucName = (userInfo.data && userInfo.data.ucName) || "";
      getCookies().then((cookies) => {
        if (isLogin == 1) {
          getCookies().then((cookies) => {
            callback({
              isLogin: 1,
              token: res.inf.csrf_token,
              cookies,
              ucName,
            });
          });
        } else if (isLogin == 0) {
          callback({
            isLogin: 0,
            token: "",
            cookies,
            ucName,
          });
        }
      });
    })
    .catch(() => {
      chrome.storage.local.set({ isLogin: 0 });
      var ucName = "";
      callback({
        isLogin: 0,
        token: "",
        cookies: "",
        ucName,
      });
    });
}

function fetchRepeat(callback) {
  clearTimeout(timer);
  getLoginState((res) => {
    console.log("getLoginState", res);
    if (res.isLogin == 0) {
      chrome.notifications.clear("notify1");
      notification("notify1", "同步之前用户需要登录");
    } else if (res.isLogin == 1) {
      // 用户登录成功同步数据给后端，5分钟同步一次
      sendAccountInfo(res);
      timer = setTimeout(() => {
        fetchRepeat(callback);
      }, 1000 * 5 * 60);
    }

    chrome.runtime.sendMessage({
      from: "background",
      type: "SYNC_END",
      data: res,
    });
    callback && callback(res);
    chrome.storage.local.set({ isSync: res.isLogin }); // 未登录同步状态不开启
  });
}

function fetchClose() {
  clearTimeout(timer);
  chrome.storage.local.set({ isSync: 0 });
}

function sendAccountInfo(data) {
  chrome.storage.local.get("host", (res) => {
    console.log("get host", res);
    var host = res.host || HOST;
    chrome.storage.local.set({ host });
    fetch(host + "/kb/secret_key/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.code == 200 && res.data) {
          const time = new Date().toLocaleString();
          chrome.storage.local.set({ time });
          chrome.runtime.sendMessage({
            from: "background",
            type: "SYNC_SUCCESS",
            data: time,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

var btnStart = document.getElementById("btn-start");
var btnClose = document.getElementById("btn-close");
var container = document.getElementById("container");
var header = document.querySelector(".header");
var loginStatus = container.querySelector(".login-status");
var syncStatus = container.querySelector(".sync-status");
var input = container.querySelector(".input");
var updateBtn = container.querySelector(".update-btn");
var syncTime = container.querySelector(".sync-time");

chrome.runtime.sendMessage(
  {
    from: "popup",
    type: "LOGIN_CHECK",
  },
  (res) => {
    console.log("LOGIN_CHECK", res);
  }
);

btnStart.addEventListener("click", () => {
  btnStart.setAttribute("disabled", "disabled");
  chrome.runtime.sendMessage(
    { from: "popup", type: "SYNC_START" },
    function (res) {
      setHost();
      btnStart.removeAttribute("disabled");
    }
  );
});

btnClose.addEventListener("click", () => {
  btnClose.setAttribute("disabled", "disabled");
  chrome.runtime.sendMessage(
    { from: "popup", type: "SYNC_CLOSE" },
    function (res) {
      btnClose.removeAttribute("disabled");
    }
  );
});

header.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://b2bservice.baidu.com" });
});

updateBtn.addEventListener("click", () => {
  chrome.storage.local.set({ host: input.value });
  setHost();
  chrome.notifications.clear("notify2");
  chrome.notifications.create("notify2", {
    type: "basic",
    title: "提示",
    message: "更新成功",
    iconUrl: "images/logo.png",
    requireInteraction: false,
  });
  chrome.runtime.sendMessage(
    { from: "popup", type: "SYNC_START" },
    function (res) {
      console.log(res);
    }
  );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("popup", request);
  if (request.type == "SYNC_END") {
    sendResponse({
      type: request.type,
      message: "操作成功",
    });
  } else if (request.type == "SYNC_SUCCESS") {
    syncTime.textContent = request.data;
    sendResponse({
      type: request.type,
      message: "操作成功",
    });
  } else {
    sendResponse({
      type: request.type,
      message: "未知操作",
    });
  }
  return true;
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    if (key == "isSync") {
      syncStatusChange(storageChange.newValue);
    } else if (key == "isLogin") {
      loginStatusChange(storageChange.newValue);
    } else if (key == "host") {
      setHost();
    }
  }
});

chrome.storage.local.get("isSync", (res) => {
  syncStatusChange(res.isSync);
});

chrome.storage.local.get("isLogin", (res) => {
  loginStatusChange(res.isLogin);
});

chrome.storage.local.get("time", (res) => {
  syncTime.textContent = res.time || "";
});

setHost();

function setHost() {
  chrome.storage.local.get("host", (res) => {
    input.value = res.host || "";
  });
}

function loginStatusChange(val) {
  if (val == 1) {
    loginStatus.classList.remove("dot-error");
    loginStatus.classList.add("dot", "dot-success");
    loginStatus.textContent = "是";
  } else if (val == 0) {
    loginStatus.classList.remove("dot-success");
    loginStatus.classList.add("dot", "dot-error");
    loginStatus.textContent = "否";
  }
}

function syncStatusChange(val) {
  if (val == 1) {
    syncStatus.classList.remove("dot-error");
    syncStatus.classList.add("dot", "dot-success");
    syncStatus.textContent = "开启";
  } else if (val == 0) {
    syncStatus.classList.remove("dot-success");
    syncStatus.classList.add("dot", "dot-error");
    syncStatus.textContent = "关闭";
  }
}

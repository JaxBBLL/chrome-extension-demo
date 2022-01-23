// 注入js，进入 https://b2bservice.baidu.com/* 自动开启同步
setTimeout(() => {
  chrome.runtime.sendMessage({ from: "content", type: "SYNC_START" });
}, 2000);

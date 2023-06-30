const contentMessageStrategy = {
  START() {
    chrome.cookies.set(
      {
        name: "ZSSESSIONID",
        url: "http://www.baidu.com",
        domain: ".baidu.com",
        value: "4284c0ae-1eeb-4894-bdc3-659974db6aa3",
      },
      function (cookie) {
        console.log(cookie);
        chrome.tabs.create({ url: "http://www.baidu.com" });
      }
    );
  },
  ACTION() {
    helper();
    function helper() {
      fetch("https://www.zhaosw.com/product/detail/255435821")
        .then((res) => res.text())
        .then((res) => {
          console.log(res);
        });
    }
  },
};

const messageStrategy = {
  content: contentMessageStrategy,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background", request);
  const { from, type } = request;
  messageStrategy[from][type]();
  sendResponse({
    type: type,
    data: true,
    message: "操作成功",
  });
  return true;
});

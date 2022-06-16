chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background', request)
  if (request.type == 'INJECT_START') {
    setCookies({
      k1: 'a',
      k2: 'b',
    })
    sendResponse({
      type: request.type,
      data: true,
      message: '操作成功',
    })
  }
  return true
})

function setCookies(cookies, url = 'https://www.baidu.com') {
  for (let k in cookies) {
    chrome.cookies.set(
      {
        name: k,
        url: url,
        value: cookies[k],
      },
      function (cookie) {},
    )
  }
  // chrome.tabs.create({ url: 'https://www.jd.com' })
}

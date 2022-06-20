const oWrap = document.createElement('div')
oWrap.classList.add('e-container')

oWrap.innerHTML =
  '<div><button class="e-button login" type="button">登录</button><button class="e-button go" type="button">触发</button></div>'
document.body.appendChild(oWrap)

oWrap.querySelector('.login').addEventListener('click', () => {
  chrome.runtime.sendMessage({ from: 'content', type: 'START' })
})

oWrap.querySelector('.go').addEventListener('click', () => {
  chrome.runtime.sendMessage({ from: 'content', type: 'ACTION' })
  Message.success('Message')
})

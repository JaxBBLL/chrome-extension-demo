const oWrap = document.createElement('div')
oWrap.classList.add('e-container')
oWrap.innerHTML = 'Hello'
document.body.appendChild(oWrap)

oWrap.addEventListener('click', () => {
  chrome.runtime.sendMessage({ from: 'content', type: 'INJECT_START' })
  Message.success('Message')
})

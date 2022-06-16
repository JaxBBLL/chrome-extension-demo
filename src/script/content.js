const oButton = document.createElement('button')
oButton.classList.add('e-button')
oButton.type = 'button'
oButton.innerHTML = 'Hello'
document.body.appendChild(oButton)

oButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ from: 'content', type: 'INJECT_START' })
  Message.success('HHH')
})

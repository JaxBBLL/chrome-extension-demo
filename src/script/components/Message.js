!(function () {
  var wrapper = null

  function addWrapper() {
    if (wrapper) {
      return
    }
    wrapper = document.createElement('div')
    wrapper.className = 'e-wrapper'
    document.body.appendChild(wrapper)
  }

  function Message(options) {
    var text = options.text
    var type = options.type
    var duration = options.duration === undefined ? 3000 : options.duration
    addWrapper()
    var className = 'e-message-wrap'
    if (type === 'warning') {
      className += ' warning'
    } else if (type === 'error') {
      className += ' error'
    }
    var wrap = document.createElement('div')
    wrap.className = className
    wrap.innerHTML = text
    wrapper.appendChild(wrap)
    if (duration > 0) {
      setTimeout(function () {
        wrap.parentNode.removeChild(wrap)
      }, duration)
    }
  }

  ;['success', 'warning', 'error'].forEach((type) => {
    Message[type] = function (text, duration) {
      Message({
        text: text,
        type: type,
        duration: duration,
      })
    }
  })
  window.Message = Message
})()

!(function () {
  var wrapper = null

  function addWrapper() {
    if (wrapper) {
      return
    }
    addStyle()
    wrapper = document.createElement('div')
    wrapper.className = 'e-message-wrap'
    document.body.appendChild(wrapper)
  }

  function addStyle() {
    var head = document.getElementsByTagName('head')[0]
    var style = document.createElement('style')
    style.innerHTML = `.e-message-wrap {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 5200;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .e-message-content {
      position: relative;
      padding: 8px 15px;
      background: #1cad70;
      color: #fff;
      font-size: 0.24rem;
      text-align: left;
      display: inline-block;
      min-width: 200px;
    }
    .e-message-content:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background-color: #18915e;
    }
    .e-message-content + .e-message-content {
      margin-top: 4px;
    }
    .e-message-content.error {
      background: #eb4646;
    }
    .e-message-content.error::before {
      background: #c73c3c;
    }
    .e-message-content.warning {
      background: #f59b00;
    }
    .e-message-content.warning::before {
      background: #d48701;
    }`
    head.appendChild(style)
  }

  function Message(options) {
    var text = options.text
    var type = options.type
    var duration = options.duration === undefined ? 3000 : options.duration
    addWrapper()
    var className = 'e-message-content'
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

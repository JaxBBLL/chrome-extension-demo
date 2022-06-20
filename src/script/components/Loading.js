!(function () {
  var wrapper = null

  function createWrapper() {
    if (wrapper) {
      return
    }
    wrapper = document.createElement('section')
    wrapper.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #fff; z-index: 100; display: none; justify-content: center; align-items: center; text-align: center;`
    wrapper.innerHTML = `<div class="loading">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 40 40"
  >
    <path
      opacity=".2"
      fill="#FF6700"
      d="M20.201 5.169c-8.254 0-14.946 6.692-14.946 14.946 0 8.255 6.692 14.946 14.946 14.946s14.946-6.691 14.946-14.946c-.001-8.254-6.692-14.946-14.946-14.946zm0 26.58c-6.425 0-11.634-5.208-11.634-11.634 0-6.425 5.209-11.634 11.634-11.634 6.425 0 11.633 5.209 11.633 11.634 0 6.426-5.208 11.634-11.633 11.634z"
    />
    <path
      fill="#FF6700"
      d="M31.135 16.65l3.15-1.017a14.855 14.855 0 0 0-4.19-6.5l-2.22 2.457a11.57 11.57 0 0 1 3.26 5.06z"
    >
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 20 20"
        to="360 20 20"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
    </svg>
    <div class="text"></div>
  </div>`
    wrapper = document.body.appendChild(wrapper)
  }

  var Loading = {
    show: function show(text) {
      createWrapper()
      wrapper.querySelector('.text').textContent = text
      wrapper.style.display = 'flex'
    },
    hide: function () {
      if (wrapper) {
        wrapper.querySelector('.text').textContent = ''
        wrapper.style.display = 'none'
      }
    },
  }

  window.Loading = Loading
})()

import Vue from 'vue'

Vue.directive('trim', {
  inserted(el) {
    const input = el.nodeName === 'INPUT' ? el :  el.querySelector('input')
    const handleTrim = () => {
      const inputEvt = new Event('input')
      const changeEvt = new Event('change')

      input.value = input.value.trim()
      input.dispatchEvent(inputEvt)
      input.dispatchEvent(changeEvt)
    }

    input.addEventListener('blur', () => {
      handleTrim()
    })

    input.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        handleTrim()
      }
    })
  },
})

Vue.directive('focus', {
  inserted: function (el, binding) {
      if (binding.value)
          el.focus();
      else
          el.blur();
  },
  componentUpdated: function (el, binding) {
      if (binding.value)
          el.focus();
      else
          el.blur();
  }
});
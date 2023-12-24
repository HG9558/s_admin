/**
 * evaz: 这是一个用mixin实现的缓存器
 * 使用方法：如果想缓存this.foo.bar
 * import queryStore from '@/mixins/queryStore'
 * mixins: [queryStore(['foo.bar'])]
 * 下次模块加载时会取出缓存中的值
 * @param {Array} params 
 * @return {Object}
 */
const queryStore = JSON.parse(sessionStorage.getItem('queryStore')) || {}

window.onbeforeunload = saveQueryStore

function saveQueryStore() {
  sessionStorage.setItem('queryStore', JSON.stringify(queryStore))
}

function getValueByStringKey(src, str) {// 根据字符串'foo.bar'获取src.foo.bar的值
  let acc = src;
  const arr = str.split('.')
  for (let i = 0; i < arr.length - 1; i++) {
    acc = acc[arr[i]]
  }
  return acc[arr[arr.length - 1]]
}

function setValueByStringKey(src, str, value) {
  let acc = src;
  const arr = str.split('.')
  for (let i = 0; i < arr.length - 1; i++) {
    acc = acc[arr[i]]
  }
  acc[arr[arr.length - 1]] = value
}

export {saveQueryStore}
export default function(params) {
  if (!Array.isArray(params)) {
    throw "requires Array"
  }
  const mixin = {
    created() {
      const {useQueryStoreCache} = this.$route.query
      if (useQueryStoreCache === 'yes') {
        const {path} = this.$route
        const query = queryStore[path]
        if (query) {
          for (let item of params) {
            setValueByStringKey(this, item, query[item])
          }
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      const {path} = from
      queryStore[path] = queryStore[path] || {}
      const query = queryStore[path]
      for (let item of params) {
        query[item] = getValueByStringKey(this, item)
      }
      next()
    }
  }
  return mixin
}
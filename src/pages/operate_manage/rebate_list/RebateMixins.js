import systemConfig from "../../../config/config";

export default {
  methods: {
    dealTime(val, format = `YYYY-MM`) {
      let timeStr = ``
      if (val) {
        const dd = new Date(val)
        const zeroFn = val => val > 9 ? val : `0${val}`
        const obj = {
          YYYY: dd.getFullYear(),
          MM: zeroFn(dd.getMonth() + 1),
          DD: zeroFn(dd.getDate())
        }
        for (let key in obj) {
          format = format.replace(key, obj[key])
        }
        timeStr = format
      }
      return timeStr
    },
    async getMbrGroup(cb) {
      const [res] = await this.$axios.get(systemConfig.urls.getMemberList, { _async_: true })
      if (res && res.code === 0) {
        const options = res.page.map(i => ({ label: i.groupName, value: i.id }))
        options.unshift({ label: this.$t('全部'), value: '' })
        typeof cb === 'function' && cb(options)
      }
    },
    async getMbrOptions(cb) {
      const [res] = await this.$axios.get(systemConfig.urls.mbrAccountLevellist, { _async_: true })
      if (res && res.code === 0) {
        const options = res.data.map(i => ({ label: i.tierName, value: i.id }))
        options.unshift({ label: this.$t('全部'), value: '' })
        typeof cb === 'function' && cb(options)
      }
    }
  }
}

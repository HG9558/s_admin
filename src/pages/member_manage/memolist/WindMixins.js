import WindTable from "./WindTable";
import WindSearch from "./WindSearch";

export default {
  components: {
    WindTable,
    WindSearch
  },
  data() {
    return {
      params: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: {
        list: [],
        totalCount: 0
      },
      loading: false,
      searchForm: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    transFormTime(time , type) {
      if (!time) return ''
      const dd = new Date(time)
      const year = dd.getFullYear()
      const month = dd.getMonth() + 1
      const date = dd.getDate()
      const zeroFn = val => val < 9 ? `0${val}` : val
      const str = `${year}-${zeroFn(month)}-${zeroFn(date)} ${type === 'start' ? '00:00:00' : '23:59:59'}`
      return str
    },
    transFormUrl(url, obj) {
      const arr = []
      for (let key in obj) {
        const val = obj[key]
        arr.push(`${key}=${this.transFormTime(val[0], val[1])}`)
      }
      return `${url}?${arr.join('&')}`
    },
    init() {
      this.getList()
    },
    handlePage(val) {
      this.params.pageNo = val
      this.getList()
    },
    handleSize(val) {
      this.params.pageSize = val
      this.getList()
    },
    onReset() {
      this.searchForm = {}
    },
    ifNotDoNotShow(columns, data) {
      const dd = data[0]
      const arr = columns.filter(i => i.prop ? dd[i.prop] : true)
      return arr
    },
    search() {
      this.getList()
    }
  }
}

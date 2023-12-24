export default {
  methods: {
    async agentCheckFile(module, checkUrl) {
      const { res, response } = await this.$axios.GET(checkUrl || this.$urls.agentApply.agyAccountReviewExportCheck, { module })
      if (res) {
        const { fileName } = res.data
        if (!fileName) {
          this.clearCheckFileTimer()
          this.checkFileTimer = setTimeout(() => {
            this.agentCheckFile(module, checkUrl)
          }, 1000)
        } else {
          this.downloadExcel(res.data, response)
        }
      }
    },
    async exportCheckFile(module, checkUrl) {
      await this.agentCheckFile(module, checkUrl)
    },
    clearCheckFileTimer() {
      if (this.checkFileTimer) {
        clearTimeout(this.checkFileTimer)
      }
    },
    downloadExcel({ downloadFileName, fileName }, { config }) {
      const { baseURL } = config
      const SToken = localStorage.getItem('SToken')
      const url = `${baseURL}/${this.$urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
      window.open(url)
    },
  },
  beforeDestroy() {
    this.clearCheckFileTimer()
  }
}

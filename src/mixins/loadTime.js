export default {
    data() {
        return {
            networkLoadTime: 'loading...',
            dataSolveTime: 'loading...',
            recodeTime: new Date().getTime(),
        }
    },
    methods: {
        getCurrentRecodeTime() {
            this.recodeTime = new Date().getTime()
            this.networkLoadTime = 'loading...'
            this.dataSolveTime = 'loading...'
        },
        getNetworkLoadAndDataSolveTime (res) {
            this.networkLoadTime = ((new Date().getTime() - this.recodeTime)/1000).toFixed(3) + 's'
            this.dataSolveTime = (res.headers['x-resp-time'].split('ms')[0]/1000).toFixed(3) + 's'
        },
        overRequestTime () {
            const overTime = this.$t('加载超时')
            this.networkLoadTime = overTime
            this.dataSolveTime = overTime
        }
    }
}

<template>
  <div class="device-ip">
    <div class="device-first">
      <div class="device-top">
        <div>
          <div class="bg center title">{{ $t('同IP用户数') }}</div>
          <div class="center val" @click="setType('leftBox', 'mbrPreferIP')">{{mbrDeviceIpTop.mbrPreferIP | number}}</div>
        </div>
        <div>
          <div class="bg center title">{{ $t('同IP优惠数') }}</div>
          <div class="center val" @click="setType('leftBox', 'mbrwithIPPrefNum')">{{mbrDeviceIpTop.mbrwithIPPrefNum | number}}</div>
        </div>
      </div>
      <div>
        <WindTable v-show="leftBox === 'mbrPreferIP'" :table="{ data: mbrPreferIP.list }" :loading="mbrPreferIP.loading" :columns="mbrPreferIP.colums" :size="mbrPreferIP.params.pageSize" :page="mbrPreferIP.params.pageNo" :total="mbrPreferIP.totalCount" @size="val => setPageSize(val, 'mbrPreferIP')" @page="val => setPageNo(val, 'mbrPreferIP')" />
        <WindTable v-show="leftBox === 'mbrwithIPPrefNum'" :table="{ data: mbrwithIPPrefNum.list }" :loading="mbrwithIPPrefNum.loading" :columns="mbrwithIPPrefNum.colums" :size="mbrwithIPPrefNum.params.pageSize" :page="mbrwithIPPrefNum.params.pageNo" :total="mbrwithIPPrefNum.totalCount" @size="val => setPageSize(val, 'mbrwithIPPrefNum')" @page="val => setPageNo(val, 'mbrwithIPPrefNum')" />
        <WindTable v-show="leftBox === 'getIPPrefNum'" :table="{ data: getIPPrefNum.list }" :loading="getIPPrefNum.loading" :columns="getIPPrefNum.colums" :size="getIPPrefNum.params.pageSize" :page="getIPPrefNum.params.pageNo" :total="getIPPrefNum.totalCount" @size="val => setPageSize(val, 'getIPPrefNum')" @page="val => setPageNo(val, 'getIPPrefNum')" />
      </div>
    </div>
    <div class="device-second">
      <div class="device-top">
        <div>
          <div class="bg center title">{{ $t('同设备用户数') }}</div>
          <div class="center val" @click="setType('rightBox', 'mbrPreferDevice')">{{mbrDeviceIpTop.mbrPreferDevice | number}}</div>
        </div>
        <div>
          <div class="bg center title">{{ $t('同设备优惠数') }}</div>
          <div class="center val" @click="setType('rightBox', 'mbrwithDevicePrefNum')">{{mbrDeviceIpTop.mbrwithDevicePrefNum | number}}</div>
        </div>
      </div>
      <div>
        <WindTable v-show="rightBox === 'mbrPreferDevice'" :table="{ data: mbrPreferDevice.list }" :loading="mbrPreferDevice.loading" :columns="mbrPreferDevice.columns" :size="mbrPreferDevice.params.pageSize" :page="mbrPreferDevice.params.pageNo" :total="mbrPreferDevice.totalCount" @size="val => setPageSize(val, 'mbrPreferDevice')" @page="val => setPageNo(val, 'mbrPreferDevice')" />
        <WindTable v-show="rightBox === 'mbrwithDevicePrefNum'" :table="{ data: mbrwithDevicePrefNum.list }" :loading="mbrwithDevicePrefNum.loading" :columns="mbrwithDevicePrefNum.columns" :size="mbrwithDevicePrefNum.params.pageSize" :page="mbrwithDevicePrefNum.params.pageNo" :total="mbrwithDevicePrefNum.totalCount" @size="val => setPageSize(val, 'mbrwithDevicePrefNum')" @page="val => setPageNo(val, 'mbrwithDevicePrefNum')" />
        <WindTable v-show="rightBox === 'getDevicePrefNum'" :table="{ data: getDevicePrefNum.list }" :loading="getDevicePrefNum.loading" :columns="getDevicePrefNum.columns" :size="getDevicePrefNum.params.pageSize" :page="getDevicePrefNum.params.pageNo" :total="getDevicePrefNum.totalCount" @size="val => setPageSize(val, 'getDevicePrefNum')" @page="val => setPageNo(val, 'getDevicePrefNum')" />
      </div>
    </div>
  </div>
</template>

<script>
import systemConfig from "../../../config/config";
import WindTable from "./WindTable";

const objAsign = (val1, val2) => ({ ...val1, ...val2 })
const apis = {
  mbrPreferIP: 'bkapi/member/wind/mbrPreferIP',
  mbrwithIPPrefNum: 'bkapi/member/wind/mbrwithIPPrefNum',
  getIPPrefNum: 'bkapi/member/wind/getBonusList',
  mbrPreferDevice: 'bkapi/member/wind/mbrPreferDevice',
  mbrwithDevicePrefNum: 'bkapi/member/wind/mbrwithDevicePrefNum',
  getDevicePrefNum: 'bkapi/member/wind/getBonusList'
}

export default {
  name: "mbrdeviceiP",
  props: ['accountId'],
  components: {
    WindTable
  },
  data() {
    return {
      params: {
        pageSize: 10,
        pageNo: 1
      },
      Loading: false,
      mbrPreferIP: {
        list: [],
        totalCount: 0,
        totalPage: 0,
        colums: [
          { label: this.$t('会员账户'), prop: 'loginName' },
          { label: this.$t('上级代理'), prop: 'agyAccount' },
          { label: this.$t('IP地址'), prop: 'loginIp' },
          { label: this.$t('登录时间'), prop: 'loginTime' },
        ],
        loading: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      },
      mbrwithIPPrefNum: {
        list: [],
        totalCount: 0,
        totalPage: 0,
        colums: [
          { label: this.$t('会员账户'), prop: 'loginName' },
          { label: this.$t('上级代理'), prop: 'agyAccount' },
          { label: this.$t('IP地址'), prop: 'loginIp' },
          { label: this.$t('领取优惠数量'), render: (h, row) => {
              return h('span', { class: 'number', on: { click: () => {
                    this.leftBox = 'getIPPrefNum'
                    this.LbonusId = row.accountId
                    this.getGetIPPrefNum(row)
                  } } }, row.totalBonusAmountNum)
            } },
        ],
        loading: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      },
      getIPPrefNum: {
        list: [],
        totalCount: 0,
        totalPage: 0,
        colums: [
          { label: this.$t('领取优惠时间'), prop: 'appTime' },
          { label: this.$t('活动类别'), prop: 'catName' },
          { label: this.$t('活动名称'), prop: 'activityName' },
          { label: this.$t('优惠金额'), prop: 'totalBonusAmount' },
        ],
        loading: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      },
      mbrPreferDevice: {
        list: [],
        totalCount: 0,
        totalPage: 0,
        columns: [
          { label: this.$t('会员账户'), prop: 'loginName' },
          { label: this.$t('上级代理'), prop: 'agyAccount' },
          { label: this.$t('设备类型'), prop: 'deviceType' },
          { label: this.$t('登录时间'), prop: 'loginTime' },
        ],
        loading: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      },
      mbrwithDevicePrefNum: {
        list: [],
        totalCount: 0,
        totalPage: 0,
        columns: [
          { label: this.$t('会员账户'), prop: 'loginName' },
          { label: this.$t('上级代理'), prop: 'agyAccount' },
          { label: this.$t('设备类型'), prop: 'deviceType' },
          { label: this.$t('领取优惠数量'), render: (h, row) => {
              return h('span', { class: 'number', on: { click: () => {
                    this.rightBox = 'getDevicePrefNum'
                    this.RbonusId = row.accountId
                    this.getGetDevicePrefNum(row)
                  } } }, row.totalBonusAmountNum)
            } },
        ],
        loading: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      },
      getDevicePrefNum: {
        list: [],
        totalCount: 0,
        totalPage: 0,
        columns: [
          { label: this.$t('领取优惠时间'), prop: 'appTime' },
          { label: this.$t('活动类别'), prop: 'catName' },
          { label: '活动名称 ', prop: 'activityName' },
          { label: this.$t('优惠金额'), prop: 'totalBonusAmount' },
        ],
        loading: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      },
      leftBox: 'mbrPreferIP',
      rightBox: 'mbrPreferDevice',
      mbrDeviceIpTop: {},
      RbonusId: null,
      LbonusId: null
    }
  },
  created() {
    this.init()
  },
  filters: {
    number(val) {
      return val || 0
    }
  },
  methods: {
    init() {
      this.getMbrDeviceIpTop()
    },
    async getData(key, resKey, accountId) {
      const { params } = this[key]
      const _params = {
        _async_: true,
        accountId: accountId || this.accountId,
        ...params
      }
      this[key].loading = true
      const [res] = await this.$axios.get(apis[key], _params)
      this[key].loading = false
      if (res && res.code === 0) {
        this[key] = objAsign(this[key], res[resKey])
      }
    },
    getGetDevicePrefNum({ accountId }) {
      this.getData('getDevicePrefNum', 'bonusList', accountId)
    },
    getMbrwithDevicePrefNum() {
      this.getData('mbrwithDevicePrefNum', 'activityDevice')
    },
    getMbrPreferDevice() {
      this.getData('mbrPreferDevice', 'activityDevice')
    },
    async getGetIPPrefNum({ accountId }) {
      this.getData('getIPPrefNum', 'bonusList', accountId)
    },
    async getMbrwithIPPrefNum() {
      this.getData('mbrwithIPPrefNum', 'activityDevice')
    },
    async getMbrPreferIP() {
      this.getData('mbrPreferIP', 'activityIP')
    },
    setType(key, val) {
      this[key] = val
      this.getTable(val)
    },
    getTable(key) {
      const objFn = {
        mbrPreferIP: 'getMbrPreferIP',
        mbrwithIPPrefNum: 'getMbrwithIPPrefNum',
        getIPPrefNum: 'getGetIPPrefNum',
        mbrPreferDevice: 'getMbrPreferDevice',
        mbrwithDevicePrefNum: 'getMbrwithDevicePrefNum',
        getDevicePrefNum: 'getGetDevicePrefNum',
      }
      const accountId = key === 'getDevicePrefNum' ? this.RbonusId :this.LbonusId
      this[objFn[key]]({ accountId })
    },
    setPageNo(val, key) {
      this[key].params.pageNo = val
      this.getTable(key)
    },
    setPageSize(val, key) {
      this[key].params.pageSize = val
      this[key].params.pageNo = 1
      this.getTable(key)
    },
    async getMbrDeviceIpTop() {
      let params = {
        _async_: true,
        accountId: this.accountId
      }
      const [res] = await this.$axios.get(systemConfig.urls.windMbrDeviceIpTop, params)
      if (res && res.code === 0) {
        this.mbrDeviceIpTop = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.device-ip {
  display: flex;
  justify-content: space-between;
  > div {
    width: 48%;
  }
  .bg {
    background: #f6f7f8;
  }
  .center {
    text-align: center;
  }
  .title {
    padding: 10px;
  }
  .val {
    padding: 20px 10px 40px;
    color: #03a9f4;
    cursor: pointer;
  }
  /deep/ .number {
    color: #03a9f4;
    cursor: pointer;
  }
  .device-top {
    display: flex;
    > div {
      width: 50%;
    }
  }
}
</style>

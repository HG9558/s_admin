import { lang } from "../i18n";

const currency = localStorage.getItem('currency')
export default {
  data() {
    return {}
  },
  methods: {
    currencyText() {
      // let str = ''
      // switch (currency) {
      //   case 'AUD':
      //     str = 'AUD'
      //     break;
      //   case 'MYR':
      //     str = 'MYR'
      //     break;
      //   case 'PHP':
      //     str = 'PHP'
      //     break
      //   default:
      //     str = lang('元')
      //     break;
      // }
      // return str
      return currency || 'RMB'
    },
    currencyType() {
      let str = ''
      // switch (currency) {
      //   case 'AUD':
      //     str = 'AUD' + ' '
      //     break;
      //   case 'MYR':
      //     str = 'MYR' + ' '
      //     break;
      //   case 'PHP':
      //     str = 'PHP' + ' '
      //     break
      //   default:
      //     str = lang('人民币') + ' '
      //     break;
      // }
      // return str
      return currency || 'RMB'
    },
    currencySymbol() {
      // let str = ''
      // switch (currency) {
      //   case 'AUD':
      //     str = 'AUD'
      //     break;
      //   case 'MYR':
      //     str = 'MYR'
      //     break;
      //   case 'PHP':
      //     str = 'PHP'
      //     break
      //   default:
      //     str = 'CNY'
      //     break;
      // }
      // return str
      return currency || 'RMB'
    }
  }
}

import Vue from "vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import ElementUI from "element-ui";
import locale from 'element-ui/lib/locale'

/* 引入公共组件 */
import STableCom from "../components/STableCom";
import TableCom from "../components/TableCom";
import StartAndEndTimeSelector from "../components/StartAndEndTimeSelector";
import TestLabel from "../components/TestLabel";
import TableSearchBar from "../components/TableSearchBar";
import Snapshots from "../components/Snapshots";

import SdyInput from "../components/SdyInput";

const langs = {
    // vi: require('element-ui/lib/locale/lang/vi').default,
    en_us: require('element-ui/lib/locale/lang/en').default,
    zh: require('element-ui/lib/locale/lang/zh-CN').default
}

export const changeElLang = lang => {
    locale.use(langs[lang])
}

Vue.use(ElementUI, { size: "small", zIndex: 3000 });
Vue.component(VueQrcode.name, VueQrcode);
Vue.component("TableCom", TableCom);
Vue.component("STableCom", STableCom);
Vue.component("StartAndEndTimeSelector", StartAndEndTimeSelector);
Vue.component("GlobalComponentTestLabel", TestLabel);
Vue.component("TableSearchBar", TableSearchBar);
Vue.component("Snapshots", Snapshots);
Vue.component("SdyInput", SdyInput);

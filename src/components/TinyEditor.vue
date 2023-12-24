<template>
  <Editor :disabled="disabled" v-model="contentObserver" :init="editorConfig" v-if="show"/>
</template>
<script>
import { compressImage } from '@/config/utils'
import systemConfig from '@/config/config.js'
import tinymce from 'tinymce'
import 'tinymce/themes/modern/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/image'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/link'

let language = localStorage.getItem('lang')
let language_url = ''
if (language === 'zh') {
  language = 'zh_CN'
  language_url = '/static/tinymce/langs/zh_CN.js'
} else if (language === 'vi') {
  language = 'vi'
  language_url = '/static/tinymce/langs/vi.js'
} else {
  language = 'en'
}

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: String | Boolean,
      default: 'undo redo |  formatselect | fontselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat | forecolor backcolor | link'
    }
  },
  model: {
    prop: 'content',
    event: 'change'
  },
  components: {
    Editor
  },
  computed: {
    contentObserver: {
      get() {
        return this.content
      },
      set(value) {
        this.$emit('change', value)
      }
    }
  },
  data() {
    return {
      tinymceHtml: '',
      editorConfig: {
        skin_url: '/static/tinymce/skins/lightgray',
        // language_url: '/static/tinymce/langs/zh_CN.js',
        // language: 'zh_CN',
        language_url,
        language,
        height: 300,
        branding: false,
        menubar: false,
        plugins: 'table lists image textcolor link',
        toolbar: this.toolbar,
        textcolor_map: [
          "000000", "Black",
          "993300", "Burnt orange",
          "333300", "Dark olive",
          "003300", "Dark green",
          "003366", "Dark azure",
          "000080", "Navy Blue",
          "333399", "Indigo",
          "333333", "Very dark gray",
          "800000", "Maroon",
          "FF6600", "Orange",
          "808000", "Olive",
          "008000", "Green",
          "008080", "Teal",
          "0000FF", "Blue",
          "666699", "Grayish blue",
          "808080", "Gray",
          "FF0000", "Red",
          "FF9900", "Amber",
          "99CC00", "Yellow green",
          "339966", "Sea green",
          "33CCCC", "Turquoise",
          "3366FF", "Royal blue",
          "800080", "Purple",
          "999999", "Medium gray",
          "FF00FF", "Magenta",
          "FFCC00", "Gold",
          "FFFF00", "Yellow",
          "00FF00", "Lime",
          "00FFFF", "Aqua",
          "00CCFF", "Sky blue",
          "993366", "Red violet",
          "FFFFFF", "White",
          "FF99CC", "Pink",
          "FFCC99", "Peach",
          "FFFF99", "Light yellow",
          "CCFFCC", "Pale green",
          "CCFFFF", "Pale cyan",
          "99CCFF", "Light sky blue",
          "CC99FF", "Plum"
        ],
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          let fd = new FormData()
          fd.append('uploadFile',blobInfo.blob())
          let res = this.upload(fd);
          res.then(resp => {
            success(resp);
          })
            .catch(err => {
              failure(err);
            })
        }
      },
      show: true,
    }
  },
  methods: {
    upload(formData) {
      return this.$axios.post(systemConfig.urls.uploadImage, formData)
      .then(res => {
        return res.data.path
      })
    }
  },
  mounted() {
    tinymce.init({});
  },
  watch: {
    toolbar(n, o) { // 同一组件不同toolbar展示，重新加载edit
      if (n !== o ) {
        this.show = false
        this.$nextTick(() => {
          this.$set(this.editorConfig, 'toolbar', n)
          this.show = true
          tinymce.init({});
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

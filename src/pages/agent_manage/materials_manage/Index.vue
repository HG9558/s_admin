<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
    </TableSearchBar>
    <div class="button_operate">
      <el-button @click="goback" :class="[imageFileShow ? 'none': '']">{{ $t('返回') }}
      </el-button>
      <el-button v-if="delete_show" @click="deletSelect" type="danger">{{ $t('删除') }}
      </el-button>
    </div>
    <div v-loading="loading" class="mh250">
      <!-- 文件夹 -->
      <el-checkbox-group v-if="imageFileShow" v-model="checkListFileIds" class="img">
        <div v-for="(item, index) in imageFileList" :key="index" class="item">
          <el-checkbox :label="item.id" class="check_item">
          </el-checkbox>
          <div class="img_item" @click.stop="openImgFile(item)">
            <img src="./img/imgList.png" alt="" height="120px">
          </div>
          <div class="name">{{item.name}}</div>
        </div>
        <div class="item" v-if="permissions.add && (currentPage === Math.ceil(totalCount/pageSize) || imageFileList.length === 0)">
          <div class="img_item" @click.stop="addFileShow()">
            <i class="el-icon-plus qrcode-pay__upload-icon"></i>
          </div>
          <div class="name"></div>
        </div>
      </el-checkbox-group>
      <!-- 图片 -->
      <el-checkbox-group v-else v-model="checkImgIds" class="img i2">
        <div v-for="(item, index) in imageList" :key="index" class="item">
          <el-checkbox :label="item.id" class="check_item img_top">
          </el-checkbox>
          <div class="img_item none_pointer">
            <img :src="item.fileName" alt="" height="120px">
          </div>
          <div class="name">{{item.name}}</div>
        </div>
        <div class="item" v-if="permissions.addDetail && (currentPage === Math.ceil(totalCount/pageSize) || imageList.length === 0)">
          <div class="img_item" @click.stop="addImgShow()">
            <i class="el-icon-plus qrcode-pay__upload-icon"></i>
          </div>
          <div class="name"></div>
        </div>
      </el-checkbox-group>
    </div>

    <!-- 添加文件夹弹窗 -->
    <span v-if="addFileShowDialog">
      <el-dialog :title="$t('新建文件夹')" :visible.sync="addFileShowDialog" center>
        <el-form class="form-wrapper" label-position="right" label-width="100px" label-suffix=":" ref="fileModel" :model="fileModel" :rules="rules">
          <el-form-item prop="name" :label="$t('名称')" class="file_name">
            <el-input v-model="fileModel.name" :label="$t('请输入文件夹名称')"></el-input>
          </el-form-item>
        </el-form>
        <div class="button_footer">
          <el-button @click="handleCancelAddFile">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click.once="handleAddFileSubmit">{{ $t('确定') }}</el-button>
        </div>
      </el-dialog>
    </span>
    <!-- 添加图片弹窗 -->
    <span v-if="addImgShowDialog">
      <el-dialog :title="$t('添加图片')" :visible.sync="addImgShowDialog" center>
        <el-form label-position="right" label-width="auto" label-suffix=":" ref="imgModel" :model="imgModel" :rules="imgRules">
          <el-form-item prop="name" :label="$t('名称')" class="file_name">
            <el-input v-model="imgModel.name" :label="$t('请输入文件夹名称')"></el-input>
          </el-form-item>
          <el-form-item prop="uploadFile" :label="$t('上传图片')" class="img_name">
            <el-upload class="operation-bar-item" action="" :limit="1" :show-file-list="false" :http-request="handleUploadImage">
              <el-button size="small" type="primary">{{ $t('选择图片') }}</el-button>
              <div v-show="isUploading" class="upload-img-tip" slot="tip">
                <el-button size="small" type="primary">{{ $t('正在上传图片') }}..</el-button>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="button_footer">
          <el-button @click="handleCancelAddImg">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click.once="handleAddImgSubmit">{{ $t('确定') }}</el-button>
        </div>
      </el-dialog>
    </span>
    <div class="page_bottom">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1,10, 20, 30, 40, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <div>
      &nbsp;
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import systemConfig from "../../../config/config";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  data() {
    return {
      searchCriteria: {
        keys: {
          name: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("图片名称"),
            prop: "name",
            style: { width: '200px' }
          },
        ],
      },
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      imageFileShow: true,
      imageFileList: [],
      checkListFileIds: [],
      addFileShowDialog: false,
      addImgShowDialog: false,
      fileModel: {
        name: null,
      },
      rules: {
        name: [
          {required: true, message: this.$t("请输入文件夹名称"), trigger: "change"},
          {max: 20, message: this.$t('长度最多20字符'), trigger: 'change'},
        ],
      },
      loading: false,
      checkImgIds: [],
      materialId: null,
      formData: "",
      imageList: [],
      imgModel: {
        name: null,
        // uploadFile: null,
      },
      imgRules: {
        name: [
          {required: true, message: this.$t("请输入文件夹名称"), trigger: "change"},
          {max: 20, message: this.$t('长度最多20字符'), trigger: 'change'},
        ],
      },
      isUploading: false,
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("agent:materia:add"),
        delete: hasPermission("agent:materia:delete"),
        addDetail: hasPermission("agent:materiadetail:add"),
        deleteDetail: hasPermission("agent:materiadetail:delete"),
      };
    },
    delete_show(){
      if(this.imageFileShow&&this.permissions.delete){
        return true
      }
      if(!this.imageFileShow&&this.permissions.deleteDetail){
        return true
      }
      return false
    }
  },
  mounted() {
    this.getTableData();
    this.imageFileShow = true;
  },
  methods: {
    goback() {
      this.imageFileShow = true;
      this.searchCriteria = {
        keys: {
          name: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("图片名称"),
            prop: "name",
          },
        ],
      }
      this.pageSize = 10;
      this.currentPage = 1;
      this.getTableData();
    },
    deletSelect() {
      const bool = this.imageFileShow
        ? !this.checkListFileIds.length
        : !this.checkImgIds.length;
      if (bool) {
        this.$message.warning(this.$t("请勾选需要删除的内容"));
        return;
      }
      if (this.imageFileShow) {
        const params = {
          ids: this.checkListFileIds,
        };
        this.$axios.post(systemConfig.urls.material.delete, params).then(() => {
          this.getTableData();
        });
      } else {
        const params = {
          ids: this.checkImgIds,
        };
        this.$axios
          .post(systemConfig.urls.material.detailDelete, params)
          .then(() => {
            this.openImgFile({ id: this.materialId });
          });
      }
    },
    handleSubmit(formModel) {
      this.$axios.post(systemConfig.urls.material.add, formModel).then(() => {
        this.getTableData();
      });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.loading = true;
      let params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        ...this.searchCriteria.keys,
      };
      if (!this.imageFileShow) {
        params.materialId = this.materialId;
      }
      const url = this.imageFileShow
        ? systemConfig.urls.material.list
        : systemConfig.urls.material.detailList;
      this.$axios
        .get(url, {
          params,
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.loading = false;
          const { list, totalCount } = res.data.page;
          this.totalCount = totalCount;
          if (this.imageFileShow) {
            this.imageFileList = list;
          } else {
            this.imageList = list
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    openImgFile({ id }) {
      this.loading = true;
      this.materialId = id;
      this.$axios
        .get(systemConfig.urls.material.detailList, {
          params: {
            pageSize: this.pageSize,
            pageNo: 1,
            materialId: id,
          },
        })
        .then((res) => {
          const { list, totalCount,currPage } = res.data.page;
          this.imageList = []
          for(let i in list){
            this.imageList.push(list[i])
          }
          this.totalCount = totalCount;
          this.currentPage = currPage;
          setTimeout(()=>{
            this.loading = false;
          },5000)
          this.imageFileShow = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    addFileShow() {
      this.addFileShowDialog = true;
    },
    addImgShow() {
      this.addImgShowDialog = true;
    },
    handleAddFileSubmit() {
      this.$refs.fileModel.validate((valid) => {
        if (valid) {
          this.$axios
            .post(systemConfig.urls.material.add, {
              ...this.fileModel,
            })
            .then((res) => {
              if (res) {
                this.handleCancelAddFile()
                this.getTableData();
              }
            });
        }
      });
    },
    handleCancelAddFile() {
      this.addFileShowDialog = false;
      this.fileModel.name = null
    },
    handleUploadImage({ file }) {
      if (/^image/.test(file.type)) {
        this.uploadFile = file;
        const formData = new FormData();
        formData.append("uploadFile", file);
      } else {
        this.uploadFile = "";
        this.$message.error(this.$t("文件格式错误，只支持图片！"));
      }
    },
    handleAddImgSubmit() {
      this.$refs.imgModel.validate((valid) => {
        if (valid) {
          if (!this.uploadFile) {
            this.$message.warning(this.$t("请上传图片"));
            return;
          }
          const formData = new FormData();
          formData.append("uploadFile", this.uploadFile);
          formData.append("name", this.imgModel.name);
          formData.append("materialId", this.materialId);
          this.$axios
            .post(systemConfig.urls.material.detailAdd, formData)
            .then((res) => {
              if (res) {
                this.imgModel = this.$options.data().imgModel;
                this.uploadFile = "";
                this.addImgShowDialog = false;
                this.openImgFile({ id: this.materialId });
              }
            });
        }
      });
    },
    handleCancelAddImg() {
      this.addImgShowDialog = false;
      this.imgModel = this.$options.data().imgModel;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getTableData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableData();
    }
  },
};
</script>

<style lang="scss" scoped>
.none {
  border: none;
  background-color: #fff;
  visibility: hidden;
}
.button_operate {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.mh250 {
  min-height: 520px;
}
.img {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 20px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
  .item {
    width: 20%;
    position: relative;
    /deep/ .check_item {
      z-index: 2;
    }
    .img_item {
      width: 80%;
      height: 160px;
      cursor: pointer;
      border: 1px solid #797979;
      margin: 25px 25px 10px 0;
      padding: 0 10px;
      line-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 180px;
      }
    }
    .none_pointer {
      cursor: inherit;
    }
    .name {
      width: 222px;
    }
    /deep/ .el-checkbox {
      position: absolute;
      right: 18%;
      top: 18%;
      .el-checkbox__label {
        display: none;
      }
    }
    /deep/ .el-icon-plus {
      font-size: 18px;
      font-weight: 600;
    }
  }
}

/deep/ .el-dialog {
  .el-form {
    // display: flex;
    // justify-content: center;
    .file_name {
      width: 400px;
      // margin-bottom: 80px !important;
    }
  }
  .button_footer {
    margin: 30px 0 20px;
    text-align: center;
  }
}

.page_bottom {
  /deep/ .el-pagination {
    float: right;
  }
}
.i2 span .item{
  width: 100%;
}
.intTime {
  padding-top: 0;
  margin-top: 35px;
}
</style>

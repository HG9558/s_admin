<template>
  <!-- 全局组件 对话框 -->
  <el-dialog :title="$t('查看推广链接')" :visible="visible" @close="handleClose">
    {{ isAgent ? $t('所属代理') : $t('所属会员') }}：{{ promotionAccount }}
    <ul class="promotion-links-wrapper">
      <!-- 通用链接 -->
      <li class="promotion-links-item" v-show="basePromotionH5Link">
        <span class="promotion-link">
          <template v-if="isAgent">
            {{ $t('通用链接') }}：
          </template>
          {{ basePromotionH5Link }}
          <CopyButton :copyContent="basePromotionH5Link" />
        </span>
        <qrcode
          v-if="basePromotionH5Link"
          :value="padProtocol(basePromotionH5Link)"
          :options="{ width: 100 }"
        ></qrcode>
      </li>
      <!-- 推广链接 -->
      <li
        class="promotion-links-item"
        v-for="(item, index) in unbasePromotionLinks"
        :key="index"
      >
        <span class="promotion-link">
          {{ $t('推广链接') }}{{ (currPage - 1) * promotionPageSize + index + 1 }}：{{
            item.domainUrl
          }}
          <CopyButton :copyContent="item.domainUrl" />
        </span>
        <a
          href="javascript:;"
          class="promotion-links-item_delete el-icon-circle-close"
          @click="handleDelete(item.id)"
          v-if="hasDeleteLimit"
        ></a>
        <qrcode
          :value="padProtocol(item.domainUrl)"
          :options="{ width: 100 }"
        ></qrcode>
      </li>
    </ul>
    <el-pagination
      v-if="isAgent"
      class="promotion-links-pagination"
      @current-change="handleCurrentChange"
      :current-page="promotionCurrentPage"
      :page-size="promotionPageSize"
      layout="prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>
    <template slot="footer">
      <el-button size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import CopyButton from "../../../components/CopyButton";

export default {
  components: {
    CopyButton
  },
  props: [
    'isAgent',
    "visible",
    "promotionAccount",
    "promotionLinks",
    "promotionCurrentPage",
    "promotionPageSize",
    "hasDeleteLimit"
  ],
  computed: {
    currPage() {
      const { promotionLinks } = this;
      if (promotionLinks) {
        return promotionLinks.unbase.currPage;
      }
    },
    totalCount() {
      const { promotionLinks } = this;
      if (promotionLinks) {
        return promotionLinks.unbase.totalCount;
      }
    },
    unbasePromotionLinks() {
      const { promotionLinks } = this;
      if (promotionLinks) {
        return promotionLinks.unbase.list;
      } else {
        return [];
      }
    },
    basePromotionLink() {
      const { promotionLinks } = this;
      if (promotionLinks) {
        return promotionLinks.base ? promotionLinks.base.promotionUrl : "";
      } else {
        return "";
      }
    },
    basePromotionH5Link() {
      const { promotionLinks } = this;
      if (promotionLinks) {
        return promotionLinks.base ? promotionLinks.base.promotionH5Url : "";
      } else {
        return "";
      }
    }
  },
  methods: {
    handleCurrentChange(value) {
      this.$emit("update:promotionCurrentPage", value);
      this.$emit("pageChange");
    },
    handleDelete(id) {
      this.$emit("delete", id);
    },
    padProtocol(url) {
      return url;
      //return /^http/.test(url) ? url : "http://" + url;
    },
    handleClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.promotion-links-wrapper {
  margin-top: 20px;
  .promotion-links-item {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px dashed #eee;
    padding: 10px;
    border-bottom: 0;
    &:first-of-type {
      margin-bottom: 20px;
      border-bottom: 1px dashed #eee;
    }
    &:last-of-type {
      border-bottom: 1px dashed #eee;
    }
    .promotion-links-item_delete {
      position: absolute;
      top: 5px;
      right: 5px;
      color: #333;
      font-size: 14px;
      &:hover {
        color: #444;
      }
      &:active {
        color: #555;
      }
    }
  }
  .promotion-link {
    flex: 1;
    margin-left: 20px;
  }
}
.promotion-links-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

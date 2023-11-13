<template>
  <!-- 图片 -->
  <el-image
    class="ml-image"
    :preview-src-list="previewSrcList"
    :src="src"
    :fit="fit"
    alt=""
  >
    <template #error>
      <div class="upload-error-empty">
        <el-icon color="#dedfe0" :size="emptySize"><PictureFilled /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup>
import { ref, onMounted, computed, watch, getCurrentInstance } from "vue";
import { PictureFilled } from "@element-plus/icons-vue";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  fit: {
    type: String,
    default: "cover",
  },
  emptySize: {
    type: [String, Number],
    default: 40,
  },
  previewSrcList:{
    type: Array,
    default: ()=>[],
  }
});
</script>

<style lang="scss" scoped>
.ml-image {
  width: 100%;
  height: 100%;

  .upload-error-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
  }
}
</style>
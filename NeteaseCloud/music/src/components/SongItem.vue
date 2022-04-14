<template>
  <div>
    <van-cell center :title="name" :label="author + ' - ' + name">
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="play-circle-o" size="0.6rem" @click="playFn" />
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  props: {
    name: String, // 歌名
    author: String, // 歌手
    id: Number, // 歌曲id (标记这首歌曲-为将来跳转播放页做准备)
  },
  methods: {
    playFn() {
      this.$router.push({
        path: '/play',
        query: {
          id: this.id // 歌曲id，通过路由跳转传递过去
        }
      })
    }
  }
}
</script>

<style scoped>
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>
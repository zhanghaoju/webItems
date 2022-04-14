<template>
  <div>
    <!--file-list上传的文件列表 可以绑定到上传组件上 让上传组件来显示-->
    <!--upload组件显示的filelist的内容-->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled: fileComputed}"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos的包
// 实例化cos对象 需要两个参数
const coss = new COS({
  SecretId: 'AKIDyzzzxrgMtTt78vTnsjMlvtd8OPBiz1nM', // 身份识别ID
  SecretKey: 'OYWGm5A1e3D9rLbcVAappb8RXQ6ZruhH' // 身份密钥
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的uid,
      percent: 0, // 当前进度的百分比
      showPercent: false
    }
  },
  computed: {
    // 如果为true表示不应该显示+
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 点击预览事件
      console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file 要删除的文件  fileList删过之后的文件
    handleRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
      // 将当前删除的文件排除在外
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList
    },
    // 不能使用push 会执行多次
    changeFile(file, fileList) {
      // file是当前的文件 fileList是当前的最新数组
      /* console.log(123)
      console.log(file)
      console.log(fileList)*/
      console.log(fileList.length)
      // 如果当前filelist中没有该文件就往里追加
      this.fileList = fileList.map(item => item)
      // 因为现在还没有上传，所有第二次进来的数据一定是个空的
      // 如果完成了上传动作，第一次进入和第二次进去的fileList的长度应该都是1，应该都有数据
      // 上传成功之后数据才会进来
    },
    beforeUpload(file) {
      console.log(file)
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小 5M 1M=1024kb
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 超过限制大小
        this.$message.error('图片大小不能大于5M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      console.log(file)
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后要return一个true 这样可以继续上传
    },
    upload(params) {
      console.log(params.file)
      // 如果上传文件存在
      if (params.file) {
        // 执行上传操作
        coss.putObject({
          Bucket: 'noah-zhang-1302621537', // 存储桶
          Region: 'ap-shanghai', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: (params) => {
            console.log(params)
            this.percent = params.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          // 根据返回的状态判断
          if (!err && data.statusCode === 200) {
            // 说明文件上传成功 获取成功的返回地址  要将filelist中数据的url地址换成现在上传成功的地址
            // 目前虽然是一张图片，filelist是一个数组可以存多张照片
            // 需要知道当前上传成功的是哪一张
            this.fileList = this.fileList.map(item => {
              // 去找是的uid等于刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                // upload:true 表示这张图片已经上传完毕 这个属性要为后期应用的时候做标记
                // 保存图片的时候有大有小，上传速度有快有慢 要根据有没有upload这个标记决定是否去保存
                return { url: 'http://' + data.Location, upload: true }
              } else {
                return item
              }
            })
            // 将上传成功的地址 回写到fileList中 fileList变化 upload组件就会根据filelist变化而去渲染页面
            // 关闭进度条 重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}
</style>

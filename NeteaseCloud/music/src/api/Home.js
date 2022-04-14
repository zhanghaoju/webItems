// 文件名-尽量和模块页面文件名统一(方便查找)
// 拿到网络请求
import request from "@/utils/request";
// 首页-推荐歌单
export const recommendMusic = params => request({
    url: '/personalized',
    // params: { limit: 30 }
    params
    // 将来外面可能传入params值(limit:20)
});
// 首页-推荐最新音乐
export const newMusic = params => request({
    url: '/personalized/newsong',
    params
})